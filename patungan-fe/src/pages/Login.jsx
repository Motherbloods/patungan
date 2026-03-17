import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "../context/authContext";

function Login() {
  const [isLoading, setIsLoading] = useState({
    telegram: false,
    google: false,
  });
  const [loginToken, setLoginToken] = useState(null);
  const [telegramUrl, setTelegramUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleTelegramLogin = async () => {};
  const handleGoogleLogin = async () => {};
  const handleCancel = async () => {};
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary text-primary p-4">
      <div className="w-full max-w-md">
        <div className="bg-primary rounded-2xl p-8 shadow-lg border-custom transition-transform transform hover:scale-[1.02]">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Masuk ke Akun Anda
          </h2>
          <div className="space-y-6">
            {!loginToken ? (
              <>
                <button
                  onClick={handleTelegramLogin}
                  disabled={isLoading.telegram || isLoading.google}
                  className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                  {isLoading.telegram ? "Connecting..." : "Login with Telegram"}
                </button>

                <div className="relative flex items-center">
                  <div className="grow border-t border-custom"></div>
                  <span className="shrink mx-4 text-secondary text-sm">
                    atau
                  </span>
                  <div className="grow border-t border-custom"></div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading.telegram || isLoading.google}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                  {isLoading.google ? (
                    <span>Connecting...</span>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 48 48">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.69 1.22 9.19 3.61l6.86-6.86C35.6 2.36 30.2 0 24 0 14.61 0 6.4 5.38 2.56 13.22l7.98 6.19C12.49 13.31 17.79 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.1 24.5c0-1.63-.15-3.2-.42-4.7H24v9h12.44c-.54 2.9-2.16 5.36-4.61 7.02l7.14 5.55C43.97 36.73 46.1 31.07 46.1 24.5z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.54 28.41A14.5 14.5 0 019.5 24c0-1.54.27-3.03.76-4.41l-7.98-6.19A23.94 23.94 0 000 24c0 3.83.92 7.45 2.56 10.6l7.98-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.2 0 11.4-2.05 15.2-5.59l-7.14-5.55c-2 1.34-4.56 2.14-8.06 2.14-6.21 0-11.51-3.81-13.46-9.22l-7.98 6.19C6.4 42.62 14.61 48 24 48z"
                        />
                      </svg>
                      <span>Login with Google</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <p className="text-sm font-medium mb-1">
                    ⏱️ Menunggu konfirmasi dari Telegram
                  </p>
                  <p className="text-xs text-secondary mb-3">
                    Silakan buka Telegram dan konfirmasi login Anda
                  </p>
                  <span className="inline-block px-3 py-1 bg-blue-100 rounded-full text-blue-800 font-mono text-sm">
                    Expires in: {formatTime(timeLeft)}
                  </span>
                  <div className="flex justify-center mt-3">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  </div>
                </div>

                <button
                  onClick={() => window.open(telegramUrl, "_blank")}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <ExternalLink size={18} />
                  Buka Telegram
                </button>

                <button
                  onClick={handleCancel}
                  className="w-full px-6 py-3 border border-custom hover:bg-secondary rounded-xl transition-all font-medium shadow-sm"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
