import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/Login/Login";
// import Home from "../pages/Home/Home";
import EpisodeList from "@/pages/Episode/Episode";
import Play from "@/pages/Play/Play";
// import { ProtectedRoute } from "./RequireAuth";
// import { RequireGuest } from "./RequireGuest";
// import ErrorPage from "../components/ErrorPage";

// 로그인 상태에 따른 페이지 접근권한 컨트롤
// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         element: (
//           <ProtectedRoute>
//             <Outlet />
//           </ProtectedRoute>
//         ),
//         children: [{ path: "", element: <Home /> }],
//       },
//       {
//         element: (
//           <RequireGuest>
//             <Outlet />
//           </RequireGuest>
//         ),
//         children: [
//           { path: "login", element: <Login /> },
//           { path: "", element: <Home /> },
//         ],
//       },
//     ],
//   },
// ]);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <EpisodeList />,
        path: "",
      },
      {
        element: <Login />,
        path: "login",
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
]);
