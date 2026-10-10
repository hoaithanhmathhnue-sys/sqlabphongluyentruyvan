import { StudentProfile, SubmissionLog, TaskItem } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'sqlab_student_profile',
  SUBMISSIONS: 'sqlab_submissions_log',
  ACTIVE_DB: 'sqlab_active_db_id',
  ACTIVE_TASK: 'sqlab_active_task_id'
};

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Nguyễn Văn An',
  className: '11A1',
  savedQueries: {},
  completedTaskIds: [],
  taskScores: {}
};

export function getStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading student profile:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveStudentProfile(profile: Partial<StudentProfile>): StudentProfile {
  const current = getStudentProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
  return updated;
}

export function recordTaskCompletion(taskId: string, points: number, query: string): StudentProfile {
  const profile = getStudentProfile();
  const completedSet = new Set(profile.completedTaskIds);
  completedSet.add(taskId);

  const updatedScores = {
    ...profile.taskScores,
    [taskId]: Math.max(profile.taskScores[taskId] || 0, points)
  };

  const updatedQueries = {
    ...profile.savedQueries,
    [taskId]: query
  };

  return saveStudentProfile({
    completedTaskIds: Array.from(completedSet),
    taskScores: updatedScores,
    savedQueries: updatedQueries
  });
}

export function saveTaskQueryDraft(taskId: string, query: string): void {
  const profile = getStudentProfile();
  saveStudentProfile({
    savedQueries: {
      ...profile.savedQueries,
      [taskId]: query
    }
  });
}

export function getSubmissionLogs(): SubmissionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading submissions:', e);
  }
  return [];
}

export function addSubmissionLog(log: Omit<SubmissionLog, 'id' | 'timestamp'>): SubmissionLog {
  const fullLog: SubmissionLog = {
    ...log,
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now()
  };

  try {
    const logs = getSubmissionLogs();
    logs.unshift(fullLog);
    // Giữ tối đa 500 bản ghi
    const trimmed = logs.slice(0, 500);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving submission log:', e);
  }

  return fullLog;
}

export function clearSubmissionLogs(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  } catch (e) {
    console.error(e);
  }
}

export function getActiveDbId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_DB) || 'thu_vien';
}

export function setActiveDbId(dbId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_DB, dbId);
}

export function getActiveTaskId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK) || null;
}

export function setActiveTaskId(taskId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK, taskId);
}

// Báo cáo tổng hợp dành cho giáo viên
export interface CommonErrorStat {
  type: string;
  category: 'Cú pháp (Syntax)' | 'Logic & Điều kiện' | 'Cột dữ liệu' | 'Sắp xếp';
  title: string;
  count: number;
  sampleMessage: string;
  lastOccurred: number;
}

export interface TaskSummaryStat {
  taskId: string;
  taskTitle: string;
  taskLevel: string;
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  passRate: number;
}

export interface TeacherReportData {
  totalStudents: number;
  totalSubmissions: number;
  totalPassed: number;
  totalFailed: number;
  overallPassRate: number;
  taskStats: TaskSummaryStat[];
  highErrorTasks: TaskSummaryStat[];
  commonErrors: CommonErrorStat[];
  recentLogs: SubmissionLog[];
}

