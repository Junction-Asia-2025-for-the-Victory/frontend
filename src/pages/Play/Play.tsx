import { useState } from "react";
import chatCharacter from "../../assets/chat.jpeg";
import { Volume2, MicOff, Heart, MessageCircle } from "lucide-react";

const Play = () => {
  const [affectionLevel, setAffectionLevel] = useState(65); // 호감도 0-100
  const [isRecording, setIsRecording] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("안녕~ 만나서 반가워!");
  const [feedback, setFeedback] = useState(null); // 피드백 상태
  const [recognizedText, setRecognizedText] = useState(""); // 인식된 음성 텍스트

  // 캐릭터 이미지는 실제 구현에서 props로 받거나 state로 관리
  // const chatCharacter =
  //   "https://via.placeholder.com/400x800/e0e7ff/8b5cf6?text=Character";

  // 호감도에 따른 색상 및 상태 결정
  const getAffectionData = (level) => {
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

  const affectionData = getAffectionData(affectionLevel);

  return (
    <div className="flex flex-col min-h-screen h-full w-full justify-between bg-gray-50 relative overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <img
          src={chatCharacter}
          alt="배경"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" /> */}
      </div>

      {/* 상단 헤더 - 호감도 표시 */}
      <div className="relative z-30 mx-4 mt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/30">
          {/* 캐릭터 정보와 호감도 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">캐릭터와 대화 중</h3>
                <p className="text-xs text-gray-500">{affectionData.status}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Heart
                className={`w-5 h-5 ${affectionData.textColor} ${
                  affectionData.heartFilled ? "fill-current" : ""
                }`}
              />
              <span className="font-bold text-gray-700">{affectionLevel}</span>
            </div>
          </div>

          {/* 호감도 프로그레스 바 */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${affectionData.color} transition-all duration-700 ease-out relative`}
                style={{ width: `${affectionLevel}%` }}
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

      {/* 캐릭터 대사 영역 */}

      {/* 대화창 - 고정 */}
      <div className=" z-20">
        {/* 대화 헤더 */}
        <div className="z-30 px-5 py-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold text-gray-800">캐릭터</span>
                  <Heart
                    className={`w-4 h-4 ${affectionData.textColor} ${
                      affectionData.heartFilled ? "fill-current" : ""
                    }`}
                  />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {currentMessage}
                </p>

                {feedback && (
                  <div className="mt-3 p-3 bg-white/60 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-purple-600">
                        💭 피드백
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 음성 컨트롤 영역 */}
        <div className="px-5 py-8 bg-white">
          {/* 음성 입력 버튼 */}
          <div className="flex justify-center">
            <button
              className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${
                isRecording
                  ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse"
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              }`}
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  setRecognizedText("");
                  // 녹음 시작 시 피드백과 이전 인식 텍스트 초기화
                  setFeedback(null);
                } else {
                  // 녹음 종료 시 예시 동작 (실제 구현에서는 음성 처리 로직)
                  setRecognizedText("안녕하세요!");
                  // 예시 피드백 (실제로는 AI 응답에 따라)
                  setTimeout(() => {
                    setFeedback("좋은 인사네요! 호감도가 올랐어요 💕");
                    setCurrentMessage("반가워요! 오늘 기분이 어때요?");
                  }, 1000);
                }
              }}
            >
              {/* 버튼 외곽 링 (녹음 중일 때만) */}
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
              )}

              {/* 아이콘 */}
              <div className="relative z-10">
                {isRecording ? <MicOff size={28} /> : <Volume2 size={28} />}
              </div>
            </button>
          </div>

          {/* 상태 텍스트 */}
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

      {/* 스타일 정의 */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .7;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* 스크롤바 스타일링 */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Play;
