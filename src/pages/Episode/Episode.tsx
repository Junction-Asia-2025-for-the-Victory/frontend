import { useState } from "react";
import EpisodeBg from "../../assets/EpisodeBack.png";
export default function EpisodeList() {
  const [affection] = useState(60);
  const [episode, setEpisode] = useState<number | null>(null);

  return (
    <div
      className="flex flex-col justify-between min-h-screen text-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${EpisodeBg})`, // public 폴더에 넣으면 /backgrounds/... 로 접근 가능
      }}
    >
      {/* 상단 영역: 호감도 */}
      <div className="p-6 bg-white/70 backdrop-blur-sm rounded-b-2xl shadow">
        <p className="text-sm font-medium text-gray-700">호감도</p>
        <div className="relative w-full h-4 bg-[#e7e6ff] rounded-full overflow-hidden mt-2">
          <div
            className="absolute top-0 left-0 h-4 bg-[#ceccff] transition-all"
            style={{ width: `${affection}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-[#6b68a8] mt-1">
          {affection} / 100
        </p>
      </div>

      {/* 중앙 영역: 에피소드 선택 */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-6 px-6">
        {[1, 2, 3].map((ep) => (
          <button
            key={ep}
            onClick={() => setEpisode(ep)}
            className={`w-full max-w-md py-5 rounded-2xl border text-xl font-semibold transition-all
              ${
                episode === ep
                  ? "bg-[#ceccff] text-white border-[#ceccff] shadow-lg"
                  : "bg-white/80 hover:bg-white border-[#ceccff] text-[#6b68a8] backdrop-blur-sm"
              }`}
          >
            Episode {ep}
          </button>
        ))}
      </div>

      {/* 하단 영역: 선택 안내 */}
      <div className="p-6 bg-white/70 backdrop-blur-sm text-[#6b68a8] rounded-t-2xl shadow">
        {episode ? (
          <p>
            <span className="font-bold">에피소드 {episode}</span>를
            선택했습니다.
          </p>
        ) : (
          <p>진행할 에피소드를 선택해주세요.</p>
        )}
      </div>
    </div>
  );
}
