import { Navigate, Outlet } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { useAuthCheck } from "./hooks/userAuthHooks";
import Loading from "./components/Loading";
import { useAuthStore } from "./store/userStore";
import { useEffect } from "react";
import charLeft from "./assets/char_left.webp";
import charRight from "./assets/char_right.webp";

function App() {
  const { data: userData, isLoading } = useAuthCheck();
  const { setIsLoggedIn, setUserName } = useAuthStore();

  useEffect(() => {
    if (userData && userData.authenticated) {
      setIsLoggedIn(true);
      setUserName(userData.nickname);
    }
  }, [setIsLoggedIn, setUserName, userData]);

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (userData && userData.authenticated === false) {
    alert("세션이 만료되었습니다. 다시 로그인해 주세요");
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white relative">
      <img
        className="icon1 hidden md:block absolute"
        src={charLeft}
        alt="Character Right"
        style={{ left: "calc(50% + 260px)" }}
      />
      <Outlet />
      <img
        className="icon2 hidden md:block absolute"
        src={charRight}
        alt="Character Left"
        style={{ right: "calc(50% + 260px)" }}
      />
      <Toaster />
    </div>
  );
}

export default App;
