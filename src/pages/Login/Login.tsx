import googleIconUrl from "@/assets/google-icon.svg";
import { Button } from "@/components/Button";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }
  return (
    <div className="flex container relative h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900"></div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="typing-demo-2 text-4xl">
                로그인 인삿말
              </p>
            </blockquote>
          </div>
          <div className="relative z-20 mt-auto"></div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg whitespace-normal">
                Junction Asia Hackathon
              </p>
            </blockquote>
          </div>
        </div>

        <div className="mb-20 p-4 lg:p-8">
          <div className="w-[300px] mx-auto flex flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                로그인하고 시작하기
              </h1>
              <p className="text-sm whitespace-normal break-keep">
                당신을 위한 서비스.
              </p>
              <p className="text-sm text-muted-foreground whitespace-normal break-keep">
                간편하게 로그인하고 서비스를 이용해보세요.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    다음으로 계속하기
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Button
                  variant="white"
                  size="default"
                  type="button"
                  className="inline-flex items-center"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src={googleIconUrl}
                    alt="Google 로고"
                    className="h-4 w-4"
                  />
                  Google 로그인
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Login;
