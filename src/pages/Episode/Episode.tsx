import { useState } from "react";
import EpisodeBg from "../../assets/EpisodeBack.png";
import { useNavigate } from "react-router";
import school from "../../assets/school.jpg";
import park from "../../assets/park.jpg";
import star from "../../assets/star2.jpg";

export default function EpisodeList() {
  const [affection] = useState(60);
  const [episode, setEpisode] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const navigate = useNavigate();

  // 에피소드별 데이터 (배경 이미지 추가)
  const episodeData = {
    1: {
      title: "첫 만남",
      description: "운명적인 첫 만남이 시작됩니다",
      image: "/images/episode1.jpg",
      background: `${school}`, // 에피소드 1 배경
      color: "#ff9a9e",
    },
    2: {
      title: "공원에서",
      description: "선선한 바람과 함께하는 대화",
      image: "/images/episode2.jpg",
      background: `${park}`,
      color: "#a8e6cf",
    },
    3: {
      title: "별이 빛나는 밤",
      description: "두 사람만의 특별한 시간",
      image: "/images/episode3.jpg",
      background: `${star}`,
      color: "#ffd3a5",
    },
  };

  // 현재 배경 이미지 결정
  const getCurrentBackground = () => {
    if (
      selectedEpisode &&
      episodeData[selectedEpisode as keyof typeof episodeData]
    ) {
      return episodeData[selectedEpisode as keyof typeof episodeData]
        .background;
    }
    return EpisodeBg; // 기본 배경
  };

  const handleClickEpisode = (ep: number) => {
    // 에피소드 터치 시 선택만 하고 바로 네비게이션하지 않음
    setSelectedEpisode(ep);
  };

  const handleStartEpisode = () => {
    if (selectedEpisode) {
      setEpisode(selectedEpisode);

      // 에피소드 navigate state랑 같이 넘기기
      navigate("/play", { state: selectedEpisode });
    }
  };

  const handleTouchOutside = () => {
    setSelectedEpisode(null);
  };

  return (
    <>
      <div
        className="flex flex-col justify-between min-h-screen text-center bg-cover bg-center relative transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${getCurrentBackground()})`,
        }}
        onClick={handleTouchOutside}
      >
        {/* 배경 전환을 부드럽게 하기 위한 오버레이 */}
        <div
          className="absolute inset-0 bg-black/10 transition-opacity duration-700"
          style={{
            opacity: selectedEpisode ? 0.3 : 0.1,
          }}
        />

        {/* 상단 영역: 호감도 */}
        <div className="relative z-10 px-4 py-3 bg-white/70 backdrop-blur-sm mx-2 my-3 rounded-2xl shadow">
          <p className="text-sm font-medium text-gray-700">호감도</p>
          <div className="relative w-full h-3 bg-[#e7e6ff] rounded-full overflow-hidden mt-1.5">
            <div
              className="absolute top-0 left-0 h-4 bg-[#ceccff] transition-all"
              style={{ width: `${affection}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-[#6b68a8] mt-1">
            {affection} / 100
          </p>
        </div>

        {/* 중앙 영역: 에피소드 선택 */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center space-y-6 px-6">
          {[1, 2, 3].map((ep) => (
            <div key={ep} className="relative w-full max-w-md">
              {/* 메인 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickEpisode(ep);
                }}
                className={`w-full py-5 rounded-2xl border text-xl font-semibold transition-all duration-300 relative overflow-hidden
                  ${
                    selectedEpisode === ep
                      ? "bg-[#ceccff] text-white border-[#ceccff] shadow-lg scale-105 ring-4 ring-white/30"
                      : episode === ep
                      ? "bg-[#ceccff] text-white border-[#ceccff] shadow-lg"
                      : "bg-white/80 border-[#ceccff] text-[#6b68a8] backdrop-blur-sm active:scale-95"
                  }`}
              >
                {selectedEpisode === ep ? (
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">
                      {episodeData[ep as keyof typeof episodeData].title}
                    </span>
                    <span className="text-sm opacity-90">선택됨</span>
                  </div>
                ) : (
                  `Episode ${ep}`
                )}

                {/* 선택된 에피소드 배경 그라데이션 */}
                {selectedEpisode === ep && (
                  <div
                    className="absolute inset-0 opacity-20 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${
                        episodeData[ep as keyof typeof episodeData].color
                      }, transparent)`,
                    }}
                  />
                )}
              </button>

              {/* 터치 시 나타나는 상세 정보 */}
              {selectedEpisode === ep && (
                <div className="absolute top-0 left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-[#ceccff]/30 z-20 animate-fade-in">
                  <div className="flex items-center space-x-4">
                    {/* 에피소드 이미지 */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ceccff] to-[#6b68a8] rounded-lg flex items-center justify-center text-2xl text-white flex-shrink-0">
                      {ep}
                    </div>

                    {/* 에피소드 정보 */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-[#6b68a8] text-lg">
                        {episodeData[ep as keyof typeof episodeData].title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {
                          episodeData[ep as keyof typeof episodeData]
                            .description
                        }
                      </p>
                    </div>
                  </div>

                  {/* 추가 정보 */}
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span
                      className="px-2  rounded-full text-white font-medium"
                      style={{
                        backgroundColor:
                          episodeData[ep as keyof typeof episodeData].color,
                      }}
                    >
                      {ep === 1 ? "초급" : ep === 2 ? "중급" : "고급"}
                    </span>
                    <span className="text-gray-500">예상 시간: 5분</span>
                  </div>

                  {/* 시작하기 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEpisode();
                    }}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-[#ceccff] to-[#a39fe8] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform duration-150 hover:shadow-xl"
                  >
                    시작하기
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 영역: 선택 안내 */}
        <div className="relative z-5 p-4 m-2 bg-white/70 backdrop-blur-sm text-[#6b68a8] rounded-2xl shadow">
          {selectedEpisode ? (
            <p>
              <span className="font-bold">에피소드 {selectedEpisode}</span>의
              상세 정보를 확인하세요.
              <br />
              <span className="text-sm text-gray-500">
                시작하기 버튼을 눌러 게임을 시작하세요.
              </span>
            </p>
          ) : episode ? (
            <p>
              <span className="font-bold">에피소드 {episode}</span>를
              선택했습니다.
            </p>
          ) : (
            <p>진행할 에피소드를 터치해주세요.</p>
          )}
        </div>
      </div>

      {/* 애니메이션을 위한 스타일 */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* 배경 전환 애니메이션 */
        .bg-transition {
          transition: background-image 0.7s ease-in-out;
        }
        
        /* 터치 디바이스에서 hover 효과 제거 */
        @media (hover: none) and (pointer: coarse) {
          button:hover {
            background-color: inherit;
            transform: none;
          }
          
          button:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }
        }
      `}</style>
    </>
  );
}
