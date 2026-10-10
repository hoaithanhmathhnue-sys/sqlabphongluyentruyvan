import React, { useRef, useEffect, useState } from 'react';
import { Play, Send, Lightbulb, RotateCcw, Copy, Check, Sparkles, Code2, AlertCircle } from 'lucide-react';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onShowHint: () => void;
  onResetTaskQuery: () => void;
  isEvaluating: boolean;
  isRunning: boolean;
  hintAvailable: boolean;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onRun,
  onSubmit,
  onShowHint,
  onResetTaskQuery,
  isEvaluating,
  isRunning,
  hintAvailable
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(Math.max(lines, 4));
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Phím tắt Ctrl+Enter hoặc Cmd+Enter để chạy
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Phím tắt Ctrl+S hoặc Cmd+S để nộp bài
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSubmit();
      return;
    }

    // Xử lý phím Tab để thụt 2 dấu cách thay vì nhảy focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    // Format cơ bản các từ khóa SQL thành chữ hoa và canh hàng đẹp
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'JOIN',
      'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE',
      'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AS', 'DISTINCT', 'DESC', 'ASC'
    ];

    let formatted = value;
    // Chuẩn hóa một số từ khóa chính lên đầu dòng nếu thích hợp
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw);
    });

    onChange(formatted);
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + (value.endsWith('\n') ? '' : '\n') + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextVal = value.substring(0, start) + snippet + value.substring(end);
    onChange(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 0);
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-slate-700 font-semibold text-sm">
            <Code2 className="w-4 h-4 text-sky-600" />
            <span>Trình soạn thảo SQL</span>
          </div>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Nhấn <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white border border-slate-300 rounded shadow-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white border border-slate-300 rounded shadow-xs">Enter</kbd> để chạy
          </span>
        </div>

        {/* Action helper buttons */}
        <div className="flex items-center space-x-1.5">
          {/* Quick Snippet dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="text-xs px-2.5 py-1 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 flex items-center gap-1 transition"
              title="Chèn mẫu cú pháp SQL nhanh"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Mẫu SQL</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-44 z-20">
              <button
                type="button"
                onClick={() => insertSnippet('SELECT * FROM ')}
                className="text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                SELECT * FROM ...
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\nWHERE ')}
                className="text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                WHERE điều_kiện
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\nINNER JOIN BangB ON BangA.Khoa = BangB.Khoa')}
                className="text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                INNER JOIN ... ON ...
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\nORDER BY cot DESC')}
                className="text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                ORDER BY ... DESC
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\nGROUP BY cot HAVING COUNT(*) > 1')}
                className="text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                GROUP BY ... HAVING ...
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFormat}
            className="text-xs px-2 py-1 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition"
            title="Chuẩn hóa chữ hoa các từ khóa SQL"
          >
            Định dạng
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-2 py-1 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition flex items-center gap-1"
            title="Sao chép truy vấn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Chép'}</span>
          </button>

          <button
            type="button"
            onClick={onResetTaskQuery}
            className="text-xs px-2 py-1 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-rose-600 transition flex items-center gap-1"
            title="Khôi phục lại truy vấn ban đầu của bài"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Làm lại</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex bg-slate-950 text-slate-100 font-mono text-sm min-h-[160px] max-h-[320px] overflow-auto">
        {/* Line numbers gutter */}
        <div className="select-none bg-slate-900/90 text-slate-500 py-3 px-3 text-right font-mono text-xs border-r border-slate-800 flex flex-col items-end min-w-[40px]">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6 h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="-- Nhập câu lệnh SQL tại đây (Ví dụ: SELECT * FROM Sach;)"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full h-full min-h-[160px] p-3 font-mono text-sm text-emerald-300 bg-transparent resize-none focus:outline-hidden leading-6 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Editor Footer / Action Buttons */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 gap-3">
        <div className="flex items-center space-x-2">
          {hintAvailable && (
            <button
              type="button"
              onClick={onShowHint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition shadow-xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Gợi ý hướng dẫn</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Nút Chạy truy vấn */}
          <button
            type="button"
            onClick={onRun}
            disabled={isRunning || isEvaluating}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 active:scale-98 transition shadow-xs disabled:opacity-50"
            title="Thực thi truy vấn và xem kết quả bảng ngay lập tức (Ctrl+Enter)"
          >
            <Play className={`w-4 h-4 text-sky-600 fill-sky-600 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Đang chạy...' : 'Chạy thử'}</span>
          </button>

          {/* Nút Nộp bài */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isEvaluating || isRunning}
            className="inline-flex items-center space-x-1.5 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 rounded-lg shadow-sm hover:shadow active:scale-98 transition disabled:opacity-50 cursor-pointer"
            title="Hệ thống chấm tự động và ghi nhận điểm số"
          >
            <Send className={`w-4 h-4 ${isEvaluating ? 'animate-bounce' : ''}`} />
            <span>{isEvaluating ? 'Đang chấm...' : 'Nộp bài'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
