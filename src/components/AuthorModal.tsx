import React from 'react';
import { X, Award, School, MapPin, User, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Mail, Phone } from 'lucide-react';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with decorative gradient banner */}
        <div className="relative bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 p-6 text-white text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* School Logo & Avatar Badge */}
          <div className="flex items-center justify-center -space-x-3 mb-3">
            <div className="w-16 h-16 rounded-full border-3 border-white/90 shadow-lg bg-white overflow-hidden z-10 shrink-0">
              <img 
                src="/logo.jpg" 
                alt="Logo Trường THPT Hoàng Diệu" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback nếu ảnh không load được
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-slate-200 overflow-hidden z-20 shrink-0">
              <img 
                src="/avatar.jpg" 
                alt="Cô giáo Trần Thị Kim Thoa" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>TÁC GIẢ SÁNG KIẾN GIẢI PHÁP</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Trần Thị Kim Thoa</h2>
          <p className="text-xs text-sky-200 mt-0.5 font-medium">
            Đảng viên, Giáo viên Tin học – Trường THPT Hoàng Diệu
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* Thông tin đơn vị */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Thông tin đơn vị công tác</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="flex items-start space-x-2">
                <School className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Đơn vị:</span>
                  <span className="text-slate-600">Trường THPT Hoàng Diệu</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <User className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Chức vụ:</span>
                  <span className="text-slate-600">Đảng viên, Giáo viên môn Tin học</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Địa chỉ:</span>
                  <span className="text-slate-600">Số 1 Mạc Đỉnh Chi, phường Phú Lợi, thành phố Cần Thơ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Giới thiệu sản phẩm sáng kiến */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Về sản phẩm giáo dục SQLAB</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Web app <strong className="text-slate-900">“SQLAB – Phòng luyện truy vấn cơ sở dữ liệu quan hệ”</strong> được cô <strong>Trần Thị Kim Thoa</strong> trực tiếp nghiên cứu, thiết kế và phát triển nhằm đổi mới căn bản phương pháp dạy học mạch nội dung <strong className="text-sky-800">Hệ cơ sở dữ liệu và Ngôn ngữ SQL</strong> trong Chương trình GDPT 2018 (môn Tin học 11, 12 - Định hướng Khoa học máy tính).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sky-900 block">SQLite WebAssembly</span>
                  <span className="text-slate-600">Chạy 100% trong trình duyệt, không cần máy chủ, gỡ bỏ hoàn toàn rào cản cài đặt.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-100 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-900 block">Chấm kết quả ngữ nghĩa</span>
                  <span className="text-slate-600">So khớp bảng dữ liệu đầu ra, công nhận mọi cách viết đúng khác nhau của học sinh.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-900 block">Sơ đồ ER & Mô phỏng JOIN</span>
                  <span className="text-slate-600">Trực quan hóa khóa chính, khóa ngoại và cơ chế ghép nối bảng tạm từng bước.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block">Phân tích lỗi tự động</span>
                  <span className="text-slate-600">Báo cáo sư phạm dành cho giáo viên, phân loại 4 nhóm lỗi phổ biến của cả lớp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Bản quyền © 2026 – Trần Thị Kim Thoa</span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenLogin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition shadow-xs cursor-pointer"
              >
                Đăng nhập Giáo viên
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
