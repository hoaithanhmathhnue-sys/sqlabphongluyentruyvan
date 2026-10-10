import { EvaluationOutcome, QueryResult, TaskItem } from '../types';
import { executeIsolatedQuery, executeQuery } from './sqliteService';

function normalizeValue(val: any): string {
  if (val === null || val === undefined) return '__NULL__';
  if (typeof val === 'number') {
    // Làm tròn số thập phân để tránh sai số dấu phẩy động
    return Math.abs(val - Math.round(val)) < 1e-6 ? String(Math.round(val)) : String(Number(val.toFixed(4)));
  }
  if (typeof val === 'string') {
    return val.trim().toLowerCase();
  }
  return String(val).trim().toLowerCase();
}

function cleanColumnName(col: string): string {
  // Loại bỏ tên bảng tiền tố nếu có: 'Sach.TenSach' -> 'TenSach'
  const parts = col.split('.');
  const pure = parts[parts.length - 1];
  return pure.trim().toLowerCase();
}

export async function evaluateStudentQuery(
  studentSql: string,
  task: TaskItem
): Promise<EvaluationOutcome> {
  const trimmed = studentSql.trim();
  if (!trimmed) {
    return {
      passed: false,
      message: 'Vui lòng nhập câu lệnh SQL trước khi bấm Nộp bài.',
      detailedHint: 'Bạn có thể bấm nút "Gợi ý" nếu chưa biết cách bắt đầu.',
      errorType: 'syntax_error'
    };
  }

  // 1. Chạy truy vấn học sinh
  let studentResult: QueryResult;
  try {
    studentResult = await executeIsolatedQuery(trimmed, task.dbId);
  } catch (err: any) {
    return {
      passed: false,
      message: 'Truy vấn gặp lỗi cú pháp khi thực thi trên cơ sở dữ liệu.',
      detailedHint: err.message || String(err),
      errorType: 'syntax_error'
    };
  }

  // 2. Chạy truy vấn đáp án mẫu để lấy kết quả chuẩn
  let expectedResult: QueryResult;
  try {
    expectedResult = await executeIsolatedQuery(task.solutionQuery, task.dbId);
  } catch (err: any) {
    console.error('Lỗi khi chạy câu lệnh đáp án:', err);
    return {
      passed: false,
      message: 'Lỗi hệ thống khi đối chiếu đáp án.',
      detailedHint: 'Vui lòng thử lại hoặc liên hệ quản trị viên.'
    };
  }

  // 3. Kiểm tra số cột
  const studentCols = studentResult.columns;
  const expectedCols = expectedResult.columns;

  if (studentCols.length === 0 && expectedCols.length > 0) {
    return {
      passed: false,
      message: 'Truy vấn không trả về cột dữ liệu nào.',
      detailedHint: `Đề bài yêu cầu hiển thị các cột: ${expectedCols.join(', ')}. Hãy bắt đầu bằng SELECT ${expectedCols.join(', ')} ...`,
      errorType: 'column_mismatch',
      studentResult,
      expectedResult
    };
  }

  if (studentCols.length !== expectedCols.length) {
    if (studentCols.length > expectedCols.length) {
      return {
        passed: false,
        message: `Thừa cột dữ liệu: Bạn đang trả về ${studentCols.length} cột, nhưng bài chỉ yêu cầu ${expectedCols.length} cột.`,
        detailedHint: `Cột cần hiển thị là: [${expectedCols.join(', ')}]. Hãy chỉ định rõ các cột này sau SELECT (tránh dùng SELECT * khi bài chỉ hỏi một vài cột).`,
        errorType: 'column_mismatch',
        studentResult,
        expectedResult
      };
    } else {
      return {
        passed: false,
        message: `Thiếu cột dữ liệu: Bạn trả về ${studentCols.length} cột, trong khi đáp án cần ${expectedCols.length} cột.`,
        detailedHint: `Các cột yêu cầu gồm: [${expectedCols.join(', ')}].`,
        errorType: 'column_mismatch',
        studentResult,
        expectedResult
      };
    }
  }

  // 4. Tìm ánh xạ cột giữa học sinh và đáp án
  // Thử khớp theo tên cột chuẩn hóa
  const studentColsClean = studentCols.map(cleanColumnName);
  const expectedColsClean = expectedCols.map(cleanColumnName);

  let columnMapping: number[] = []; // expectedColIdx -> studentColIdx
  let matchedAllByName = true;

  for (let expIdx = 0; expIdx < expectedColsClean.length; expIdx++) {
    const expName = expectedColsClean[expIdx];
    const stuIdx = studentColsClean.findIndex((stName, idx) => stName === expName && !columnMapping.includes(idx));
    if (stuIdx !== -1) {
      columnMapping.push(stuIdx);
    } else {
      matchedAllByName = false;
      break;
    }
  }

  // Nếu không khớp theo tên (ví dụ học sinh không đặt AS alias cho COUNT(*) hoặc tên cột hơi khác),
  // ta thử ánh xạ vị trí 1-1 nếu số cột bằng nhau
  if (!matchedAllByName) {
    columnMapping = expectedCols.map((_, i) => i);
  }

  // 5. Kiểm tra số dòng
  const studentRows = studentResult.values;
  const expectedRows = expectedResult.values;

  if (studentRows.length === 0 && expectedRows.length > 0) {
    return {
      passed: false,
      message: 'Kết quả rỗng: Không có dòng dữ liệu nào được trả về.',
      detailedHint: 'Hãy kiểm tra lại điều kiện lọc WHERE hoặc điều kiện nối bảng ON. Có thể điều kiện của bạn đang bị sai hoặc loại trừ hết dữ liệu.',
      errorType: 'empty_result',
      studentResult,
      expectedResult
    };
  }

  if (studentRows.length !== expectedRows.length) {
    return {
      passed: false,
      message: `Chưa khớp số lượng dòng: Truy vấn của bạn ra ${studentRows.length} dòng, nhưng đáp án chuẩn có ${expectedRows.length} dòng.`,
      detailedHint:
        studentRows.length > expectedRows.length
          ? 'Bạn đang lấy nhiều dòng hơn đáp án. Hãy kiểm tra lại điều kiện lọc WHERE, tránh thiếu điều kiện hoặc sót điều kiện JOIN dẫn đến lặp tích Đề-các.'
          : 'Bạn đang lấy ít dòng hơn đáp án. Hãy xem lại điều kiện lọc WHERE hoặc kiểm tra xem có gõ nhầm giá trị so sánh không.',
      errorType: 'row_count_mismatch',
      studentResult,
      expectedResult
    };
  }

  // 6. Chuẩn hóa dữ liệu các dòng
  // Chuyển mỗi dòng của học sinh về theo thứ tự cột của đáp án
  const reorderedStudentRows: string[][] = studentRows.map((row) => {
    return columnMapping.map((stuColIdx) => normalizeValue(row[stuColIdx]));
  });

  const normalizedExpectedRows: string[][] = expectedRows.map((row) => {
    return row.map(normalizeValue);
  });

  // 7. Kiểm tra so khớp dữ liệu
  if (task.orderSensitive) {
    // So khớp TUẦN TỰ từng dòng theo đúng thứ tự
    let exactOrderMatch = true;
    for (let r = 0; r < expectedRows.length; r++) {
      const expRow = normalizedExpectedRows[r];
      const stuRow = reorderedStudentRows[r];
      const rowMatches = expRow.every((val, colIdx) => val === stuRow[colIdx]);
      if (!rowMatches) {
        exactOrderMatch = false;
        break;
      }
    }

    if (exactOrderMatch) {
      return {
        passed: true,
        message: `Xuất sắc! Truy vấn của bạn thực thi chính xác và sắp xếp đúng theo yêu cầu (+${task.points} điểm).`,
        detailedHint: task.detailedExplanation || 'Chúc mừng bạn đã hoàn thành bài tập này!',
        studentResult,
        expectedResult
      };
    } else {
      // Kiểm tra xem có đúng tập hợp nhưng sai thứ tự không
      const studentRowStrings = reorderedStudentRows.map((r) => r.join('|||')).sort();
      const expectedRowStrings = normalizedExpectedRows.map((r) => r.join('|||')).sort();
      const contentMatches = studentRowStrings.every((str, i) => str === expectedRowStrings[i]);

      if (contentMatches) {
        return {
          passed: false,
          message: 'Dữ liệu kết quả đã đúng nhưng thứ tự các dòng chưa chính xác.',
          detailedHint: 'Đề bài yêu cầu sắp xếp thứ tự cụ thể. Hãy thêm mệnh đề ORDER BY ... (ASC hoặc DESC) vào cuối câu truy vấn.',
          errorType: 'order_mismatch',
          studentResult,
          expectedResult
        };
      } else {
        return {
          passed: false,
          message: 'Dữ liệu trong bảng kết quả chưa khớp với đáp án mẫu.',
          detailedHint: 'Hãy kiểm tra lại giá trị so sánh trong WHERE hoặc các phép tính toán/nối bảng.',
          errorType: 'data_mismatch',
          studentResult,
          expectedResult
        };
      }
    }
  } else {
    // Bỏ qua thứ tự dòng: So khớp ĐA TẬP HỢP (Multiset equality)
    const studentRowStrings = reorderedStudentRows.map((r) => r.join('|||')).sort();
    const expectedRowStrings = normalizedExpectedRows.map((r) => r.join('|||')).sort();

    const multisetMatches =
      studentRowStrings.length === expectedRowStrings.length &&
      studentRowStrings.every((str, i) => str === expectedRowStrings[i]);

    if (multisetMatches) {
      return {
        passed: true,
        message: `Chính xác! Bảng dữ liệu của bạn trả về hoàn toàn khớp với đáp án chuẩn (+${task.points} điểm).`,
        detailedHint: task.detailedExplanation || 'Bạn đã vận dụng rất tốt cú pháp truy vấn SQL!',
        studentResult,
        expectedResult
      };
    } else {
      return {
        passed: false,
        message: 'Dữ liệu trong các dòng kết quả chưa khớp với yêu cầu của bài.',
        detailedHint: 'Hãy kiểm tra lại phép chiếu cột, biểu thức lọc điều kiện WHERE hoặc điều kiện nối bảng ON.',
        errorType: 'data_mismatch',
        studentResult,
        expectedResult
      };
    }
  }
}
