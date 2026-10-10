import React from 'react';
import { DatabaseMetadata, StudentProfile } from '../types';
import { 
  Database, 
  BookOpen, 
  GraduationCap, 
  ShoppingCart, 
  Award, 
  User, 
  RefreshCw, 
  BarChart2, 
  GitFork, 
  Terminal, 
  ChevronDown,
  Sparkles,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'workspace' | 'er' | 'join' | 'report';
  onTabChange: (tab: 'workspace' | 'er' | 'join' | 'report') => void;
  activeDatabase: DatabaseMetadata;
  onOpenDbModal: () => void;
  studentProfile: StudentProfile;
  totalScore: number;
  onOpenStudentModal: () => void;
  onResetDb: () => void;
  isResetting: boolean;
  onOpenAuthorModal: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  activeDatabase,
  onOpenDbModal,
  studentProfile,
  totalScore,
  onOpenStudentModal,
  onResetDb,
  isResetting,
  onOpenAuthorModal,
  onLogout
}) => {
  const getDbIcon = (id: string) => {
    switch (id) {
      case 'thu_vien':
        return <BookOpen className="w-3.5 h-3.5 text-sky-500" />;
      case 'quan_ly_diem':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />;
      case 'ban_hang':
        return <ShoppingCart className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Database className="w-3.5 h-3.5 text-sky-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 gap-2">
        {/* Brand / Logo with School Logo */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Logo trường Hoàng Diệu */}
          <div 
            onClick={onOpenAuthorModal}
            className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white shrink-0 cursor-pointer hover:opacity-90 transition"
            title="Trường THPT Hoàng Diệu – Bấm để xem thông tin tác giả"
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <span className="font-black text-lg tracking-tighter">SQL</span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">SQLAB</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-teal-100 text-teal-800">
                THPT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              THPT Hoàng Diệu • TP. Cần Thơ
            </p>
          </div>
        </div>

        {/* Database Selector Pill */}
        <div className="hidden lg:flex items-center">
          <button
            type="button"
            onClick={onOpenDbModal}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition cursor-pointer"
            title="Đổi cơ sở dữ liệu mẫu"
          >
            {getDbIcon(activeDatabase.id)}
            <span>CSDL: {activeDatabase.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onTabChange('workspace')}
            className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
              activeTab === 'workspace'
                ? 'bg-white text-sky-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Luyện tập</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('er')}
            className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
              activeTab === 'er'
                ? 'bg-white text-sky-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sơ đồ ER</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('join')}
            className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
              activeTab === 'join'
                ? 'bg-white text-sky-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mô phỏng JOIN</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('report')}
            className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
              activeTab === 'report'
                ? 'bg-white text-sky-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Giáo viên</span>
          </button>
        </nav>

        {/* User Profile, Author Chip & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Author Chip with Avatar */}
          <button
            type="button"
            onClick={onOpenAuthorModal}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Xem thông tin Tác giả sáng kiến – Cô Trần Thị Kim Thoa"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-300 bg-white shrink-0">
              <img 
                src="/avatar.jpg" 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="hidden xl:inline">Tác giả:</span>
            <span className="truncate max-w-[95px] sm:max-w-none">Cô Kim Thoa</span>
          </button>


          {/* Reset DB Button */}
          <button
            type="button"
            onClick={onResetDb}
            disabled={isResetting}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition border border-transparent hover:border-slate-200 cursor-pointer"
            title="Khôi phục lại dữ liệu gốc của CSDL này"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {/* Student Profile Chip */}
          <button
            type="button"
            onClick={onOpenStudentModal}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition shadow-xs cursor-pointer"
            title="Đổi tên và lớp học của bạn"
          >
            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[11px]">
              {studentProfile.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="font-bold text-slate-800 leading-tight truncate max-w-[90px]">
                {studentProfile.name}
              </p>
              <p className="text-[10px] text-slate-400">Lớp {studentProfile.className}</p>
            </div>
            <div className="flex items-center space-x-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-bold text-[10px] border border-amber-200">
              <Award className="w-3 h-3" />
              <span>{totalScore}đ</span>
            </div>
          </button>

          {/* Nút Đăng xuất */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-rose-200/90 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
