import { FadeLoader } from "react-spinners";

function Loading() {
  return (
    <div
      className={`flex flex-col gap-5 h-screen  justify-center items-center`}
    >
      <FadeLoader radius={5} color="#886bfb" />
      <h2 className="text-3xl font-bold">로딩중 입니다</h2>
      <p className="text-gray-700 font-semibold">잠시만 기다려 주세요</p>
    </div>
  );
}

export default Loading;
