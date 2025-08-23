import { useSetProfile } from "@/hooks/userAuthHooks";
import React, { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router";

// 성별 타입
type Gender = "male" | "female" | "";

// 사용자 정보 타입
interface UserInfo {
  nickname: string;
  gender: Gender;
}

// 닉네임 유효성 검사 결과 타입
interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

// 닉네임 입력 컴포넌트 Props 타입
interface NicknameEntryProps {
  onNicknameSubmit?: (userInfo: UserInfo) => void;
  initialValue?: string;
  initialGender?: Gender;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  className?: string;
  disabled?: boolean;
}

// 닉네임 유효성 검사 함수 타입
type ValidateNickname = (value: string) => ValidationResult;

const NicknameEntry: React.FC<NicknameEntryProps> = ({
  initialValue = "",
  initialGender = "",
  placeholder = "닉네임을 입력해주세요",
  maxLength = 12,
  minLength = 2,
  className = "",
  disabled = false,
}) => {
  const [nickname, setNickname] = useState<string>(initialValue);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const profileMutation = useSetProfile();

  const validateNickname: ValidateNickname = (
    value: string
  ): ValidationResult => {
    if (value.length < minLength) {
      return {
        isValid: false,
        errorMessage: `닉네임은 ${minLength}글자 이상이어야 합니다.`,
      };
    }

    if (value.length > maxLength) {
      return {
        isValid: false,
        errorMessage: `닉네임은 ${maxLength}글자 이하여야 합니다.`,
      };
    }

    if (!/^[a-zA-Z0-9가-힣_-]+$/.test(value)) {
      return {
        isValid: false,
        errorMessage: "닉네임은 한글, 영문, 숫자, _, - 만 사용 가능합니다.",
      };
    }

    return {
      isValid: true,
      errorMessage: "",
    };
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setNickname(value);

    if (value) {
      const result = validateNickname(value);
      setIsValid(result.isValid);
      setErrorMessage(result.errorMessage);
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  };
  const handleSubmit = () => {
    if (nickname && gender && validateNickname(nickname).isValid) {
      profileMutation.mutate(
        { nickname, gender },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: (error) => {
            console.error("프로필 설정 실패:", error);
            // 에러 처리
          },
        }
      );
    }
  };

  const handleGenderSelect = (selectedGender: Gender): void => {
    setGender(selectedGender);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const buttonDisabled: boolean = !nickname || !gender || !isValid || disabled;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 px-4">
      {/* 메인 카드 */}
      <div
        className={`w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/30 ${className}`}
      >
        {/* 헤더 섹션 */}
        <div className="px-6 py-6 text-center border-b border-gray-200/50">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#ceccff] to-[#a39fe8] rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-[#6b68a8] mb-2">
            닉네임 설정
          </h2>
          <p className="text-sm text-gray-600">
            게임에서 사용할 닉네임과 성별을 입력해주세요
          </p>
        </div>

        {/* 입력 섹션 */}
        <div className="px-6 py-6 space-y-6">
          {/* 닉네임 입력 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              닉네임
            </label>

            <div className="relative">
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={disabled}
                className={`w-full px-4 py-4 bg-white/90 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg font-medium ${
                  isValid
                    ? "border-gray-200 focus:border-[#ceccff] focus:ring-[#ceccff]/20"
                    : "border-red-300 focus:border-red-400 focus:ring-red-100"
                } ${
                  disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
                }`}
              />

              {/* 입력 상태 아이콘 */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {nickname && isValid && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {nickname && !isValid && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                )}
              </div>
            </div>

            {/* 상태 메시지 & 글자 수 */}
            <div className="flex justify-between items-start mt-3">
              <div className="flex-1">
                <p
                  className={`text-xs font-medium ${
                    isValid ? "text-gray-500" : "text-red-500"
                  }`}
                >
                  {errorMessage ||
                    `${minLength}-${maxLength}글자, 한글/영문/숫자/_/- 사용 가능`}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  nickname.length > maxLength * 0.8
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {nickname.length}/{maxLength}
              </span>
            </div>
          </div>

          {/* 성별 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              성별
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* 남성 버튼 */}
              <button
                type="button"
                onClick={() => handleGenderSelect("male")}
                disabled={disabled}
                className={`py-4 px-4 rounded-2xl border-2 font-semibold text-lg transition-all duration-300 ${
                  gender === "male"
                    ? "bg-gradient-to-r from-blue-200 to-blue-300 text-white border-blue-200 shadow-lg"
                    : "bg-white/90 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                } ${
                  disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">👨</span>
                  <span>남성</span>
                </div>
              </button>

              {/* 여성 버튼 */}
              <button
                type="button"
                onClick={() => handleGenderSelect("female")}
                disabled={disabled}
                className={`py-4 px-4 rounded-2xl border-2 font-semibold text-lg transition-all duration-300 ${
                  gender === "female"
                    ? "bg-gradient-to-r from-pink-200 to-pink-300 text-white border-pink-200 shadow-lg"
                    : "bg-white/90 text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
                } ${
                  disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">👩</span>
                  <span>여성</span>
                </div>
              </button>
            </div>

            {/* 성별 선택 안내 */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              캐릭터 설정에 사용됩니다
            </p>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={buttonDisabled}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg active:scale-95 ${
              buttonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-[#ceccff] to-[#a39fe8] hover:from-[#b8b5ff] hover:to-[#9590e5] text-white shadow-xl hover:shadow-2xl"
            }`}
          >
            {buttonDisabled ? "닉네임과 성별을 선택해주세요" : "게임 시작하기"}
          </button>
        </div>
      </div>

      <style>{`
        /* 터치 디바이스 최적화 */
        @media (hover: none) and (pointer: coarse) {
          button:hover {
            transform: none;
          }
          
          button:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }
        }
        
        /* 입력 필드 애니메이션 */
        input:focus {
          animation: gentle-pulse 2s ease-in-out infinite;
        }
        
        @keyframes gentle-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(206, 204, 255, 0.3);
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(206, 204, 255, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default NicknameEntry;
