import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "../context/authContext";
import {
  useLoginGoogle,
  useRequestLogin,
  useVerifyLoginToken,
} from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

function Login() {
  const [isLoading, setIsLoading] = useState({
    telegram: false,
    google: false,
  });
  const [loginToken, setLoginToken] = useState(null);
  const [telegramUrl, setTelegramUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useAuth();

  //tanpa {mutate:} ambil seluruh object dari reactquery, bisa onsuccess, onerror
  const requestLogin = useRequestLogin();
  const { data: verifyData } = useVerifyLoginToken(loginToken, isAuthenticated);
  const { mutateAsync: loginGoogle } = useLoginGoogle();

  const handleTelegramLogin = async () => {
    setIsLoading((prev) => ({ ...prev, telegram: true }));
    //undefined itu variable yang akan dikirimkan ke api(ke mutationFn :(nahdisini varaiblenya) =>)
    requestLogin.mutate(undefined, {
      onSuccess: (data) => {
        setLoginToken(data.token);
        setTelegramUrl(data.telegramUrl);
        setTimeLeft(data.expiresIn ?? 300);

        window.open(data.telegramUrl, "_blank");
      },
      onError: () => {
        console.error("Telegram login failed");
      },
      onSettled: () => {
        setIsLoading((prev) => ({ ...prev, telegram: false }));
      },
    });
  };

  const handleGoogleLogin = async () => {};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCancel = () => {
    setLoginToken(null);
    setTelegramUrl(null);
    setTimeLeft(0);
  };
  useEffect(() => {
    if (verifyData?.isAuthenticated) {
      setUser(verifyData.user);
      navigate("/dashboard");
    }
  }, [verifyData]);

  useEffect(() => {
    if (!loginToken || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loginToken, timeLeft]);

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

                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const idToken = credentialResponse.credential;

                      const res = await loginGoogle(idToken);

                      setUser(res.user);

                      navigate("/dashboard");
                    } catch (err) {
                      console.error(err);
                      toast.error("Login gagal");
                    }
                  }}
                  onError={() => toast.error("Login gagal")}
                />
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
