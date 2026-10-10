import React, { useState, useEffect } from 'react';
import { JOIN_DEMOS } from '../data/joinStepExamples';
import { TableView } from './TableView';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Layers, HelpCircle, CheckCircle, ArrowRight, Table } from 'lucide-react';

export const JoinSimulator: React.FC = () => {
  const [selectedDemoId, setSelectedDemoId] = useState(JOIN_DEMOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDemo = JOIN_DEMOS.find((d) => d.id === selectedDemoId) || JOIN_DEMOS[0];
  const steps = currentDemo.steps;
  const currentStep = steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleSelectDemo = (id: string) => {
    setSelectedDemoId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Simulator Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Mô phỏng từng bước cơ chế JOIN (Xem bảng tạm)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quan sát cách hệ quản trị CSDL ghép dữ liệu từ 2 bảng qua điều kiện liên kết ON
              </p>
            </div>
          </div>

          {/* Select Demo Scenario */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-600">Kịch bản minh họa:</label>
            <select
              value={selectedDemoId}
              onChange={(e) => handleSelectDemo(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {JOIN_DEMOS.map((demo) => (
                <option key={demo.id} value={demo.id}>
                  {demo.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SQL query presentation box */}
        <div className="mt-3 p-3 bg-slate-900 rounded-lg font-mono text-xs text-slate-200 shadow-inner overflow-x-auto">
          <span className="text-slate-400 select-none">-- Câu lệnh JOIN đang mô phỏng:</span>
          <pre className="mt-1 text-emerald-300 whitespace-pre-wrap">{currentDemo.query}</pre>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
          {steps.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                    isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-500 border-2 border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : s.stepNumber}
                </div>
                <span className={`text-[11px] font-semibold mt-1.5 text-center hidden md:block max-w-[120px] ${
                  isCurrent ? 'text-sky-700' : 'text-slate-500'
                }`}>
                  {s.title.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail Content */}
      <div className="flex-1 p-5 overflow-auto space-y-4">
        {/* Step description banner */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex items-start space-x-3">
          <div className="p-2 bg-sky-200/60 text-sky-800 rounded-lg shrink-0 mt-0.5">
            <Table className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-sky-950">{currentStep.title}</h3>
              <span className="font-mono text-xs px-2 py-0.5 bg-white border border-sky-300 text-sky-800 rounded font-semibold">
                {currentStep.operation}
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {currentStep.description}
            </p>
            {currentStep.note && (
              <p className="text-xs font-semibold text-sky-800 mt-2 bg-sky-100/60 p-2 rounded-md">
                💡 {currentStep.note}
              </p>
            )}
          </div>
        </div>

        {/* Bảng tạm (Temporary Working Table) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">
                Bảng tạm (Intermediate Table) sau {currentStep.title.split(':')[0]}:
              </span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                {currentStep.rows.length} dòng × {currentStep.columns.length} cột
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 font-semibold text-slate-700 border-b border-slate-200 z-10">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center text-slate-400 font-normal border-r border-slate-200">#</th>
                    {currentStep.columns.map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3.5 border-r border-slate-200 last:border-r-0 font-mono">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStep.rows.map((row, rIdx) => {
                    const isRowHighlighted = currentStep.highlightedRowIndices?.includes(rIdx);
                    return (
                      <tr
                        key={rIdx}
                        className={`transition-colors ${
                          isRowHighlighted
                            ? 'bg-amber-50 font-medium text-amber-950'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px] border-r border-slate-100">
                          {rIdx + 1}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3.5 border-r border-slate-100 last:border-r-0 font-mono">
                            {cell === null ? (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] italic">NULL</span>
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Bottom Controls */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Về bước 1</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bước trước</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-sky-600" />
                <span>Tự động chạy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="inline-flex items-center space-x-1 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-40 transition shadow-xs"
          >
            <span>Bước tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
