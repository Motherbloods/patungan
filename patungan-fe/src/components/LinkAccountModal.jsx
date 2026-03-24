import { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  Zap,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import {
  useLinkGoogle,
  useLinkTelegram,
  useVerifyLinkToken,
} from "../hooks/useAuth";
import toast from "react-hot-toast";

function LinkAccountModal({ provider, onClose, onSuccess }) {
  const [step, setStep] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [linkToken, setLinkToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const { mutate: linkGoogle } = useLinkGoogle();
  const { mutate: requestLinkTelegram } = useLinkTelegram();

  const { data: linkData, error: linkError } = useVerifyLinkToken(
    step === "waiting" ? linkToken : null,
  );

  useEffect(() => {
    if (!linkData) return;
    if (linkData?.linked) {
      setStep("success");
      onSuccess(linkData.user);
      toast.success("Akun berhasil ditautkan 🎉");
    }
  }, [linkData, onSuccess]);

  useEffect(() => {
    if (!linkError) return;

    const status = linkError.response?.status;
    const msg = linkError.response?.data?.error;

    if (status === 401) {
      setStep("error");
      setErrorMsg("Link kedaluwarsa. Silakan coba lagi.");
      toast.error("Link kedaluwarsa");
    } else if (status === 409 || status === 400) {
      setStep("error");
      setErrorMsg(msg || "Gagal menautkan akun.");
      toast.error(msg || "Gagal menautkan akun");
    }
  }, [linkError]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStep("error");
          setErrorMsg("Link kedaluwarsa. Silakan coba lagi.");
          toast.error("Link kedaluwarsa");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRequestTelegram = () => {
    setStep("loading");
    setErrorMsg("");

    const newWindow = window.open("", "_blank");

    requestLinkTelegram(undefined, {
      onSuccess: (res) => {
        setLinkToken(res.linkToken);
        setTelegramUrl(res.telegramUrl);
        setTimeLeft(res.expiresIn);
        setStep("waiting");

        if (newWindow) {
          newWindow.opener = null;
          newWindow.location.href = res.telegramUrl;
        }

        toast.success("Silakan konfirmasi di Telegram");
      },
      onError: (err) => {
        if (newWindow) newWindow.close();

        setStep("error");
        setErrorMsg(
          err.response?.data?.error || "Gagal membuat link. Coba lagi.",
        );
        toast.error("Gagal membuat link Telegram");
      },
    });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setStep("loading");
    setErrorMsg("");

    linkGoogle(credentialResponse.credential, {
      onSuccess: (res) => {
        setStep("success");
        onSuccess(res.user);
        toast.success("Akun Google berhasil ditautkan");
      },
      onError: (err) => {
        setStep("error");
        setErrorMsg(
          err.response?.data?.error || "Gagal menautkan Google. Coba lagi.",
        );
        toast.error("Gagal menautkan Google");
      },
    });
  };

  const handleRetry = () => {
    setStep("idle");
    setErrorMsg("");
    setTimeLeft(0);
    setLinkToken("");

    toast("Silakan coba lagi", {
      icon: "🔄",
    });
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const progress = timeLeft > 0 ? (timeLeft / 300) * 100 : 0;
  const isGoogle = provider === "google";
  const providerLabel = isGoogle ? "Google" : "Telegram";

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const TelegramIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0088cc">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.488c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.71l-2.95-.924c-.642-.202-.654-.642.136-.95l11.532-4.448c.534-.194 1.002.13.674.86z" />
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes checkIn {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .modal-enter { animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .backdrop-enter { animation: backdropIn 0.2s ease forwards; }
        .slide-up { animation: slideUp 0.3s ease forwards; }
        .check-enter { animation: checkIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .shimmer-btn {
          background: linear-gradient(90deg, #2563eb 0%, #3b82f6 40%, #60a5fa 50%, #3b82f6 60%, #2563eb 100%);
          background-size: 200% auto;
        }
        .shimmer-btn:hover { animation: shimmer 1.5s linear infinite; }
        .progress-ring { transition: stroke-dashoffset 1s linear; }
      `}</style>

      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="backdrop-enter absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={step !== "loading" ? onClose : undefined}
        />

        <div className={`modal-enter relative w-full max-w-sm z-10`}>
          <div
            className={`absolute -inset-px rounded-2xl blur-sm opacity-40 ${isGoogle ? "bg-linear-to-br from-blue-400 to-blue-600" : "bg-linear-to-br from-sky-400 to-cyan-500"}`}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div
              className={`h-1 w-full ${isGoogle ? "bg-linear-to-r from-blue-500 via-blue-400 to-indigo-500" : "bg-linear-to-r from-sky-400 via-cyan-400 to-sky-500"}`}
            />

            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${isGoogle ? "bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100" : "bg-linear-to-br from-sky-50 to-cyan-50 border border-sky-100"}`}
                  >
                    {isGoogle ? <GoogleIcon /> : <TelegramIcon />}
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-bold text-base leading-tight">
                      Tautkan {providerLabel}
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                      <Shield size={10} />
                      Aman & terenkripsi
                    </p>
                  </div>
                </div>
                {step !== "loading" && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600 mt-0.5"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-gray-100 to-transparent mb-5" />

              {step === "idle" && (
                <div className="slide-up flex flex-col gap-4">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {isGoogle
                      ? "Pilih akun Google yang ingin ditautkan. Pastikan akun ini belum digunakan di akun lain."
                      : "Klik tombol di bawah, lalu konfirmasi di Telegram Bot untuk menautkan akunmu."}
                  </p>

                  <div
                    className={`rounded-xl p-3.5 flex items-start gap-3 ${isGoogle ? "bg-blue-50/70 border border-blue-100" : "bg-sky-50/70 border border-sky-100"}`}
                  >
                    <Zap
                      size={15}
                      className={`mt-0.5 shrink-0 ${isGoogle ? "text-blue-500" : "text-sky-500"}`}
                    />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isGoogle
                        ? "Setelah ditautkan, kamu bisa login menggunakan akun Google kapan saja."
                        : "Setelah ditautkan, kamu bisa menerima notifikasi & login via Telegram."}
                    </p>
                  </div>

                  {isGoogle ? (
                    <div className="flex justify-center py-1">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                          setStep("error");
                          setErrorMsg("Login Google gagal. Coba lagi.");
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={handleRequestTelegram}
                      className="shimmer-btn w-full py-3 bg-sky-500 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-200 hover:shadow-sky-300 active:scale-[0.98]"
                    >
                      <TelegramIcon />
                      Hubungkan via Telegram
                      <ExternalLink size={14} className="ml-1 opacity-80" />
                    </button>
                  )}
                </div>
              )}

              {step === "loading" && (
                <div className="slide-up flex flex-col items-center gap-4 py-6">
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isGoogle ? "bg-blue-50" : "bg-sky-50"}`}
                    >
                      {isGoogle ? <GoogleIcon /> : <TelegramIcon />}
                    </div>
                    <div className="absolute -inset-1">
                      <svg className="w-full h-full" viewBox="0 0 72 72">
                        <circle
                          cx="36"
                          cy="36"
                          r="34"
                          fill="none"
                          stroke={isGoogle ? "#dbeafe" : "#e0f2fe"}
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="36"
                          cy="36"
                          r="34"
                          fill="none"
                          stroke={isGoogle ? "#3b82f6" : "#0ea5e9"}
                          strokeWidth="2.5"
                          strokeDasharray="60 154"
                          strokeLinecap="round"
                          style={{
                            animation: "spin-slow 1s linear infinite",
                            transformOrigin: "center",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-800 font-semibold text-sm">
                      Memproses...
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Mohon tunggu sebentar
                    </p>
                  </div>
                </div>
              )}

              {step === "waiting" && (
                <div className="slide-up flex flex-col gap-3">
                  <div className="flex flex-col items-center py-3">
                    <div className="relative w-24 h-24">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 96 96"
                      >
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke="#e0f2fe"
                          strokeWidth="6"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                          className="progress-ring"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-gray-800 font-mono leading-none">
                          {formatTime(timeLeft)}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          tersisa
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-center">
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      ⏳ Menunggu konfirmasi
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Buka Telegram dan konfirmasi permintaan tautan dari bot
                      kami
                    </p>
                  </div>

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
                    aria-label="Buka Telegram lagi di tab baru"
                  >
                    <ExternalLink size={15} />
                    Buka Telegram Lagi
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-medium text-sm transition-all"
                  >
                    Batal
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="slide-up flex flex-col items-center gap-4 py-4">
                  <div className="check-enter relative">
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                      <CheckCircle2
                        size={38}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="absolute -inset-2 rounded-3xl bg-green-400/20 blur-md -z-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-900 font-bold text-base">
                      Berhasil Ditautkan!
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Akun {providerLabel} kamu sudah terhubung
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] shadow-md shadow-green-200"
                  >
                    Lanjutkan
                  </button>
                </div>
              )}

              {step === "error" && (
                <div className="slide-up flex flex-col gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <AlertCircle size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-700">
                        Terjadi Kesalahan
                      </p>
                      <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRetry}
                    className={`w-full py-3 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98] shadow-sm ${isGoogle ? "bg-blue-500 hover:bg-blue-600 shadow-blue-100" : "bg-sky-500 hover:bg-sky-600 shadow-sky-100"}`}
                  >
                    Coba Lagi
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-medium text-sm transition-all"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LinkAccountModal;
