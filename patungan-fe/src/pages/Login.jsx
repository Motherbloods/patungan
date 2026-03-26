import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/authContext";
import {
  useLoginGoogle,
  useRequestLogin,
  useVerifyLoginToken,
} from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import "../styles/login.css";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.012 9.488c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.71l-2.95-.924c-.642-.202-.654-.642.136-.95l11.532-4.448c.534-.194 1.002.13.674.86z" />
  </svg>
);

const FloatingDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-[0.07]"
        style={{
          width: `${[180, 120, 90, 200, 140, 100][i]}px`,
          height: `${[180, 120, 90, 200, 140, 100][i]}px`,
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          top: `${[10, 60, 30, 75, 5, 50][i]}%`,
          left: `${[70, 10, 85, 55, 30, 45][i]}%`,
          animation: `floatDot ${[8, 10, 7, 12, 9, 11][i]}s ease-in-out infinite`,
          animationDelay: `${[0, 1.5, 3, 0.5, 2, 4][i]}s`,
        }}
      />
    ))}
  </div>
);

function Login() {
  const [isLoading, setIsLoading] = useState({
    telegram: false,
    google: false,
  });
  const [loginToken, setLoginToken] = useState(null);
  const [telegramUrl, setTelegramUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useAuth();

  //tanpa {mutate:} ambil seluruh object dari reactquery, bisa onsuccess, onerror
  const requestLogin = useRequestLogin();
  const { data: verifyData } = useVerifyLoginToken(loginToken, isAuthenticated);
  const { mutateAsync: loginGoogle } = useLoginGoogle();

  useEffect(() => {
    const t = setTimeout(() => setCardVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleTelegramLogin = () => {
    setIsLoading((p) => ({ ...p, telegram: true }));

    const newWindow = window.open("", "_blank");

    requestLogin.mutate(undefined, {
      onSuccess: (data) => {
        setLoginToken(data.token);
        setTelegramUrl(data.telegramUrl);
        setTimeLeft(data.expiresIn ?? 300);

        if (newWindow) {
          newWindow.opener = null;
          newWindow.location.href = data.telegramUrl;
        }
      },
      onError: () => {
        if (newWindow) newWindow.close();
        toast.error("Gagal login via Telegram");
      },
      onSettled: () => setIsLoading((p) => ({ ...p, telegram: false })),
    });
  };

  const handleCancel = () => {
    setLoginToken(null);
    setTelegramUrl(null);
    setTimeLeft(0);
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const progress = timeLeft > 0 ? (timeLeft / 300) * 100 : 0;
  const circumference = 2 * Math.PI * 28;

  useEffect(() => {
    if (verifyData?.isAuthenticated) {
      setUser(verifyData.user);
      toast.success("Login berhasil!");
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
          toast.error("Sesi login habis. Silakan coba lagi.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loginToken, timeLeft]);

  return (
    <>
      <div
        className="login-root min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #f0f4ff 0%, #fafbff 50%, #eef2ff 100%)",
        }}
      >
        <FloatingDots />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className={`relative w-full max-w-sm z-10 ${cardVisible ? "card-enter" : "opacity-0"}`}
        >
          <div className="flex flex-col items-center mb-8 fade-up">
            <div className="logo-mark w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg mb-3">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Patungan
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-light">
              Kelola grup patungan bersama
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-100/50 border border-white/90 overflow-hidden">
            <div className="p-8">
              {!loginToken ? (
                <div>
                  <div className="mb-7 fade-up-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      Selamat datang
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Pilih metode login untuk melanjutkan
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="fade-up-2">
                      <button
                        onClick={handleTelegramLogin}
                        disabled={isLoading.telegram || isLoading.google}
                        className="btn-telegram w-full px-5 py-3.5 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading.telegram ? (
                          <>
                            <svg
                              className="w-4 h-4 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                            <span>Menghubungkan...</span>
                          </>
                        ) : (
                          <>
                            <TelegramIcon />
                            <span>Masuk dengan Telegram</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="fade-up-2 flex items-center gap-3 py-1">
                      <div className="divider-line flex-1" />
                      <span className="text-xs text-gray-400 font-medium">
                        atau
                      </span>
                      <div className="divider-line flex-1" />
                    </div>

                    <div className="fade-up-3">
                      <div
                        className="google-wrapper w-full rounded-2xl overflow-hidden"
                        style={{ minHeight: 44 }}
                      >
                        <GoogleLogin
                          width="100%"
                          onSuccess={async (credentialResponse) => {
                            const toastId = toast.loading("Memproses login...");
                            setIsLoading((p) => ({ ...p, google: true }));

                            const timeout = new Promise((_, reject) =>
                              setTimeout(
                                () => reject(new Error("Request timeout")),
                                10000,
                              ),
                            );

                            try {
                              const idToken = credentialResponse.credential;

                              const res = await Promise.race([
                                loginGoogle(idToken),
                                timeout,
                              ]);

                              setUser(res.user);
                              toast.success("Login berhasil!", { id: toastId });
                              navigate("/dashboard");
                            } catch (err) {
                              const msg =
                                err.message === "Request timeout"
                                  ? "Koneksi timeout, coba lagi"
                                  : err?.response?.data?.error || "Login gagal";

                              toast.error(msg, { id: toastId });
                            } finally {
                              setIsLoading((p) => ({ ...p, google: false }));
                            }
                          }}
                          onError={() => toast.error("Login Google gagal")}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-gray-400 mt-6 fade-up-3">
                    Dengan masuk, kamu menyetujui{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                      kebijakan privasi
                    </span>{" "}
                    kami
                  </p>
                </div>
              ) : (
                <div className="fade-up">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-6 -ml-1"
                  >
                    <ArrowLeft size={14} />
                    Kembali
                  </button>

                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 rounded-full bg-blue-100 blur-md opacity-60" />

                      <svg
                        className="w-full h-full -rotate-90 relative z-10"
                        viewBox="0 0 72 72"
                      >
                        <circle
                          cx="36"
                          cy="36"
                          r="28"
                          fill="none"
                          stroke="#e0e7ff"
                          strokeWidth="5"
                        />
                        <circle
                          cx="36"
                          cy="36"
                          r="28"
                          fill="none"
                          stroke="url(#progressGrad)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={
                            circumference * (1 - progress / 100)
                          }
                          className="progress-ring"
                        />
                        <defs>
                          <linearGradient
                            id="progressGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <span className="text-2xl font-black text-gray-800 font-mono leading-none tabular-nums">
                          {formatTime(timeLeft)}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium">
                          tersisa
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-center mb-4">
                    <div className="flex items-center justify-center gap-1.5 mb-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-blue-400"
                          style={{
                            animation: "pulseGlow 1.4s ease infinite",
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-bold text-gray-800 text-sm mb-1">
                      Menunggu konfirmasi Telegram
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Buka Telegram dan ketuk tombol konfirmasi dari bot kami
                    </p>
                  </div>

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-open-tg w-full py-3 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 mb-3"
                  >
                    <TelegramIcon />
                    Buka Telegram
                    <ExternalLink size={14} className="opacity-70" />
                  </a>
                  <button
                    onClick={handleCancel}
                    className="btn-cancel w-full py-3 border border-gray-200 text-gray-500 rounded-2xl font-medium text-sm"
                  >
                    Batalkan
                  </button>
                </div>
              )}
            </div>
          </div>

          {!loginToken && (
            <p className="text-center text-xs text-gray-400 mt-4 fade-up-3">
              Patungan &copy; {new Date().getFullYear()} &mdash; Kelola grup
              patungan bersama
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