export function generateTeacherReport(allTasks: TaskItem[]): TeacherReportData {
  let logs = getSubmissionLogs();

  // Nếu chưa có nhật ký nào, tạo mẫu dữ liệu lớp học sinh động để giáo viên có thể hình dung ngay
  if (logs.length === 0) {
    seedDemoTeacherLogs(allTasks);
    logs = getSubmissionLogs();
  }

  const studentSet = new Set<string>();
  let totalPassed = 0;
  let totalFailed = 0;

  const taskMap: Record<string, { total: number; passed: number; failed: number }> = {};
  const errorMap: Record<string, { count: number; sample: string; lastTime: number; type: string }> = {};

  logs.forEach((log) => {
    studentSet.add(`${log.studentName} (${log.className})`);
    if (log.passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    if (!taskMap[log.taskId]) {
      taskMap[log.taskId] = { total: 0, passed: 0, failed: 0 };
    }
    taskMap[log.taskId].total++;
    if (log.passed) {
      taskMap[log.taskId].passed++;
    } else {
      taskMap[log.taskId].failed++;
    }

    if (!log.passed && log.errorType) {
      const errKey = log.errorType;
      if (!errorMap[errKey]) {
        errorMap[errKey] = {
          count: 0,
          sample: log.errorMessage || 'Lỗi không xác định',
          lastTime: log.timestamp,
          type: log.errorType
        };
      }
      errorMap[errKey].count++;
      errorMap[errKey].lastTime = Math.max(errorMap[errKey].lastTime, log.timestamp);
    }
  });

  const taskStats: TaskSummaryStat[] = allTasks.map((t) => {
    const stat = taskMap[t.id] || { total: 0, passed: 0, failed: 0 };
    const passRate = stat.total > 0 ? Math.round((stat.passed / stat.total) * 100) : 0;
    return {
      taskId: t.id,
      taskTitle: t.title,
      taskLevel: t.level,
      totalAttempts: stat.total,
      passedAttempts: stat.passed,
      failedAttempts: stat.failed,
      passRate
    };
  });

  // Nhiệm vụ có tỉ lệ sai cao (đã có lượt làm và passRate thấp)
  const highErrorTasks = [...taskStats]
    .filter((t) => t.totalAttempts > 0)
    .sort((a, b) => a.passRate - b.passRate || b.failedAttempts - a.failedAttempts)
    .slice(0, 5);

  const errorCategories: Record<string, { title: string; category: CommonErrorStat['category'] }> = {
    syntax_error: { title: 'Lỗi cú pháp SQL (Syntax error / từ khóa / dấu phẩy)', category: 'Cú pháp (Syntax)' },
    column_mismatch: { title: 'Thiếu/Thừa cột hoặc sai tên cột SELECT', category: 'Cột dữ liệu' },
    row_count_mismatch: { title: 'Sai số dòng kết quả (Lọc WHERE / Ghép JOIN)', category: 'Logic & Điều kiện' },
    data_mismatch: { title: 'Dữ liệu không khớp đáp án chuẩn', category: 'Logic & Điều kiện' },
    order_mismatch: { title: 'Thiếu hoặc sai thứ tự sắp xếp (ORDER BY)', category: 'Sắp xếp' },
    empty_result: { title: 'Kết quả rỗng do điều kiện lọc quá chặt', category: 'Logic & Điều kiện' }
  };

  const commonErrors: CommonErrorStat[] = Object.keys(errorMap).map((errType) => {
    const item = errorMap[errType];
    const cat = errorCategories[errType] || {
      title: 'Lỗi khác',
      category: 'Cú pháp (Syntax)' as const
    };
    return {
      type: errType,
      category: cat.category,
      title: cat.title,
      count: item.count,
      sampleMessage: item.sample,
      lastOccurred: item.lastTime
    };
  }).sort((a, b) => b.count - a.count);

  const totalSubmissions = logs.length;
  const overallPassRate = totalSubmissions > 0 ? Math.round((totalPassed / totalSubmissions) * 100) : 0;

  return {
    totalStudents: studentSet.size,
    totalSubmissions,
    totalPassed,
    totalFailed,
    overallPassRate,
    taskStats,
    highErrorTasks,
    commonErrors,
    recentLogs: logs.slice(0, 50)
  };
}

export function seedDemoTeacherLogs(tasks: TaskItem[]): void {
  const students = [
    { name: 'Nguyễn Văn An', lop: '11A1' },
    { name: 'Trần Thị Mai', lop: '11A1' },
    { name: 'Lê Hoàng Nam', lop: '11A1' },
    { name: 'Phạm Đức Trọng', lop: '11A1' },
    { name: 'Vũ Thảo Vy', lop: '11A2' },
    { name: 'Đỗ Quỳnh Anh', lop: '11A2' },
    { name: 'Bùi Gia Khiêm', lop: '11A2' },
    { name: 'Hoàng Minh Tuấn', lop: '11A3' }
  ];

  const demoLogs: SubmissionLog[] = [];
  const now = Date.now();

  students.forEach((stu, sIdx) => {
    // Mỗi học sinh làm một số bài
    tasks.slice(0, 6).forEach((task, tIdx) => {
      // Giả lập lượt nộp lỗi trước đó
      if (tIdx > 0 && Math.random() > 0.4) {
        demoLogs.push({
          id: `seed_err_${sIdx}_${tIdx}_1`,
          timestamp: now - (sIdx * 3600000 + tIdx * 600000 + 300000),
          studentName: stu.name,
          className: stu.lop,
          dbId: task.dbId,
          taskId: task.id,
          taskTitle: task.title,
          taskLevel: task.level,
          query: 'SELECT * FROM ' + (task.dbId === 'thu_vien' ? 'Sach' : 'HocSinh'),
          passed: false,
          errorType: 'column_mismatch',
          errorMessage: 'Thừa cột dữ liệu: Bạn đang lấy tất cả các cột thay vì các cột yêu cầu.'
        });
      }

      if (task.level === 'van_dung' && Math.random() > 0.5) {
        demoLogs.push({
          id: `seed_err_${sIdx}_${tIdx}_2`,
          timestamp: now - (sIdx * 3600000 + tIdx * 600000 + 150000),
          studentName: stu.name,
          className: stu.lop,
          dbId: task.dbId,
          taskId: task.id,
          taskTitle: task.title,
          taskLevel: task.level,
          query: 'SELECT TenSach, TenTG FROM Sach, TacGia;',
          passed: false,
          errorType: 'row_count_mismatch',
          errorMessage: 'Chưa khớp số dòng: Thiếu điều kiện nối ON dẫn đến lặp tích Đề-các.'
        });
      }

      // Lượt nộp thành công
      demoLogs.push({
        id: `seed_pass_${sIdx}_${tIdx}`,
        timestamp: now - (sIdx * 3600000 + tIdx * 600000),
        studentName: stu.name,
        className: stu.lop,
        dbId: task.dbId,
        taskId: task.id,
        taskTitle: task.title,
        taskLevel: task.level,
        query: task.solutionQuery,
        passed: true
      });
    });
  });

  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(demoLogs));
  } catch (e) {
    console.error(e);
  }
}

