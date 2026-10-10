import React, { useState } from 'react';
import { TaskItem } from '../types';
import {
  generateTeacherReport,
  exportLogsToCSV,
  exportLogsToJSON,
  seedDemoTeacherLogs,
  clearSubmissionLogs
} from '../services/storageService';
import {
  Users,
  CheckCircle2,
  AlertOctagon,
  FileSpreadsheet,
  FileCode,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  BookOpen,
  Filter
} from 'lucide-react';

interface TeacherReportViewProps {
  tasks: TaskItem[];
  onOpenAuthorModal?: () => void;
}

export const TeacherReportView: React.FC<TeacherReportViewProps> = ({ tasks, onOpenAuthorModal }) => {
  const [reportVersion, setReportVersion] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchStudent, setSearchStudent] = useState('');

  const report = generateTeacherReport(tasks);

  const handleSeedDemo = () => {
    seedDemoTeacherLogs(tasks);
    setReportVersion((v) => v + 1);
  };

  const handleClearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ nhật ký bài làm không?')) {
      clearSubmissionLogs();
      setReportVersion((v) => v + 1);
    }
  };

  const filteredLogs = report.recentLogs.filter((log) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'passed' && log.passed) ||
      (filterStatus === 'failed' && !log.passed);
    const matchesName =
      log.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      log.className.toLowerCase().includes(searchStudent.toLowerCase()) ||
      log.taskTitle.toLowerCase().includes(searchStudent.toLowerCase());
    return matchesStatus && matchesName;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Export Bar with Author Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar and School Logo Badge */}
          <div 
            onClick={onOpenAuthorModal}
            className="flex items-center -space-x-3 shrink-0 cursor-pointer group"
            title="Bấm để xem hồ sơ Tác giả sáng kiến"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/90 bg-white overflow-hidden shadow-md z-10">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-lg z-20 group-hover:scale-105 transition">
              <img src="/avatar.jpg" alt="Cô Trần Thị Kim Thoa" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                TRUNG TÂM QUẢN TRỊ DÀNH CHO GIÁO VIÊN
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                GV: Trần Thị Kim Thoa
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">• Trường THPT Hoàng Diệu, TP. Cần Thơ</span>
            </div>
            <h2 className="text-xl font-black mt-1">Báo cáo & Phân tích lỗi học tập môn SQL</h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Thống kê tình hình làm bài của học sinh, nhận diện 4 nhóm lỗi cú pháp và logic phổ biến để kịp thời củng cố kiến thức trên lớp.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportLogsToCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition shadow-xs cursor-pointer"
            title="Xuất file CSV mở trên Excel có hỗ trợ font tiếng Việt UTF-8"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất file CSV (Excel)</span>
          </button>

          <button
            type="button"
            onClick={exportLogsToJSON}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition cursor-pointer"
            title="Xuất dữ liệu chuẩn JSON"
          >
            <FileCode className="w-4 h-4 text-sky-400" />
            <span>Xuất JSON</span>
          </button>

          <button
            type="button"
            onClick={handleSeedDemo}
            className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-800/60 hover:bg-amber-900/60 rounded-xl transition"
            title="Nạp thêm dữ liệu mẫu lớp học để xem báo cáo trực quan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nạp mẫu lớp</span>
          </button>

          <button
            type="button"
            onClick={handleClearLogs}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 border border-slate-700 rounded-xl transition"
            title="Xóa nhật ký nộp bài"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Học sinh tham gia</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-800">{report.totalStudents}</span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đã thực hiện truy vấn và nộp bài</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng lượt nộp</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-800">{report.totalSubmissions}</span>
            <span className="text-xs text-slate-500">lượt chấm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {report.totalPassed} Đạt • {report.totalFailed} Chưa đạt
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỉ lệ hoàn thành chung</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600">{report.overallPassRate}%</span>
            <span className="text-xs text-emerald-700 font-medium">đạt yêu cầu</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${report.overallPassRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dạng lỗi phát hiện</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-rose-600">{report.commonErrors.length}</span>
            <span className="text-xs text-slate-500">nhóm lỗi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cú pháp, cột, điều kiện lọc, JOIN</p>
        </div>
      </div>

      {/* Section: Common Errors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-800">
              Bảng thống kê lỗi phổ biến học sinh thường mắc
            </h3>
          </div>
          <span className="text-xs text-slate-500">Sắp xếp theo số lượt mắc</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nhóm lỗi</th>
                <th className="py-3 px-4">Tên lỗi & Mô tả</th>
                <th className="py-3 px-4 text-center">Số lượt mắc</th>
                <th className="py-3 px-4">Ví dụ thông báo phản hồi</th>
                <th className="py-3 px-4">Khuyến nghị sư phạm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.commonErrors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Chưa ghi nhận lỗi nào trong nhật ký.
                  </td>
                </tr>
              ) : (
                report.commonErrors.map((err, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        err.category === 'Cú pháp (Syntax)'
                          ? 'bg-rose-100 text-rose-800'
                          : err.category === 'Logic & Điều kiện'
                          ? 'bg-amber-100 text-amber-800'
                          : err.category === 'Cột dữ liệu'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {err.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {err.title}
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono text-sm text-rose-600">
                      {err.count}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={err.sampleMessage}>
                      {err.sampleMessage}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                      {err.category === 'Cú pháp (Syntax)' && 'Nhắc học sinh rà soát chính tả từ khóa SQL và dấu phẩy ngăn cách danh sách cột.'}
                      {err.category === 'Logic & Điều kiện' && 'Ôn tập mệnh đề WHERE, toán tử so sánh số học/văn bản và điều kiện nối bảng ON.'}
                      {err.category === 'Cột dữ liệu' && 'Luyện tập chỉ định rõ tên cột thay vì mặc định dùng SELECT *.'}
                      {err.category === 'Sắp xếp' && 'Lưu ý từ khóa ORDER BY kèm chiều sắp xếp ASC (tăng dần) hoặc DESC (giảm dần).'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-column layout: High Error Tasks & Task Completion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 High Error Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-800">Nhiệm vụ có tỉ lệ sai cao</h3>
            </div>
            <span className="text-[11px] text-slate-500">Cần ưu tiên giảng giải</span>
          </div>

          <div className="space-y-3 flex-1">
            {report.highErrorTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Chưa có bài tập nào có tỉ lệ sai vượt mức.</p>
            ) : (
              report.highErrorTasks.map((t) => (
                <div key={t.taskId} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-800">{t.taskTitle}</span>
                    <span className="text-xs font-bold text-rose-600">
                      {100 - t.passRate}% sai ({t.failedAttempts}/{t.totalAttempts} lượt)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-emerald-500 h-2 transition-all" style={{ width: `${t.passRate}%` }} />
                    <div className="bg-rose-500 h-2 transition-all" style={{ width: `${100 - t.passRate}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>Mức độ: {t.taskLevel.replace('_', ' ')}</span>
                    <span className="text-emerald-700 font-medium">Đạt: {t.passRate}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Completion Progress Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">Tỉ lệ hoàn thành theo nhiệm vụ</h3>
            </div>
            <span className="text-[11px] text-slate-500">{tasks.length} bài tập</span>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {report.taskStats.map((t) => (
              <div key={t.taskId} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs border border-slate-100">
                <div className="max-w-[220px]">
                  <p className="font-semibold text-slate-800 truncate">{t.taskTitle}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{t.taskLevel.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center space-x-3 text-right">
                  <span className="text-[11px] text-slate-500">{t.totalAttempts} lượt</span>
                  <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-sky-600 h-2 rounded-full" style={{ width: `${t.passRate}%` }} />
                  </div>
                  <span className="font-mono font-bold text-xs w-9 text-sky-700">{t.passRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section: Recent Detailed Submission Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Nhật ký nộp bài chi tiết của học sinh ({filteredLogs.length} bản ghi)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Lọc tên học sinh / lớp..."
              className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />

            <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''}`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('passed')}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'passed' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : ''}`}
              >
                Đạt
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('failed')}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'failed' ? 'bg-white text-rose-700 shadow-xs font-semibold' : ''}`}
              >
                Chưa đạt
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[360px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 z-10">
              <tr>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Học sinh</th>
                <th className="py-2.5 px-3">Lớp</th>
                <th className="py-2.5 px-3">Nhiệm vụ</th>
                <th className="py-2.5 px-3 text-center">Kết quả</th>
                <th className="py-2.5 px-3">Câu lệnh SQL đã viết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không có bản ghi nộp bài nào thỏa mãn điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {log.studentName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {log.className}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {log.taskTitle}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {log.passed ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          ĐẠT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800" title={log.errorMessage}>
                          CHƯA ĐẠT
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px] max-w-sm truncate" title={log.query}>
                      {log.query}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
