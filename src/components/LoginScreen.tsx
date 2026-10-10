import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  LogIn, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  School, 
  CheckCircle2, 
  KeyRound,
  Terminal,
  Database,
  Info
} from 'lucide-react';
import { verifyTeacherCredentials, setAuthenticatedSession } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (displayName: string) => void;
  onOpenAuthorModal?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLoginSuccess, 
  onOpenAuthorModal 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Giả lập độ trễ xác thực nhỏ để tạo cảm giác xử lý mật mã mượt mà
      await new Promise((resolve) => setTimeout(resolve, 350));

      const result = await verifyTeacherCredentials(username, password);

      if (result.success && result.displayName) {
        // Lưu phiên đăng nhập an toàn
        setAuthenticatedSession(rememberMe, result.displayName);
        onLoginSuccess(result.displayName);
      } else {
        setErrorMessage(
          result.errorMessage || 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
        );
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err);
      setErrorMessage('Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại!');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none text-slate-100">
      {/* Hiệu ứng quả cầu ánh sáng nền mềm mại (ambient glow) */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid họa tiết chìm công nghệ */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className={`w-full max-w-md relative z-10 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
        {/* Card Đăng Nhập Glassmorphism */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl shadow-sky-950/40 p-6 sm:p-8 overflow-hidden">
          
          {/* Header Card với Logo */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center -space-x-3 mb-4">
              {/* Logo Trường THPT Hoàng Diệu */}
              <div 
                onClick={onOpenAuthorModal}
                className="w-16 h-16 rounded-2xl border-2 border-white/80 shadow-lg bg-white overflow-hidden z-10 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title="Bấm để xem thông tin Tác giả sáng kiến"
              >
                <img 
                  src="/logo.jpg" 
                  alt="Logo THPT Hoàng Diệu" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Logo SQLAB */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 z-20 shrink-0 border-2 border-slate-800">
                <span className="font-black text-xl tracking-tighter">SQL</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>HỆ THỐNG GIẢNG DẠY CSDL SQL</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Đăng Nhập Hệ Thống
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Trường THPT Hoàng Diệu • TP. Cần Thơ
            </p>
          </div>

          {/* Hộp báo lỗi nếu có */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Biểu mẫu đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trường Tên Đăng Nhập */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between"
              >
                <span>Họ và tên / Tên đăng nhập</span>
                <span className="text-[11px] text-slate-400 font-normal">Giáo viên hướng dẫn</span>
              </label>
              <div className="relative rounded-xl border border-slate-700/80 bg-slate-800/60 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập họ và tên giáo viên..."
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 outline-none rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Trường Mật Khẩu */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between"
              >
                <span>Mật khẩu truy cập</span>
                <span className="text-[11px] text-slate-400 font-normal">Mã khóa bảo vệ</span>
              </label>
              <div className="relative rounded-xl border border-slate-700/80 bg-slate-800/60 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 outline-none rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ đăng nhập */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-sky-600 focus:ring-sky-500/30 rounded-md cursor-pointer accent-sky-500"
                />
                <span>Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>

            {/* Nút Đăng Nhập */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 hover:from-sky-500 hover:via-teal-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 hover:shadow-sky-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực an toàn...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Vào Phòng Luyện SQLAB</span>
                </>
              )}
            </button>
          </form>

          {/* Phần chân Card */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo mật SHA-256 một chiều</span>
            </div>

            {onOpenAuthorModal && (
              <button
                type="button"
                onClick={onOpenAuthorModal}
                className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition cursor-pointer flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Thông tin tác giả</span>
              </button>
            )}
          </div>
        </div>

        {/* Cam kết bảo mật phía dưới */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Thông tin xác thực được mã hóa băm mật mã • Không lưu mật khẩu thô</span>
          </p>
        </div>
      </div>
    </div>
  );
};
