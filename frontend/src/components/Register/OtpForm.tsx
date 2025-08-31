import { useForm } from "react-hook-form";
import { OtpFormData } from "../../shared/interfaces/auth.interface.ts";
import { SignUpFormData } from "../../shared/interfaces/auth.interface.tsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";

interface OtpFormProps {
  signupData?: SignUpFormData;
  type: "register" | "reset";
  userEmail?: string;
  setIsOtpSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
}

const OtpForm: React.FC<OtpFormProps> = ({
  signupData,
  type,
  userEmail,
  setIsOtpSubmitted,
}) => {
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValue,
    formState: { isSubmitting: isSubmittingOtp },
  } = useForm<OtpFormData>({ mode: "onSubmit" });

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [otpError, setOtpError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const { value } = e.currentTarget;

    if (!/^\d*$/.test(value)) {
      e.currentTarget.value = "";
      return;
    }

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, inputRefs.current.length);

    paste.split("").forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
        setOtpValue(`otp${i}` as keyof OtpFormData, char);
      }
    });

    const lastIndex = Math.min(paste.length - 1, inputRefs.current.length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const onSignUpSubmit = async (data: OtpFormData) => {
    const otpValues = Object.values(data);
    const isEmpty = otpValues.some((v) => v.trim() === "");
    if (isEmpty) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setOtpError("");
    const otp = otpValues.join("");

    if (type == "register") {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/verify-account`,
          {
            ...signupData,
            otp,
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/login");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (type == "reset") {
      try {
        const response = await axios.post(backendUrl + "/api/auth/check-otp", {
          email: userEmail,
          otp,
        });
        if (response.data.success) {
          setIsOtpSubmitted?.(true);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleOtpSubmit(onSignUpSubmit)}>
      <div className="otp-container" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, index) => {
          const fieldName = `otp${index}` as keyof OtpFormData;
          return (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="otp-input"
              {...registerOtp(fieldName)}
              ref={(el) => {
                registerOtp(fieldName).ref(el);
                inputRefs.current[index] = el;
              }}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          );
        })}
      </div>

      {otpError && <p className="otp-error">{otpError}</p>}

      {isSubmittingOtp && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <button type="submit" className="submit-button">
        Verify Email
      </button>
    </form>
  );
};

export default OtpForm;
