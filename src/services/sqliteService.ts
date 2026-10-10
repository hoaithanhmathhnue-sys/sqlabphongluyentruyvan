import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { DATABASES } from '../data/databases';
import { QueryResult } from '../types';

let SQLModule: SqlJsStatic | null = null;
let currentDb: Database | null = null;
let currentDbId: string | null = null;
let isInitializing = false;
let initPromise: Promise<SqlJsStatic> | null = null;

// Cung cấp bản dịch lỗi SQLite sang tiếng Việt thân thiện với học sinh
export function translateSqlError(rawError: string): string {
  const err = rawError.trim();

  if (err.includes('syntax error')) {
    const match = err.match(/near "([^"]+)": syntax error/i) || err.match(/near '(.*?)': syntax error/i);
    if (match) {
      return `Lỗi cú pháp SQL gần vị trí "${match[1]}". Hãy kiểm tra xem bạn có gõ sai chính tả từ khóa (SELECT, FROM, WHERE, JOIN...) hoặc thiếu/thừa dấu phẩy giữa các cột không.`;
    }
    return 'Lỗi cú pháp câu lệnh SQL. Hãy kiểm tra các từ khóa chính, dấu phẩy ngăn cách cột và dấu ngoặc đơn.';
  }

  if (err.includes('no such table')) {
    const match = err.match(/no such table:\s*([^\s]+)/i);
    const tableName = match ? match[1] : '';
    return `Bảng "${tableName}" không tồn tại trong cơ sở dữ liệu hiện tại. Hãy bấm xem tab "Sơ đồ quan hệ (ER)" để xem chính xác tên các bảng.`;
  }

  if (err.includes('no such column')) {
    const match = err.match(/no such column:\s*([^\s]+)/i);
    const colName = match ? match[1] : '';
    return `Cột "${colName}" không tồn tại. Vui lòng kiểm tra lại tên cột trong danh sách thuộc tính bảng (phân biệt đúng MaSach, TenSach...).`;
  }

  if (err.includes('ambiguous column name')) {
    const match = err.match(/ambiguous column name:\s*([^\s]+)/i);
    const colName = match ? match[1] : '';
    return `Tên cột "${colName}" bị trùng lặp giữa các bảng trong phép JOIN. Bạn cần ghi rõ tiền tố tên bảng (ví dụ: Sach.${colName} hoặc TacGia.${colName}).`;
  }

  if (err.includes('misuse of aggregate')) {
    return 'Dùng sai hàm gộp (COUNT, SUM, AVG...). Lưu ý: Không dùng hàm gộp trực tiếp trong mệnh đề WHERE; hãy dùng HAVING sau GROUP BY.';
  }

  if (err.includes('incomplete input')) {
    return 'Câu lệnh SQL chưa hoàn thành. Hãy kiểm tra xem bạn đã đóng đủ dấu nháy đơn, ngoặc kép hoặc dấu chấm phẩy (;) chưa.';
  }

  if (err.includes('UNIQUE constraint failed')) {
    return 'Vi phạm ràng buộc duy nhất (khóa chính). Dữ liệu này đã tồn tại trong bảng.';
  }

  if (err.includes('FOREIGN KEY constraint failed')) {
    return 'Vi phạm ràng buộc khóa ngoại (FOREIGN KEY). Giá trị liên kết không tồn tại ở bảng tham chiếu.';
  }

  return `Lỗi SQLite: ${err}`;
}

export async function getSqlModule(): Promise<SqlJsStatic> {
  if (SQLModule) return SQLModule;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Thử tải qua CDN cdnjs
      return await initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
      });
    } catch (cdnErr) {
      console.warn('cdnjs failed, trying jsdelivr fallback...', cdnErr);
      // Fallback sang jsdelivr
      return await initSqlJs({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/${file}`
      });
    }
  })();

  SQLModule = await initPromise;
  return SQLModule;
}

export async function loadDatabase(dbId: string): Promise<Database> {
  const SQL = await getSqlModule();
  const dbMeta = DATABASES.find((d) => d.id === dbId) || DATABASES[0];

  if (currentDb && currentDbId === dbId) {
    return currentDb;
  }

  if (currentDb) {
    try {
      currentDb.close();
    } catch (e) {
      console.error(e);
    }
  }

  const db = new SQL.Database();
  // Thực thi DDL và dữ liệu mẫu
  db.run(dbMeta.schemaSql);
  db.run(dbMeta.seedSql);

  currentDb = db;
  currentDbId = dbId;
  return db;
}

export async function resetDatabase(dbId: string): Promise<Database> {
  const SQL = await getSqlModule();
  const dbMeta = DATABASES.find((d) => d.id === dbId) || DATABASES[0];

  if (currentDb) {
    try {
      currentDb.close();
    } catch (e) {
      console.error(e);
    }
  }

  const db = new SQL.Database();
  db.run(dbMeta.schemaSql);
  db.run(dbMeta.seedSql);

  currentDb = db;
  currentDbId = dbId;
  return db;
}

export async function executeQuery(sql: string, dbId?: string): Promise<QueryResult> {
  const targetDbId = dbId || currentDbId || DATABASES[0].id;
  const db = await loadDatabase(targetDbId);

  const trimmed = sql.trim();
  if (!trimmed) {
    return { columns: [], values: [], executionTimeMs: 0 };
  }

  const startTime = performance.now();
  try {
    const results = db.exec(trimmed);
    const endTime = performance.now();
    const duration = Math.round((endTime - startTime) * 10) / 10;

    if (!results || results.length === 0) {
      return {
        columns: [],
        values: [],
        executionTimeMs: duration
      };
    }

    // Lấy tập kết quả của câu lệnh SELECT cuối cùng
    const lastResult = results[results.length - 1];
    return {
      columns: lastResult.columns,
      values: lastResult.values,
      executionTimeMs: duration
    };
  } catch (error: any) {
    const rawMsg = error?.message || String(error);
    const friendlyMsg = translateSqlError(rawMsg);
    throw new Error(friendlyMsg);
  }
}

export async function executeIsolatedQuery(sql: string, dbId: string): Promise<QueryResult> {
  const SQL = await getSqlModule();
  const dbMeta = DATABASES.find((d) => d.id === dbId) || DATABASES[0];
  const tempDb = new SQL.Database();

  try {
    tempDb.run(dbMeta.schemaSql);
    tempDb.run(dbMeta.seedSql);

    const startTime = performance.now();
    const results = tempDb.exec(sql.trim());
    const endTime = performance.now();
    const duration = Math.round((endTime - startTime) * 10) / 10;

    if (!results || results.length === 0) {
      return { columns: [], values: [], executionTimeMs: duration };
    }
    const lastResult = results[results.length - 1];
    return {
      columns: lastResult.columns,
      values: lastResult.values,
      executionTimeMs: duration
    };
  } finally {
    tempDb.close();
  }
}

export async function getTableData(tableName: string, dbId: string): Promise<QueryResult> {
  return await executeQuery(`SELECT * FROM ${tableName} LIMIT 50;`, dbId);
}
