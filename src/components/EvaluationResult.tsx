import React, { useEffect, useState } from 'react';
import { EvaluationOutcome, TaskItem } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Sparkles, RefreshCw, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TableView } from './TableView';

interface EvaluationResultProps {
  outcome: EvaluationOutcome;
  task: TaskItem;
  onTryAgain?: () => void;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  outcome,
  task,
  onTryAgain
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'studentTable' | 'expectedTable'>('feedback');

  useEffect(() => {
    if (outcome.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [outcome.passed]);

  return (
    <div className={`rounded-xl border p-4 shadow-sm transition-all ${
      outcome.passed
        ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
        : 'border-amber-200 bg-amber-50/70 text-amber-950'
    }`}>
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          {outcome.passed ? (
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-base font-bold ${outcome.passed ? 'text-emerald-800' : 'text-amber-800'}`}>
                {outcome.passed ? 'KẾT QUẢ: ĐẠT' : 'KẾT QUẢ: CHƯA ĐẠT'}
              </span>
              {outcome.passed && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-200 text-emerald-800">
                  <Sparkles className="w-3 h-3" /> +{task.points} điểm
                </span>
              )}
            </div>

            <p className="text-sm mt-1 font-medium leading-relaxed">
              {outcome.message}
            </p>

            {outcome.detailedHint && (
              <div className={`mt-2.5 p-3 rounded-lg text-xs leading-relaxed border ${
                outcome.passed
                  ? 'bg-emerald-100/60 border-emerald-200 text-emerald-800'
                  : 'bg-white/80 border-amber-200 text-amber-900 shadow-xs'
              }`}>
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-slate-700">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{outcome.passed ? 'Kiến thức rút ra:' : 'Gợi ý hướng sửa chữa:'}</span>
                </div>
                <p className="whitespace-pre-line">{outcome.detailedHint}</p>
              </div>
            )}
          </div>
        </div>

        {onTryAgain && !outcome.passed && (
          <button
            type="button"
            onClick={onTryAgain}
            className="shrink-0 text-xs px-3 py-1.5 font-semibold text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100/80 active:scale-95 transition flex items-center gap-1 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        )}
      </div>

      {/* Comparison tabs if results exist */}
      {(outcome.studentResult || outcome.expectedResult) && (
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Đối chiếu bảng dữ liệu:</span>
            <div className="flex items-center space-x-1 bg-white/70 p-0.5 rounded-lg border border-slate-200 text-xs">
              {outcome.studentResult && (
                <button
                  type="button"
                  onClick={() => setActiveTab('studentTable')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    activeTab === 'studentTable'
                      ? 'bg-sky-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kết quả bạn ({outcome.studentResult.values.length} dòng)
                </button>
              )}
              {outcome.expectedResult && (
                <button
                  type="button"
                  onClick={() => setActiveTab('expectedTable')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    activeTab === 'expectedTable'
                      ? 'bg-sky-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đáp án chuẩn ({outcome.expectedResult.values.length} dòng)
                </button>
              )}
            </div>
          </div>

          <div className="mt-2">
            {activeTab === 'studentTable' && outcome.studentResult && (
              <TableView
                data={outcome.studentResult}
                title="Dữ liệu do truy vấn của bạn tạo ra"
                maxHeight="max-h-[220px]"
              />
            )}
            {activeTab === 'expectedTable' && outcome.expectedResult && (
              <TableView
                data={outcome.expectedResult}
                title="Bảng dữ liệu kỳ vọng của bài toán"
                maxHeight="max-h-[220px]"
              />
            )}
            {activeTab === 'feedback' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {outcome.studentResult && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Kết quả của bạn:</p>
                    <TableView data={outcome.studentResult} maxHeight="max-h-[160px]" />
                  </div>
                )}
                {outcome.expectedResult && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Đáp án mong muốn:</p>
                    <TableView data={outcome.expectedResult} maxHeight="max-h-[160px]" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
