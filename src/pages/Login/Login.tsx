import googleIconUrl from "@/assets/google-icon.svg";
import junctionLogoUrl from "@/assets/junction_logo.webp";
import ybmLogoUrl from "@/assets/ybm_logo.webp";
import loginCharacterUrl from "@/assets/login_char.webp";
import { Button } from "@/components/Button";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "https://evertalk.site/oauth2/authorization/google";
  };
  return (
    <div className="flex container relative h-screen flex-col items-center justify-center">
            <img src={loginCharacterUrl} alt="login character" className="h-36 w-auto mb-5" />
      <div className="w-[300px] mx-auto flex flex-col justify-center space-y-6 sm:w-[350px] mb-50">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-4">
            로그인하고 영어랑 연애하기
          </h1>
          <p className="text-sm whitespace-normal break-keep">
            영어 실력 향상의 지름길!
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
              <img src={googleIconUrl} alt="Google 로고" className="h-4 w-4" />
              Google 로그인
            </Button>
          </div>
          <div className="absolute bottom-10 left-0 right-0">
            <div className="flex flex-col items-center text-center text-sm font-semibold">
              <div className="flex items-center font-bold text-lg text-muted-foreground">
                <img src={junctionLogoUrl} alt="Junction Asia Hackathon" className="h-8 w-auto mr-2" />
                Junction Asia Hackathon
                </div>
                <div className="font-bold text-xl text-muted-foreground mt-1">
                  X
                </div>
                <div><img src={ybmLogoUrl} alt="ybm logo" className="h-14 w-auto" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
