import React, { useEffect, useState, useRef } from "react";
import chatCharacter from "../../assets/chat.jpeg";
import {
  Volume2,
  MicOff,
  Heart,
  MessageCircle,
  CheckCircle,
  Home,
} from "lucide-react";
import ViedoPlayer from "./ViedoPlayer";
import { useLocation, useNavigate } from "react-router";
import { useStartEpisode } from "@/hooks/episodeHooks";

interface AffectionData {
  color: string;
  bgColor: string;
  textColor: string;
  status: string;
  heartFilled: boolean;
}

interface PlayProps {}

const Play: React.FC<PlayProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMessage, setCurrentMessage] =
    useState<string>("안녕~ 만나서 반가워!");
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 🔑 mediaRecorder와 audioChunks 모두 ref로 관리
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // 🎯 ref로 변경

  const startMutation = useStartEpisode();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatData, setChatData] = useState({
    changeLike: 0,
    characterName: "",
    chat: "",
    feedback: "",
    img: "",
    lastChat: false,
    likeability: 0,
    nickname: "",
  });

  const episodeId = location.state;

  useEffect(() => {
    if (episodeId) {
      startMutation.mutate(episodeId, {
        onSuccess: (res) => {
          setChatData(res);
        },
        onError: (error) => {
          console.error("Mutation failed:", error);
        },
      });
    }
  }, [episodeId]);

  // 🎤 녹음 초기화 및 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      // 🎯 audioChunks 초기화
      audioChunksRef.current = [];

      // 오디오 데이터 쌓기
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data); // 🎯 ref 사용
          console.log("오디오 청크 추가:", audioChunksRef.current.length); // 디버깅
        }
      };

      // stop 이벤트 → 서버 전송
      recorder.onstop = () => {
        console.log("녹음 중지, 청크 개수:", audioChunksRef.current.length); // 디버깅
        handleSendAudio();
      };

      // ✅ 녹음 시작
      recorder.start();
      setIsRecording(true);
      console.log("녹음 시작"); // 디버깅
    } catch (error) {
      console.error("마이크 접근 권한 오류:", error);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  // 🎤 녹음 중지
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("녹음 중지 요청"); // 디버깅
    }
  };

  // 오디오 데이터를 서버로 전송
  const handleSendAudio = async () => {
    console.log(
      "handleSendAudio 호출, 청크 개수:",
      audioChunksRef.current.length
    ); // 디버깅

    if (audioChunksRef.current.length === 0) {
      console.log("오디오 청크가 비어있음"); // 디버깅
      return;
    }

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      console.log("오디오 블롭 생성, 크기:", audioBlob.size); // 디버깅

      const formData = new FormData();
      formData.append("audioFile", audioBlob, "recording.webm");
      formData.append("chatId", episodeId?.toString() || "1");

      console.log("API 호출 시작"); // 디버깅

      const response = await fetch("/api/v1/episode/chat", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("서버 응답:", result);

        if (result.recognizedText) setRecognizedText(result.recognizedText);
        if (result.response) setCurrentMessage(result.response);

        // 🎯 전체 chatData 업데이트
        setChatData(result);

        // 🎯 마지막 대화인지 확인하고 1초 후 완료 모달 표시
        if (result.lastChat) {
          setTimeout(() => {
            setShowCompletionModal(true);
          }, 1000);
        }

        if (result.likeability !== undefined) {
          setChatData((prev) => ({
            ...prev,
            likeability: result.likeability,
          }));
        }
      } else {
        console.error("서버 전송 실패:", response.statusText);
      }
    } catch (error) {
      console.error("오디오 전송 오류:", error);
    } finally {
      // 🎯 청크 초기화
      audioChunksRef.current = [];
    }
  };

  // 호감도 계산 함수 (그대로 유지)
  const getAffectionData = (level: number): AffectionData => {
    if (level >= 80)
      return {
        color: "from-pink-400 to-pink-500",
        bgColor: "bg-pink-500",
        textColor: "text-pink-500",
        status: "💕 깊은 애정",
        heartFilled: true,
      };
    if (level >= 60)
      return {
        color: "from-purple-400 to-purple-500",
        bgColor: "bg-purple-500",
        textColor: "text-purple-500",
        status: "💜 호감",
        heartFilled: true,
      };
    if (level >= 40)
      return {
        color: "from-blue-400 to-blue-500",
        bgColor: "bg-blue-500",
        textColor: "text-blue-500",
        status: "💙 친근함",
        heartFilled: false,
      };
    if (level >= 20)
      return {
        color: "from-gray-400 to-gray-500",
        bgColor: "bg-gray-500",
        textColor: "text-gray-500",
        status: "🤍 어색함",
        heartFilled: false,
      };
    return {
      color: "from-gray-300 to-gray-400",
      bgColor: "bg-gray-400",
      textColor: "text-gray-400",
      status: "💔 냉담함",
      heartFilled: false,
    };
  };

  const affectionData = getAffectionData(chatData.likeability);

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate("/");
  };

  // 버튼 핸들러
  const handleRecordingToggle = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      stopRecording();
    }
  };

  // 언마운트 시 스트림 해제
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-full w-full justify-between bg-gray-50 relative overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 z-0">
        <img
          src={chatCharacter}
          alt="배경"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0">
        <ViedoPlayer emotion="waiting" />
      </div>

      {/* 상단 헤더 */}
      <div className="relative z-30 mx-4 mt-4">
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  {chatData.characterName}와 대화 중
                </h3>
                <p className="text-xs text-gray-500">{affectionData.status}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Heart
                className={`w-5 h-5 ${affectionData.textColor} ${
                  affectionData.heartFilled ? "fill-current" : ""
                }`}
              />
              <span className="font-bold text-gray-700">
                {chatData.likeability}
              </span>
            </div>
          </div>

          {/* 호감도 바 */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${affectionData.color} transition-all duration-700 ease-out relative`}
                style={{ width: `${chatData.likeability}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 대화 영역 */}
      <div className="z-20">
        <div className="z-30 px-5 py-4">
          <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold text-gray-800">
                    {chatData.characterName}
                  </span>
                  <Heart
                    className={`w-4 h-4 ${affectionData.textColor} ${
                      affectionData.heartFilled ? "fill-current" : ""
                    }`}
                  />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {currentMessage}
                </p>

                {recognizedText && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-blue-600">
                        🎤 음성 인식 결과
                      </span>
                      <div className="px-2 py-0.5 bg-blue-200 text-blue-700 text-xs rounded-full">
                        인식됨
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{recognizedText}</p>
                  </div>
                )}

                {chatData.feedback && chatData.feedback.trim() !== "" && (
                  <div className="mt-2 py-3 px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl  shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-bold text-purple-700">
                            🎯 문법 피드백
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {chatData.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="px-5 py-6 bg-white/90 ">
          <div className="flex justify-center">
            <button
              className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${
                isRecording
                  ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse"
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              }`}
              onClick={handleRecordingToggle}
              type="button"
            >
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
              )}
              <div className="relative z-10">
                {isRecording ? <MicOff size={28} /> : <Volume2 size={28} />}
              </div>
            </button>
          </div>

          <div className="text-center mt-4">
            <p
              className={`text-sm font-medium ${
                isRecording ? "text-red-600" : "text-gray-600"
              }`}
            >
              {isRecording
                ? "🎤 녹음 중... 버튼을 다시 눌러 완료"
                : "🎙️ 버튼을 눌러 음성 입력 시작"}
            </p>
          </div>
        </div>
      </div>

      {/* 🎉 에피소드 완료 모달 */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              {/* 완료 아이콘 */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              {/* 제목 */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                에피소드 완료!
              </h2>

              {/* 설명 */}
              <p className="text-gray-600 mb-2">
                {chatData.characterName}와의 대화를 성공적으로 완료했어요!
              </p>

              {/* 최종 호감도 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Heart
                    className={`w-5 h-5 ${affectionData.textColor} ${
                      affectionData.heartFilled ? "fill-current" : ""
                    }`}
                  />
                  <span className="font-bold text-gray-800">최종 호감도</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {chatData.likeability}점
                </div>
                <div
                  className={`text-sm ${affectionData.textColor} font-medium`}
                >
                  {affectionData.status}
                </div>
              </div>

              {/* 확인 버튼 */}
              <button
                onClick={handleGoHome}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>홈으로 돌아가기</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
