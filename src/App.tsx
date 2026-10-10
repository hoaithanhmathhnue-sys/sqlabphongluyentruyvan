import React, { useState, useEffect, useMemo } from 'react';
import { DATABASES } from './data/databases';
import { TASKS } from './data/tasks';
import { TaskItem, EvaluationOutcome, QueryResult, StudentProfile } from './types';
import { Navbar } from './components/Navbar';
import { TaskList } from './components/TaskList';
import { SqlEditor } from './components/SqlEditor';
import { TableView } from './components/TableView';
import { EvaluationResult } from './components/EvaluationResult';
import { ERDiagram } from './components/ERDiagram';
import { JoinSimulator } from './components/JoinSimulator';
import { TeacherReportView } from './components/TeacherReportView';
import { StudentModal } from './components/StudentModal';
import { DatabaseSelectorModal } from './components/DatabaseSelectorModal';
import { AuthorModal } from './components/AuthorModal';
import {
  getStudentProfile,
  saveStudentProfile,
  recordTaskCompletion,
  saveTaskQueryDraft,
  addSubmissionLog,
  getActiveDbId,
  setActiveDbId as persistActiveDbId
} from './services/storageService';
import { executeQuery, resetDatabase, loadDatabase, getTableData } from './services/sqliteService';
import { evaluateStudentQuery } from './services/evaluator';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Table as TableIcon,
  Database,
  ArrowRight,
  ExternalLink,
  Info,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Navigation & DB State
  const [activeTab, setActiveTab] = useState<'workspace' | 'er' | 'join' | 'report'>('workspace');
  const [activeDbId, setActiveDbId] = useState<string>(() => getActiveDbId());
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isResettingDb, setIsResettingDb] = useState(false);

  // Student Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(getStudentProfile);

  // Active Database Metadata
  const activeDatabase = useMemo(() => {
    return DATABASES.find((db) => db.id === activeDbId) || DATABASES[0];
  }, [activeDbId]);

  // Tasks of current DB
  const dbTasks = useMemo(() => {
    return TASKS.filter((t) => t.dbId === activeDbId);
  }, [activeDbId]);

  // Active Task State
  const [activeTaskId, setActiveTaskId] = useState<string>(() => {
    const tasks = TASKS.filter((t) => t.dbId === getActiveDbId());
    return tasks.length > 0 ? tasks[0].id : TASKS[0].id;
  });

  const currentTask = useMemo(() => {
    return dbTasks.find((t) => t.id === activeTaskId) || dbTasks[0] || TASKS[0];
  }, [dbTasks, activeTaskId]);

  // Editor and Execution State
  const [editorQuery, setEditorQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationOutcome, setEvaluationOutcome] = useState<EvaluationOutcome | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Bottom Workspace Tabs
  const [bottomTab, setBottomTab] = useState<'result' | 'evaluation' | 'schema' | 'hint'>('result');
  const [inspectTable, setInspectTable] = useState<string>('');
  const [inspectData, setInspectData] = useState<QueryResult | null>(null);

  // Khởi tạo SQLite WASM khi nạp trang
  useEffect(() => {
    loadDatabase(activeDbId).catch((err) => console.error('SQLite init error:', err));
  }, [activeDbId]);

  // Khi đổi bài tập, cập nhật truy vấn từ bộ nhớ tạm hoặc giá trị khởi tạo
  useEffect(() => {
    if (!currentTask) return;
    const savedDraft = studentProfile.savedQueries[currentTask.id];
    setEditorQuery(savedDraft !== undefined ? savedDraft : currentTask.initialQuery || 'SELECT * FROM ' + activeDatabase.tables[0].name + ';');
    setQueryResult(null);
    setQueryError(null);
    setEvaluationOutcome(null);
    setShowHint(false);
    setBottomTab('result');
    if (activeDatabase.tables.length > 0) {
      setInspectTable(activeDatabase.tables[0].name);
    }
  }, [currentTask.id, activeDbId]);

  // Khi đổi inspect table
  useEffect(() => {
    if (inspectTable && bottomTab === 'schema') {
      getTableData(inspectTable, activeDbId)
        .then(setInspectData)
        .catch(console.error);
    }
  }, [inspectTable, bottomTab, activeDbId]);

  const handleQueryChange = (val: string) => {
    setEditorQuery(val);
    saveTaskQueryDraft(currentTask.id, val);
  };

  const handleSelectDatabase = (dbId: string) => {
    setActiveDbId(dbId);
    persistActiveDbId(dbId);
    const newTasks = TASKS.filter((t) => t.dbId === dbId);
    if (newTasks.length > 0) {
      setActiveTaskId(newTasks[0].id);
    }
  };

  const handleSelectTask = (task: TaskItem) => {
    setActiveTaskId(task.id);
  };

  // Chạy thử truy vấn SQL
  const handleRunQuery = async () => {
    if (!editorQuery.trim()) return;
    setIsRunning(true);
    setQueryError(null);

    try {
      const res = await executeQuery(editorQuery, activeDbId);
      setQueryResult(res);
      setBottomTab('result');
    } catch (err: any) {
      setQueryError(err.message || 'Lỗi cú pháp không xác định');
      setQueryResult(null);
      setBottomTab('result');
    } finally {
      setIsRunning(false);
    }
  };

  // Nộp bài để chấm tự động
  const handleSubmitQuery = async () => {
    if (!editorQuery.trim()) return;
    setIsEvaluating(true);
    setQueryError(null);

    try {
      const outcome = await evaluateStudentQuery(editorQuery, currentTask);
      setEvaluationOutcome(outcome);
      setBottomTab('evaluation');

      // Ghi nhận điểm và lưu trạng thái hoàn thành nếu đạt
      if (outcome.passed) {
        const updated = recordTaskCompletion(currentTask.id, currentTask.points, editorQuery);
        setStudentProfile(updated);
      }

      // Lưu nhật ký nộp bài cho báo cáo giáo viên
      addSubmissionLog({
        studentName: studentProfile.name,
        className: studentProfile.className,
        dbId: activeDbId,
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        taskLevel: currentTask.level,
        query: editorQuery,
        passed: outcome.passed,
        errorType: outcome.errorType,
        errorMessage: outcome.message + (outcome.detailedHint ? ` (${outcome.detailedHint})` : '')
      });
    } catch (err: any) {
      setQueryError(err.message || 'Lỗi trong quá trình chấm');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Đặt lại CSDL gốc
  const handleResetDb = async () => {
    if (window.confirm(`Bạn có chắc muốn khôi phục lại dữ liệu gốc của cơ sở dữ liệu "${activeDatabase.name}" không?`)) {
      setIsResettingDb(true);
      try {
        await resetDatabase(activeDbId);
        if (editorQuery.trim()) {
          const res = await executeQuery(editorQuery, activeDbId);
          setQueryResult(res);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsResettingDb(false);
      }
    }
  };

  const handleResetTaskQuery = () => {
    if (currentTask.initialQuery) {
      setEditorQuery(currentTask.initialQuery);
    }
  };

  const handleSaveStudent = (name: string, className: string) => {
    const updated = saveStudentProfile({ name, className });
    setStudentProfile(updated);
  };

  const totalScore = useMemo(() => {
    return Object.values(studentProfile.taskScores).reduce((a, b) => a + b, 0);
  }, [studentProfile.taskScores]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeDatabase={activeDatabase}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        studentProfile={studentProfile}
        totalScore={totalScore}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onResetDb={handleResetDb}
        isResetting={isResettingDb}
        onOpenAuthorModal={() => setIsAuthorModalOpen(true)}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        {/* ================= TAB 1: WORKSPACE ================= */}
        {activeTab === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* Cột trái: Danh sách bài tập (4 cols) */}
            <div className="lg:col-span-4 h-[600px] lg:h-auto">
              <TaskList
                tasks={dbTasks}
                activeTaskId={currentTask.id}
                onSelectTask={handleSelectTask}
                completedTaskIds={studentProfile.completedTaskIds}
                totalScore={totalScore}
              />
            </div>

            {/* Cột phải: Đề bài, Soạn thảo SQL, Kết quả (8 cols) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Task Prompt Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                      Mã bài: {currentTask.id}
                    </span>
                    <h2 className="text-base font-bold text-slate-800">
                      {currentTask.title}
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> +{currentTask.points} điểm
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium mt-1">
                  {currentTask.prompt}
                </p>

                {currentTask.orderSensitive && (
                  <div className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Lưu ý: Bài này bắt buộc sắp xếp đúng thứ tự (sử dụng mệnh đề ORDER BY).</span>
                  </div>
                )}
              </div>

              {/* SQL Editor */}
              <SqlEditor
                value={editorQuery}
                onChange={handleQueryChange}
                onRun={handleRunQuery}
                onSubmit={handleSubmitQuery}
                onShowHint={() => {
                  setShowHint(true);
                  setBottomTab('hint');
                }}
                onResetTaskQuery={handleResetTaskQuery}
                isEvaluating={isEvaluating}
                isRunning={isRunning}
                hintAvailable={!!currentTask.hint}
              />

              {/* Error Box if syntax error occurred during execution */}
              {queryError && (
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/90 text-rose-900 text-xs flex items-start space-x-2.5 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Lỗi thực thi SQL:</span>
                    <p className="mt-0.5 leading-relaxed">{queryError}</p>
                  </div>
                </div>
              )}

              {/* Bottom Tabs: Result / Evaluation / Schema / Hint */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col flex-1">
                {/* Tabs bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 gap-2">
                  <div className="flex items-center space-x-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setBottomTab('result')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                        bottomTab === 'result'
                          ? 'bg-white text-sky-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Kết quả truy vấn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBottomTab('evaluation')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                        bottomTab === 'evaluation'
                          ? 'bg-white text-sky-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Kết quả chấm tự động</span>
                      {evaluationOutcome && (
                        <span className={`w-2 h-2 rounded-full ${evaluationOutcome.passed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBottomTab('schema')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                        bottomTab === 'schema'
                          ? 'bg-white text-sky-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Xem dữ liệu nguồn</span>
                    </button>

                    {currentTask.hint && (
                      <button
                        type="button"
                        onClick={() => setBottomTab('hint')}
                        className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                          bottomTab === 'hint'
                            ? 'bg-white text-amber-700 shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Gợi ý</span>
                      </button>
                    )}
                  </div>

                  {bottomTab === 'schema' && (
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="text-slate-500">Bảng:</span>
                      <select
                        value={inspectTable}
                        onChange={(e) => setInspectTable(e.target.value)}
                        className="bg-white border border-slate-300 rounded-md px-2 py-0.5 font-mono text-xs text-slate-700"
                      >
                        {activeDatabase.tables.map((t) => (
                          <option key={t.name} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Tab Content */}
                <div className="p-4 flex-1">
                  {bottomTab === 'result' && (
                    <TableView
                      data={queryResult}
                      title="Kết quả câu truy vấn của bạn"
                      maxHeight="max-h-[300px]"
                      emptyMessage="Chưa có kết quả. Viết truy vấn và bấm 'Chạy thử' (Ctrl+Enter) để thực thi trên SQLite WebAssembly."
                    />
                  )}

                  {bottomTab === 'evaluation' && (
                    <div>
                      {evaluationOutcome ? (
                        <EvaluationResult
                          outcome={evaluationOutcome}
                          task={currentTask}
                          onTryAgain={() => setBottomTab('result')}
                        />
                      ) : (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          Chưa có kết quả chấm. Bấm nút <span className="font-bold text-sky-600">"Nộp bài"</span> để hệ thống kiểm tra và chấm tự động.
                        </div>
                      )}
                    </div>
                  )}

                  {bottomTab === 'schema' && (
                    <div>
                      <div className="mb-2 text-xs text-slate-500 flex items-center justify-between">
                        <span>
                          Dữ liệu gốc hiện có trong bảng <span className="font-mono font-bold text-slate-800">{inspectTable}</span>:
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {inspectData?.values.length || 0} dòng
                        </span>
                      </div>
                      <TableView data={inspectData} maxHeight="max-h-[260px]" />
                    </div>
                  )}

                  {bottomTab === 'hint' && (
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
                      <div className="flex items-center space-x-2 font-bold text-sm text-amber-900">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Gợi ý hướng giải quyết:</span>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {currentTask.hint}
                      </p>
                      {currentTask.detailedExplanation && (
                        <div className="pt-2 border-t border-amber-200/60 text-xs text-amber-800">
                          <span className="font-semibold block mb-0.5">Kiến thức bổ trợ:</span>
                          <p>{currentTask.detailedExplanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ER DIAGRAM ================= */}
        {activeTab === 'er' && (
          <div className="flex-1 flex flex-col h-[750px]">
            <ERDiagram database={activeDatabase} />
          </div>
        )}

        {/* ================= TAB 3: JOIN SIMULATION ================= */}
        {activeTab === 'join' && (
          <div className="flex-1 flex flex-col">
            <JoinSimulator />
          </div>
        )}

        {/* ================= TAB 4: TEACHER REPORT ================= */}
        {activeTab === 'report' && (
          <div className="flex-1 flex flex-col">
            <TeacherReportView 
              tasks={TASKS} 
              onOpenAuthorModal={() => setIsAuthorModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer with Author and School Info */}
      <footer className="mt-auto border-t border-slate-200 bg-white/90 backdrop-blur-xs py-4 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="flex items-center -space-x-2 shrink-0">
              <img 
                src="/logo.jpg" 
                alt="Logo Hoàng Diệu" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <img 
                src="/avatar.jpg" 
                alt="Avatar Cô Thoa" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="font-bold text-slate-800">
                Sáng kiến dạy học: SQLAB – Phòng luyện truy vấn cơ sở dữ liệu quan hệ (Tin học 11, 12 THPT)
              </p>
              <p className="text-[11px] text-slate-500">
                Tác giả: <strong className="text-slate-700">Trần Thị Kim Thoa</strong> • Trường THPT Hoàng Diệu, TP. Cần Thơ (Số 1 Mạc Đỉnh Chi, phường Phú Lợi, TP. Cần Thơ)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAuthorModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Thông tin Tác giả</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DatabaseSelectorModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        activeDbId={activeDbId}
        onSelectDb={handleSelectDatabase}
      />

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        profile={studentProfile}
        onSave={handleSaveStudent}
      />

      <AuthorModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
      />
    </div>
  );
}
