import React, { useState } from 'react';
import { X, Lock, User, KeyRound, AlertCircle, CheckCircle2, Sparkles, School } from 'lucide-react';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (teacherName: string) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('Trần Thị Kim Thoa');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim().toLowerCase();
    const targetUser = 'Trần Thị Kim Thoa'.toLowerCase();

    // Kiểm tra tên đăng nhập và mật khẩu theo đúng file THÔNG TIN GV.txt
    if ((trimmedUser === targetUser || trimmedUser === 'kimthoa' || trimmedUser === 'admin') && password === '12345') {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onLoginSuccess('Trần Thị Kim Thoa');
        onClose();
      }, 700);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác! (Gợi ý: user: Trần Thị Kim Thoa, pass: 12345)');
    }
  };

  const handleQuickFill = () => {
    setUsername('Trần Thị Kim Thoa');
    setPassword('12345');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 p-6 text-white text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* School logo & Avatar */}
          <div className="flex items-center justify-center -space-x-2 mb-3">
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-white overflow-hidden z-10 shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="w-16 h-16 rounded-full border-3 border-white shadow-lg bg-slate-200 overflow-hidden z-20 shrink-0">
              <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          <h2 className="text-xl font-black">Cổng Đăng Nhập Giáo Viên</h2>
          <p className="text-xs text-sky-200 mt-0.5">
            Quản trị & Báo cáo học tập SQLAB – Trường THPT Hoàng Diệu
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-slate-800">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đăng nhập thành công! Đang chuyển tiếp...</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên đăng nhập (Username):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Trần Thị Kim Thoa"
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu (Password):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••"
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-medium"
              />
            </div>
          </div>

          {/* Quick fill button */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Điền mẫu tài khoản tác giả</span>
            </button>
            <span className="text-[11px] text-slate-400">Mặc định: 12345</span>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 text-xs rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="w-2/3 py-2 text-xs rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
