import React, { useState } from 'react';
import { User, School, X, Check } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (name: string, className: string) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [name, setName] = useState(profile.name);
  const [className, setClassName] = useState(profile.className);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), className.trim() || '11A1');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Thông tin học sinh luyện tập</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ và tên học sinh <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Hoàng Khang"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lớp học
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ví dụ: 11A1 hoặc 12A2"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Dữ liệu được lưu trong trình duyệt máy tính của bạn (localStorage), dùng để ghi nhận tiến độ và tạo bảng báo cáo giáo viên.
          </p>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu thông tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