export function exportLogsToJSON(): void {
  const logs = getSubmissionLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sqlab_bao_cao_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLogsToCSV(): void {
  const logs = getSubmissionLogs();
  const headers = ['Mã log', 'Thời gian', 'Họ tên', 'Lớp', 'CSDL', 'Mã bài', 'Tên bài', 'Mức độ', 'Kết quả', 'Loại lỗi', 'Chi tiết lỗi', 'Câu lệnh SQL'];

  const rows = logs.map((log) => [
    log.id,
    new Date(log.timestamp).toLocaleString('vi-VN'),
    `"${log.studentName.replace(/"/g, '""')}"`,
    `"${log.className.replace(/"/g, '""')}"`,
    log.dbId,
    log.taskId,
    `"${log.taskTitle.replace(/"/g, '""')}"`,
    log.taskLevel,
    log.passed ? 'ĐẠT' : 'CHƯA ĐẠT',
    `"${(log.errorType || '').replace(/"/g, '""')}"`,
    `"${(log.errorMessage || '').replace(/"/g, '""')}"`,
    `"${log.query.replace(/"/g, '""')}"`
  ]);

  // BOM UTF-8 (\uFEFF) giúp Excel hiển thị tiếng Việt có dấu chuẩn xác mà không bị vỡ font
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sqlab_bao_cao_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
