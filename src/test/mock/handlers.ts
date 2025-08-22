import { http, HttpResponse } from "msw";

const baseURL = import.meta.env.VITE_API_URL;

export const handlers = [
  http.get("/user", () => HttpResponse.json({ username: "admin" })),
  http.get(`${baseURL}/api/v1/auth/login`, async () => {
    // return HttpResponse.json(
    //   {
    //     message: "로그인에 실패했습니다",
    //   },
    //   {
    //     status: 401,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    return HttpResponse.json(
      {
        authenticated: true,
        nickname: "김윤배",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),
];
