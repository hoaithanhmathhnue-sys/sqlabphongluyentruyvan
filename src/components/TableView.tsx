import React from 'react';
import { QueryResult } from '../types';
import { Clock, Table, Database } from 'lucide-react';

interface TableViewProps {
  data: QueryResult | null;
  title?: string;
  maxHeight?: string;
  emptyMessage?: string;
}

export const TableView: React.FC<TableViewProps> = ({
  data,
  title,
  maxHeight = 'max-h-[360px]',
  emptyMessage = 'Chưa có kết quả nào. Hãy viết truy vấn và bấm "Chạy thử".'
}) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 text-center">
        <Table className="w-10 h-10 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">Kết quả thực thi sẽ hiển thị dưới dạng bảng dữ liệu quan hệ tại đây.</p>
      </div>
    );
  }

  const { columns, values, executionTimeMs } = data;

  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
        <Database className="w-8 h-8 text-sky-500 mb-2" />
        <p className="text-sm font-semibold text-slate-700">Câu lệnh đã thực thi thành công nhưng không trả về dòng dữ liệu nào.</p>
        {executionTimeMs !== undefined && (
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Thời gian: {executionTimeMs} ms
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Table header info */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-2.5 text-xs text-slate-600">
        <div className="flex items-center space-x-2 font-medium">
          <Table className="w-4 h-4 text-sky-600" />
          <span>{title || 'Bảng kết quả'}</span>
          <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-semibold text-[11px]">
            {values.length} dòng × {columns.length} cột
          </span>
        </div>
        {executionTimeMs !== undefined && (
          <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{executionTimeMs} ms</span>
          </div>
        )}
      </div>

      {/* Table content with scrollable area */}
      <div className={`overflow-auto ${maxHeight}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 z-10">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center text-slate-400 font-normal border-r border-slate-200">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="py-2.5 px-3.5 border-r border-slate-200 last:border-r-0 whitespace-nowrap font-mono tracking-tight">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {values.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-slate-400 italic">
                  Không có bản ghi nào phù hợp với điều kiện truy vấn.
                </td>
              </tr>
            ) : (
              values.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-sky-50/40 transition-colors">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px] border-r border-slate-100 bg-slate-50/30">
                    {rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-2 px-3.5 border-r border-slate-100 last:border-r-0 whitespace-nowrap ${
                        typeof cell === 'number' ? 'font-mono text-right text-slate-800' : 'text-slate-700'
                      }`}
                    >
                      {cell === null ? (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded font-mono italic">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
