import { Navigate, Outlet } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { useAuthCheck } from "./hooks/userAuthHooks";
import Loading from "./components/Loading";
import { useAuthStore } from "./store/userStore";
import { useEffect } from "react";

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
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
