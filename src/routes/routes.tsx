import { createBrowserRouter, Outlet } from "react-router";
import App from "../App";
import Login from "../pages/Login/Login";
// import Home from "../pages/Home/Home";
import { ProtectedRoute } from "./RequireAuth";
import { RequireGuest } from "./RequireGuest";
import ErrorPage from "../components/ErrorPage";
import EpisodeList from "@/pages/Episode/Episode";
import Entry from "@/pages/Entry/Entry";
import Play from "@/pages/Play/Play";

// 로그인 상태에 따른 페이지 접근권한 컨트롤
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Entry />,
        path: "entry",
      },
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            element: <EpisodeList />,
            path: "",
          },
          {
            element: <EpisodeList />,
            path: "episode",
          },
          {
            element: <Play />,
            path: "play",
          },
        ],
      },
      {
        element: (
          <RequireGuest>
            <Outlet />
          </RequireGuest>
        ),
        children: [{ path: "login", element: <Login /> }],
      },
    ],
  },
]);
