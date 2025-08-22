import { useAuthStore } from "@/store/userStore";
import axios from "axios";
import { toast } from "sonner";

const baseURL = import.meta.env.VITE_API_URL;
export const publicApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

publicApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("인증이 필요한 요청입니다.");
      toast.error("로그인이 필요합니다.");
    }
    return Promise.reject(error);
  }
);

privateApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        console.log(" 복구 로직 실행 해보는중 ");
        await publicApi.post(
          "/api/v1/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );
      } catch (refreshError) {
        const { setIsLoggedIn, setUserName } = useAuthStore.getState();
        setIsLoggedIn(false);
        setUserName("");

        try {
          await publicApi.post(
            "/api/v1/auth/logout",
            {},
            {
              withCredentials: true,
            }
          );
        } catch (logoutError) {
          console.error("로그아웃 중 오류:", logoutError);
        }

        toast.error("로그인이 필요합니다.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
