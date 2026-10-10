export type TaskLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export interface ColumnDef {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'DATE';
  isPrimary?: boolean;
  isForeign?: boolean;
  refTable?: string;
  refColumn?: string;
  description?: string;
}

export interface TableDef {
  name: string;
  description: string;
  columns: ColumnDef[];
  sampleCount?: number;
}

export interface RelationshipDef {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: '1-n' | '1-1' | 'n-n' | 'n-1';
  label: string;
}

export interface DatabaseMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  schemaSql: string;
  seedSql: string;
  tables: TableDef[];
  relationships: RelationshipDef[];
}

export interface QueryResult {
  columns: string[];
  values: any[][];
  executionTimeMs?: number;
  error?: string;
}

export interface TaskExpected {
  columns: string[];
  rows: any[][];
}

export interface TaskItem {
  id: string;
  dbId: string;
  title: string;
  level: TaskLevel;
  prompt: string;
  solutionQuery: string;
  expected?: TaskExpected;
  orderSensitive: boolean;
  hint: string;
  detailedExplanation?: string;
  points: number;
  initialQuery?: string;
}

export interface EvaluationOutcome {
  passed: boolean;
  message: string;
  detailedHint?: string;
  studentResult?: QueryResult;
  expectedResult?: QueryResult;
  errorType?: 'syntax_error' | 'column_mismatch' | 'row_count_mismatch' | 'data_mismatch' | 'order_mismatch' | 'empty_result';
}

export interface SubmissionLog {
  id: string;
  timestamp: number;
  studentName: string;
  className: string;
  dbId: string;
  taskId: string;
  taskTitle: string;
  taskLevel: TaskLevel;
  query: string;
  passed: boolean;
  errorType?: string;
  errorMessage?: string;
}

export interface StudentProfile {
  name: string;
  className: string;
  savedQueries: Record<string, string>; // taskId -> last written query
  completedTaskIds: string[];
  taskScores: Record<string, number>;
}

export interface JoinStep {
  stepNumber: number;
  title: string;
  description: string;
  operation: string;
  columns: string[];
  rows: any[][];
  highlightedRowIndices?: number[];
  note?: string;
}

export interface JoinDemo {
  id: string;
  title: string;
  description: string;
  query: string;
  tablesInvolved: string[];
  steps: JoinStep[];
}
