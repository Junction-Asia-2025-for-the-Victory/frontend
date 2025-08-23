import { useEffect, useState } from "react";
import EpisodeBg from "../../assets/EpisodeBack.png";
import { useNavigate } from "react-router";
import school from "../../assets/school.jpg";
import park from "../../assets/park.jpg";
import star from "../../assets/star2.jpg";
import { useGetEpisodeList } from "@/hooks/episodeHooks";
import { Lock, Check } from "lucide-react";

export default function EpisodeList() {
  const [affection, setAffection] = useState(0);
  const [episode, setEpisode] = useState<number | null>(null);
  const [completedEpisode, setCompletedEpisode] = useState(0); // 0: 아무것도 완료 안함, 1: 1단계 완료, 2: 2단계까지 완료, 3: 3단계까지 완료
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const navigate = useNavigate();
  const { data } = useGetEpisodeList();

  useEffect(() => {
    if (data) {
      setAffection(data.likeability);
      setCompletedEpisode(data.progress);
    }
  }, [data]);

  // 에피소드가 잠겨있는지 확인하는 함수
  const isEpisodeLocked = (episodeNumber: number): boolean => {
    // completedEpisode + 1까지 접근 가능
    // 예: completedEpisode가 0이면 1단계만 접근 가능
    // 예: completedEpisode가 1이면 1,2단계 접근 가능
    // 예: completedEpisode가 2이면 1,2,3단계 접근 가능
    return episodeNumber > completedEpisode + 1;
  };

  // 에피소드가 완료되었는지 확인하는 함수
  const isEpisodeCompleted = (episodeNumber: number): boolean => {
    return episodeNumber <= completedEpisode;
  };

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
    // 잠긴 에피소드는 선택할 수 없음
    if (isEpisodeLocked(ep)) {
      return;
    }

    // 에피소드 터치 시 선택만 하고 바로 네비게이션하지 않음
    setSelectedEpisode(ep);
  };

  const handleStartEpisode = () => {
    if (selectedEpisode && !isEpisodeLocked(selectedEpisode)) {
      setEpisode(selectedEpisode);

      // 에피소드 navigate state랑 같이 넘기기
      navigate("/play", { state: selectedEpisode });
    }
  };

  const handleTouchOutside = () => {
    setSelectedEpisode(null);
  };

  // 잠금 상태에 따른 버튼 스타일 결정
  const getButtonStyle = (ep: number) => {
    const isLocked = isEpisodeLocked(ep);
    const isCompleted = isEpisodeCompleted(ep);
    const isSelected = selectedEpisode === ep;

    if (isLocked) {
      return "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-60";
    }

    if (isSelected) {
      return "bg-[#ceccff] text-white border-[#ceccff] shadow-lg scale-105 ring-4 ring-white/30";
    }

    if (episode === ep) {
      return "bg-[#ceccff] text-white border-[#ceccff] shadow-lg";
    }

    if (isCompleted) {
      return "bg-green-100 border-green-300 text-green-700 backdrop-blur-sm active:scale-95";
    }

    return "bg-white/80 border-[#ceccff] text-[#6b68a8] backdrop-blur-sm active:scale-95";
  };

  // 잠금 메시지 생성
  const getLockMessage = (ep: number) => {
    if (ep === 2) {
      return "에피소드 1을 완료하면 잠금 해제됩니다";
    } else if (ep === 3) {
      return "에피소드 2를 완료하면 잠금 해제됩니다";
    }
    return "";
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

        {/* 상단 영역: 호감도 + 진행 상황 */}
        <div className="relative z-10 bg-white/80 backdrop-blur-md mx-3 my-4 rounded-3xl shadow-lg border border-white/30">
          {/* 호감도 섹션 */}
          <div className="px-5 py-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                💝 호감도
              </span>
              <span className="text-sm font-bold text-[#6b68a8]">
                {affection}/100
              </span>
            </div>
            <div className="relative w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${affection}%` }}
              ></div>
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
            </div>
          </div>

          {/* 진행 상황 섹션 */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                📖 스토리 진행
              </span>
              <span className="text-xs bg-[#ceccff] text-white px-2 py-1 rounded-full font-medium">
                {completedEpisode}/3 완료
              </span>
            </div>

            {/* 진행 바 */}
            <div className="relative">
              {/* 연결선 */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200"></div>
              <div
                className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-[#a8e6cf] to-[#88d8c0] transition-all duration-500"
                style={{
                  width: `${Math.max(0, (completedEpisode / 2) * 100)}%`,
                }}
              ></div>

              {/* 에피소드 노드들 */}
              <div className="flex justify-between items-center relative">
                {[1, 2, 3].map((ep, index) => {
                  const isCompleted = isEpisodeCompleted(ep);
                  const isLocked = isEpisodeLocked(ep);
                  const isCurrent = !isCompleted && !isLocked;

                  return (
                    <div key={ep} className="flex flex-col items-center">
                      {/* 노드 */}
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                        transition-all duration-300 shadow-lg relative z-10
                        ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-400 to-green-500 text-white ring-4 ring-green-100"
                            : isCurrent
                            ? "bg-gradient-to-br from-[#ceccff] to-[#a39fe8] text-white ring-4 ring-purple-100 animate-pulse"
                            : "bg-gray-300 text-gray-500"
                        }
                      `}
                      >
                        {isCompleted ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : (
                          <span>{ep}</span>
                        )}
                      </div>

                      {/* 라벨 */}
                      <div className="mt-2 text-center">
                        <div
                          className={`text-xs font-medium ${
                            isCompleted
                              ? "text-green-600"
                              : isCurrent
                              ? "text-[#6b68a8]"
                              : "text-gray-400"
                          }`}
                        >
                          Episode {ep}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isCompleted
                              ? "text-green-500"
                              : isCurrent
                              ? "text-[#a39fe8]"
                              : "text-gray-400"
                          }`}
                        >
                          {isCompleted
                            ? "완료"
                            : isCurrent
                            ? "진행 가능"
                            : "잠김"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 다음 목표 표시 */}
              {completedEpisode < 3 && (
                <div className="mt-4 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">다음 목표</div>
                    <div className="text-sm font-semibold text-[#6b68a8]">
                      Episode {completedEpisode + 1} 클리어
                    </div>
                  </div>
                </div>
              )}

              {/* 모든 에피소드 완료 시 축하 메시지 */}
              {completedEpisode === 3 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="text-center">
                    <div className="text-lg">🎉</div>
                    <div className="text-sm font-bold text-orange-600 mt-1">
                      모든 스토리 완주!
                    </div>
                    <div className="text-xs text-orange-500 mt-1">
                      언제든지 다시 플레이할 수 있어요
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                disabled={isEpisodeLocked(ep)}
                className={`w-full py-5 rounded-2xl border text-xl font-semibold transition-all duration-300 relative overflow-hidden ${getButtonStyle(
                  ep
                )}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {/* 잠금 아이콘 */}
                  {isEpisodeLocked(ep) && <Lock size={20} />}

                  {/* 완료 체크 아이콘 */}
                  {isEpisodeCompleted(ep) && !selectedEpisode && (
                    <Check size={20} />
                  )}

                  <div>
                    {selectedEpisode === ep ? (
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg">
                          {episodeData[ep as keyof typeof episodeData].title}
                        </span>
                        <span className="text-sm opacity-90">선택됨</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span>Episode {ep}</span>
                        {isEpisodeCompleted(ep) && (
                          <span className="text-xs opacity-80">완료됨</span>
                        )}
                        {isEpisodeLocked(ep) && (
                          <span className="text-xs opacity-80">잠김</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

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

              {/* 터치 시 나타나는 상세 정보 (잠기지 않은 에피소드만) */}
              {selectedEpisode === ep && !isEpisodeLocked(ep) && (
                <div className="absolute top-0 left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-[#ceccff]/30 z-20 animate-fade-in">
                  <div className="flex items-center space-x-4">
                    {/* 에피소드 이미지 */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ceccff] to-[#6b68a8] rounded-lg flex items-center justify-center text-2xl text-white flex-shrink-0">
                      {isEpisodeCompleted(ep) ? <Check size={32} /> : ep}
                    </div>

                    {/* 에피소드 정보 */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-[#6b68a8] text-lg flex items-center space-x-2">
                        <span>
                          {episodeData[ep as keyof typeof episodeData].title}
                        </span>
                        {isEpisodeCompleted(ep) && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            완료
                          </span>
                        )}
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
                      className="px-2 py-1 rounded-full text-white font-medium"
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
                    className={`w-full mt-4 py-3 font-bold rounded-xl shadow-lg active:scale-95 transition-transform duration-150 hover:shadow-xl ${
                      isEpisodeCompleted(ep)
                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                        : "bg-gradient-to-r from-[#ceccff] to-[#a39fe8] text-white"
                    }`}
                  >
                    {isEpisodeCompleted(ep) ? "다시 플레이" : "시작하기"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 영역: 선택 안내 */}
        <div className="relative z-5 p-4 m-2 bg-white/70 backdrop-blur-sm text-[#6b68a8] rounded-2xl shadow">
          {selectedEpisode ? (
            !isEpisodeLocked(selectedEpisode) ? (
              <p>
                <span className="font-bold">에피소드 {selectedEpisode}</span>의
                상세 정보를 확인하세요.
                <br />
                <span className="text-sm text-gray-500">
                  {isEpisodeCompleted(selectedEpisode)
                    ? "다시 플레이하거나"
                    : "시작하기 버튼을 눌러"}{" "}
                  게임을 시작하세요.
                </span>
              </p>
            ) : (
              <p className="text-red-600">
                <span className="font-bold">에피소드 {selectedEpisode}</span>는
                잠겨있습니다.
                <br />
              </p>
            )
          ) : episode ? (
            <p>
              <span className="font-bold">에피소드 {episode}</span>를
              선택했습니다.
            </p>
          ) : (
            <div>
              <p>진행할 에피소드를 터치해주세요.</p>
              <p className="text-sm text-gray-500 mt-1">
                현재{" "}
                {completedEpisode === 0
                  ? "첫 번째"
                  : `${completedEpisode + 1}번째`}{" "}
                에피소드까지 접근 가능합니다.
              </p>
            </div>
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
