"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import characterImage from "../../assets/character.png";
import backgroundImage from "../../assets/EpisodeBack.png";
import { useLocation } from "react-router";

// SpeechRecognition 타입 선언 (기존과 동일)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export default function Play() {
  const [messages, setMessages] = useState<{ speaker: string; text: string }[]>(
    [{ speaker: "", text: "안녕~ 만나서 반가워!" }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  // 디버깅을 위한 새로운 상태들
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [recognitionState, setRecognitionState] = useState<
    "idle" | "starting" | "running" | "stopping"
  >("idle");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartTime = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  const location = useLocation();
  // selectedEpisode 변수 제거하고 필요시 직접 location.state 사용

  const [myName, characterName, characterId] = [
    "김윤배",
    "캐릭터 이름 넣어",
    "캐릭터 아이디넣어",
  ];

  // 디버그 로그 추가 함수
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev.slice(-9), `[${timestamp}] ${message}`]);
    console.log(`[Voice Debug] ${message}`);
  };

  // 오디오 레벨 측정 함수
  const measureAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // 평균 오디오 레벨 계산
    const average =
      dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
    setAudioLevel(Math.round(average));

    // 녹음 시간 업데이트
    if (recordingStartTime.current) {
      const duration = Math.floor(
        (Date.now() - recordingStartTime.current) / 1000
      );
      setRecordingDuration(duration);
    }

    if (isRecording) {
      animationRef.current = requestAnimationFrame(measureAudioLevel);
    }
  };

  // 마이크 권한 및 오디오 컨텍스트 설정
  const setupAudioMonitoring = async () => {
    try {
      addDebugLog("마이크 권한 요청 중...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      addDebugLog("마이크 권한 승인됨");

      // AudioContext 생성
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      // 마이크 입력을 AudioContext에 연결
      microphoneRef.current = audioContext.createMediaStreamSource(stream);

      // 분석기 노드 생성
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;

      // 마이크를 분석기에 연결
      microphoneRef.current.connect(analyserRef.current);

      addDebugLog("오디오 모니터링 설정 완료");
    } catch (error) {
      addDebugLog(`마이크 설정 실패: ${error}`);
      console.error("마이크 설정 오류:", error);
    }
  };

  // 음성 인식 초기화
  useEffect(() => {
    setupAudioMonitoring();

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();

        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "ko-KR";

        recognition.onstart = () => {
          addDebugLog("음성 인식 시작됨");
          setIsRecording(true);
          setRecognitionState("running");
          recordingStartTime.current = Date.now();
          setRecordingDuration(0);
          measureAudioLevel();
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;

            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              addDebugLog(
                `최종 텍스트 인식: "${transcript}" (신뢰도: ${
                  confidence?.toFixed(2) || "N/A"
                })`
              );
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript + interimTranscript);

          if (interimTranscript) {
            addDebugLog(`임시 텍스트: "${interimTranscript}"`);
          }
        };

        recognition.onend = () => {
          addDebugLog("음성 인식 종료됨");
          setRecognitionState("idle");

          // onend에서 상태 초기화하지 말고, 이미 초기화된 상태라면 스킵
          if (!isRecording) {
            addDebugLog("이미 UI 상태가 초기화됨 - onend 스킵");
            return;
          }

          setIsRecording(false);
          recordingStartTime.current = null;
          setRecordingDuration(0);
          setAudioLevel(0);

          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }

          if (transcript.trim()) {
            addDebugLog(`메시지 전송: "${transcript.trim()}"`);
            handleSendMessage(transcript.trim());
            setTranscript("");
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          addDebugLog(`음성 인식 오류: ${event.error}`);
          console.error("음성 인식 오류:", event.error);

          // 오류 발생시 강제로 상태 초기화
          setIsRecording(false);
          setRecognitionState("idle");
          recordingStartTime.current = null;
          setRecordingDuration(0);
          setAudioLevel(0);

          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }

          // 특정 오류의 경우 재시작 시도
          if (event.error === "aborted" || event.error === "audio-capture") {
            addDebugLog("오류로 인한 재시작 시도");
            setTimeout(() => {
              if (transcript.trim()) {
                handleSendMessage(transcript.trim());
                setTranscript("");
              }
            }, 200);
          }
        };
      }
    } else {
      addDebugLog("음성 인식이 지원되지 않는 브라우저");
    }

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [transcript]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // 내 대사 추가
    const newMessages = [...messages, { speaker: myName, text: message }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 백엔드 API 호출
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId,
          userInput: message,
        }),
      });
      const data = await res.json();

      // 캐릭터 응답 추가
      setMessages([
        ...newMessages,
        { speaker: characterName, text: data.reply },
      ]);
    } catch (err) {
      console.error("Error:", err);
      addDebugLog(`API 호출 오류: ${err}`);
      // 에러 시 더미 응답
      setMessages([
        ...newMessages,
        {
          speaker: characterName,
          text: "죄송해요, 잠시 문제가 있어요. 다시 말씀해 주세요!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      addDebugLog("음성 인식 기능 없음");
      alert("음성 인식이 지원되지 않는 브라우저입니다.");
      return;
    }

    addDebugLog(
      `현재 상태: recognitionState=${recognitionState}, isRecording=${isRecording}`
    );

    if (
      isRecording ||
      recognitionState === "running" ||
      recognitionState === "starting"
    ) {
      // 녹음 중단
      if (recognitionState === "stopping") {
        addDebugLog("이미 중단 처리 중 - 무시");
        return;
      }

      addDebugLog("녹음 중단 요청");
      setRecognitionState("stopping");

      // 즉시 UI 상태 변경
      setIsRecording(false);
      recordingStartTime.current = null;
      setRecordingDuration(0);
      setAudioLevel(0);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // 음성 인식 중단
      try {
        recognitionRef.current.stop();
        addDebugLog("음성 인식 stop() 호출 완료");
      } catch (error) {
        addDebugLog(`stop() 오류: ${error}`);
        setRecognitionState("idle"); // 오류 시 강제로 idle 상태로
      }

      // 강제로 텍스트 처리
      setTimeout(() => {
        if (transcript.trim()) {
          addDebugLog(`강제 메시지 전송: "${transcript.trim()}"`);
          handleSendMessage(transcript.trim());
          setTranscript("");
        }
        setRecognitionState("idle"); // 일정 시간 후 idle로 강제 변경
      }, 500);
    } else if (recognitionState === "idle") {
      // 녹음 시작
      addDebugLog("녹음 시작 요청");
      setRecognitionState("starting");
      setTranscript("");

      try {
        recognitionRef.current.start();
        addDebugLog("음성 인식 start() 호출 완료");
      } catch (error) {
        addDebugLog(`start() 오류: ${error}`);
        setRecognitionState("idle");

        // InvalidStateError인 경우 강제로 중단 후 재시작
        if (error instanceof Error && error.name === "InvalidStateError") {
          addDebugLog("InvalidStateError - 강제 중단 후 재시작 시도");
          try {
            recognitionRef.current?.stop();
            setTimeout(() => {
              if (recognitionState === "idle" && recognitionRef.current) {
                recognitionRef.current.start();
                addDebugLog("재시작 시도 완료");
              }
            }, 300);
          } catch (retryError) {
            addDebugLog(`재시작 실패: ${retryError}`);
          }
        }
      }
    } else {
      addDebugLog(`잘못된 상태에서 토글 시도: ${recognitionState}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* 디버그 패널 토글 버튼 */}
      <button
        onClick={() => setShowDebugPanel(!showDebugPanel)}
        className="fixed top-4 right-4 z-30 bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        {showDebugPanel ? "디버그 숨기기" : "디버그 보기"}
      </button>

      {/* 디버그 패널 */}
      {showDebugPanel && (
        <div className="fixed top-16 right-4 w-80 bg-white border rounded-lg shadow-lg z-30 p-4 max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2">🎤 음성 녹음 상태</h3>

          {/* 현재 상태 */}
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <p className="text-sm">
              <span className="font-medium">상태:</span>
              <span className={isRecording ? "text-red-600" : "text-green-600"}>
                {isRecording ? " 🔴 녹음 중" : " ⭕ 대기 중"}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Recognition 상태:</span>
              <span
                className={`ml-1 ${
                  recognitionState === "running"
                    ? "text-red-600"
                    : recognitionState === "starting"
                    ? "text-yellow-600"
                    : recognitionState === "stopping"
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {recognitionState === "idle"
                  ? "🟢 대기"
                  : recognitionState === "starting"
                  ? "🟡 시작 중"
                  : recognitionState === "running"
                  ? "🔴 실행 중"
                  : "🟠 종료 중"}
              </span>
            </p>
            {isRecording && (
              <>
                <p className="text-sm">
                  <span className="font-medium">시간:</span> {recordingDuration}
                  초
                </p>
                <p className="text-sm">
                  <span className="font-medium">음량:</span>
                  <span className="ml-1">
                    {audioLevel > 50 ? "🔊" : audioLevel > 20 ? "🔉" : "🔈"}{" "}
                    {audioLevel}/255
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-100"
                    style={{
                      width: `${Math.min(100, (audioLevel / 255) * 100)}%`,
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>

          {/* 현재 인식된 텍스트 */}
          {transcript && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-gray-600 mb-1">인식된 텍스트:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          {/* 디버그 로그 */}
          <div>
            <p className="text-xs font-medium mb-1">디버그 로그:</p>
            <div className="text-xs bg-black text-green-400 p-2 rounded font-mono h-32 overflow-y-auto">
              {debugLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 기존 UI 코드 */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="배경"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex items-center justify-center bg-white/30 relative z-10">
        <img
          src={characterImage}
          alt={characterName}
          className="max-h-[70vh] object-contain"
        />
      </div>

      {/* 대화창 */}
      <div className="bg-white/60 absolute bottom-0 left-0 right-0 w-full backdrop-blur-sm border-t z-20">
        {/* 대화 기록 */}
        <div className="h-40 overflow-y-auto rounded-lg p-5 text-left">
          {messages.map((msg, idx) => (
            <p
              key={idx}
              className={`mb-2 ${
                msg.speaker === myName ? "text-blue-600" : "text-purple-600"
              }`}
            >
              <span className="font-bold">{msg.speaker}: </span>
              {msg.text}
            </p>
          ))}
          {isLoading && <p className="text-gray-500">상대가 입력 중...</p>}
        </div>

        {/* 음성 입력 영역 */}
        <div className="flex flex-col items-center space-y-3 mb-10">
          {/* 음성 인식 상태 표시 */}
          {transcript && (
            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">인식된 음성:</p>
              <p className="text-gray-800">{transcript}</p>
            </div>
          )}

          {/* 실시간 오디오 레벨 표시 */}
          {isRecording && (
            <div className="flex items-center space-x-2">
              <Volume2 size={16} />
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.min(100, (audioLevel / 255) * 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">
                {recordingDuration}s
              </span>
            </div>
          )}

          {/* 음성 입력 버튼 */}
          <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
              transition-all duration-200 transform hover:scale-105 active:scale-95
              ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-[#ceccff] hover:bg-[#b6b4f0]"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <p className="text-sm text-gray-600 text-center">
            {isRecording ? (
              <span className="text-red-600 font-medium">
                🎤 녹음 중... 버튼을 다시 눌러 완료
              </span>
            ) : (
              "마이크 버튼을 눌러 음성으로 대화하세요"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
