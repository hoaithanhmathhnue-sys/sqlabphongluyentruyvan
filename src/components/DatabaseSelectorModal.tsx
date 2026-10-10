import React from 'react';
import { DATABASES } from '../data/databases';
import { DatabaseMetadata } from '../types';
import { Database, BookOpen, GraduationCap, ShoppingCart, Check, ArrowRight, X, Table } from 'lucide-react';

interface DatabaseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDbId: string;
  onSelectDb: (dbId: string) => void;
}

export const DatabaseSelectorModal: React.FC<DatabaseSelectorModalProps> = ({
  isOpen,
  onClose,
  activeDbId,
  onSelectDb
}) => {
  if (!isOpen) return null;

  const getDbIcon = (id: string) => {
    switch (id) {
      case 'thu_vien':
        return <BookOpen className="w-5 h-5 text-sky-600" />;
      case 'quan_ly_diem':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'ban_hang':
        return <ShoppingCart className="w-5 h-5 text-emerald-600" />;
      default:
        return <Database className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">Chọn Cơ sở dữ liệu luyện tập</h3>
              <p className="text-xs text-slate-500">Mỗi CSDL mô phỏng một bài toán thực tế trong chương trình Tin học THPT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DATABASES.map((db) => {
              const isSelected = db.id === activeDbId;

              return (
                <div
                  key={db.id}
                  onClick={() => {
                    onSelectDb(db.id);
                    onClose();
                  }}
                  className={`rounded-2xl border p-4.5 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-100">
                        {getDbIcon(db.id)}
                      </div>
                      {isSelected ? (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                          <Check className="w-3 h-3" />
                          <span>Đang chọn</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Click để chọn</span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-800">{db.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                      {db.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                      Danh sách các bảng:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {db.tables.map((t) => (
                        <span
                          key={t.name}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-mono font-medium"
                        >
                          {t.name} ({t.columns.length} cột)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>* Toàn bộ dữ liệu được lưu trên SQLite WebAssembly cục bộ trong trình duyệt.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
