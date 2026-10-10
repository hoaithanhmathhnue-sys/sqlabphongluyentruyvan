import React, { useState, useRef, useEffect } from 'react';
import { DatabaseMetadata, TableDef, RelationshipDef } from '../types';
import { Key, Link2, Move, RotateCcw, ZoomIn, ZoomOut, Eye, Database, Info, X } from 'lucide-react';
import { getTableData } from '../services/sqliteService';
import { TableView } from './TableView';
import { QueryResult } from '../types';

interface ERDiagramProps {
  database: DatabaseMetadata;
}

interface TablePosition {
  x: number;
  y: number;
}

export const ERDiagram: React.FC<ERDiagramProps> = ({ database }) => {
  // Vị trí mặc định bố cục trực quan cho các bảng của từng CSDL
  const getDefaultPositions = (): Record<string, TablePosition> => {
    if (database.id === 'thu_vien') {
      return {
        TacGia: { x: 50, y: 50 },
        Sach: { x: 380, y: 50 },
        DocGia: { x: 50, y: 340 },
        Muon: { x: 380, y: 340 }
      };
    }
    if (database.id === 'quan_ly_diem') {
      return {
        LopHoc: { x: 50, y: 60 },
        HocSinh: { x: 380, y: 60 },
        MonHoc: { x: 50, y: 350 },
        DiemThi: { x: 380, y: 350 }
      };
    }
    // ban_hang
    return {
      KhachHang: { x: 50, y: 60 },
      DonHang: { x: 380, y: 60 },
      ChiTietDonHang: { x: 380, y: 360 },
      SanPham: { x: 50, y: 360 }
    };
  };

  const [positions, setPositions] = useState<Record<string, TablePosition>>(getDefaultPositions);
  const [scale, setScale] = useState(1);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [previewTable, setPreviewTable] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<QueryResult | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Kéo thả state
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Cập nhật khi đổi CSDL
  useEffect(() => {
    setPositions(getDefaultPositions());
    setSelectedRelation(null);
    setSelectedTable(null);
  }, [database.id]);

  const handleMouseDown = (tableName: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Chỉ chuột trái
    const pos = positions[tableName] || { x: 0, y: 0 };
    setDraggingTable(tableName);
    setDragOffset({
      x: e.clientX - pos.x * scale,
      y: e.clientY - pos.y * scale
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable) return;
    const newX = Math.max(20, Math.round((e.clientX - dragOffset.x) / scale));
    const newY = Math.max(20, Math.round((e.clientY - dragOffset.y) / scale));

    setPositions((prev) => ({
      ...prev,
      [draggingTable]: { x: newX, y: newY }
    }));
  };

  const handleMouseUp = () => {
    setDraggingTable(null);
  };

  const handleResetLayout = () => {
    setPositions(getDefaultPositions());
    setScale(1);
    setSelectedRelation(null);
    setSelectedTable(null);
  };

  const handleOpenPreview = async (tableName: string) => {
    setPreviewTable(tableName);
    setIsLoadingPreview(true);
    try {
      const data = await getTableData(tableName, database.id);
      setPreviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Chiều rộng và chiều cao ước lượng của mỗi card bảng
  const CARD_WIDTH = 270;
  const HEADER_HEIGHT = 44;
  const ROW_HEIGHT = 28;

  const getCardHeight = (table: TableDef) => {
    return HEADER_HEIGHT + table.columns.length * ROW_HEIGHT + 36;
  };

  // Tính toán tọa độ liên kết giữa 2 bảng
  const getRelationCoordinates = (rel: RelationshipDef) => {
    const fromPos = positions[rel.fromTable] || { x: 0, y: 0 };
    const toPos = positions[rel.toTable] || { x: 0, y: 0 };

    const fromTableDef = database.tables.find((t) => t.name === rel.fromTable);
    const toTableDef = database.tables.find((t) => t.name === rel.toTable);

    const fromColIdx = fromTableDef?.columns.findIndex((c) => c.name === rel.fromColumn) ?? 0;
    const toColIdx = toTableDef?.columns.findIndex((c) => c.name === rel.toColumn) ?? 0;

    const fromY = fromPos.y + HEADER_HEIGHT + fromColIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
    const toY = toPos.y + HEADER_HEIGHT + toColIdx * ROW_HEIGHT + ROW_HEIGHT / 2;

    // Xác định xem nối từ bên trái hay bên phải
    let fromX: number;
    let toX: number;

    if (fromPos.x < toPos.x) {
      fromX = fromPos.x + CARD_WIDTH;
      toX = toPos.x;
    } else {
      fromX = fromPos.x;
      toX = toPos.x + CARD_WIDTH;
    }

    return { fromX, fromY, toX, toY };
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative select-none">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 z-10 gap-2 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-sm">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Sơ đồ thực thể – quan hệ (ERD): {database.name}</span>
          </div>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-sky-500" /> Kéo thả thẻ bảng để sắp xếp vị trí • Bấm vào đường nối để làm nổi bật
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}
            className="p-1.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium text-slate-600 px-1">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(1.4, s + 0.1))}
            className="p-1.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetLayout}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            title="Khôi phục lại vị trí chuẩn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 relative overflow-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] min-h-[500px]"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            width: '1200px',
            height: '800px',
            position: 'relative'
          }}
        >
          {/* SVG Layer for Relationship Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#0284c7" />
              </marker>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>

            {database.relationships.map((rel) => {
              const { fromX, fromY, toX, toY } = getRelationCoordinates(rel);
              const isSelected = selectedRelation === rel.id;
              const isConnectedToTable =
                selectedTable === rel.fromTable || selectedTable === rel.toTable;
              const active = isSelected || isConnectedToTable;

              // Đường cong Bézier mềm mại
              const dx = Math.abs(toX - fromX) * 0.5;
              const pathData = `M ${fromX} ${fromY} C ${fromX + (fromX < toX ? dx : -dx)} ${fromY}, ${toX + (fromX < toX ? -dx : dx)} ${toY}, ${toX} ${toY}`;

              const midX = (fromX + toX) / 2;
              const midY = (fromY + toY) / 2;

              return (
                <g key={rel.id} className="cursor-pointer pointer-events-auto" onClick={() => setSelectedRelation(rel.id)}>
                  {/* Đường tương tác rộng hơn để dễ bấm */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                  />
                  {/* Đường vẽ thực tế */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={active ? '#0284c7' : '#94a3b8'}
                    strokeWidth={active ? '3' : '2'}
                    strokeDasharray={active ? 'none' : '4 3'}
                    markerEnd={active ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    className="transition-colors duration-200"
                  />
                  {/* Label badge ở giữa đường nối */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-55"
                      y="-11"
                      width="110"
                      height="22"
                      rx="11"
                      fill={active ? '#0284c7' : '#ffffff'}
                      stroke={active ? '#0369a1' : '#cbd5e1'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={active ? '#ffffff' : '#475569'}
                    >
                      {rel.fromColumn} → {rel.toColumn}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Table Cards */}
          {database.tables.map((table) => {
            const pos = positions[table.name] || { x: 50, y: 50 };
            const isTableSelected = selectedTable === table.name;
            const isRelatedToSelected =
              selectedRelation &&
              database.relationships.some(
                (r) =>
                  r.id === selectedRelation &&
                  (r.fromTable === table.name || r.toTable === table.name)
              );

            return (
              <div
                key={table.name}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${CARD_WIDTH}px`,
                  position: 'absolute'
                }}
                className={`rounded-xl border bg-white shadow-md transition-shadow z-10 ${
                  isTableSelected || isRelatedToSelected
                    ? 'border-sky-500 ring-2 ring-sky-200 shadow-xl'
                    : 'border-slate-300 hover:shadow-lg'
                }`}
                onClick={() => setSelectedTable(table.name)}
              >
                {/* Table Header with drag handle */}
                <div
                  onMouseDown={(e) => handleMouseDown(table.name, e)}
                  className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-xl cursor-grab active:cursor-grabbing border-b border-slate-700"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-xs tracking-wide">
                    <Move className="w-3.5 h-3.5 text-slate-400" />
                    <span>{table.name}</span>
                  </div>
                  <span className="text-[10px] bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                    {table.columns.length} cột
                  </span>
                </div>

                {/* Columns List */}
                <div className="p-2 space-y-1">
                  {table.columns.map((col) => {
                    return (
                      <div
                        key={col.name}
                        className={`flex items-center justify-between px-2 py-1 rounded text-xs transition ${
                          col.isPrimary
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : col.isForeign
                            ? 'bg-sky-50 text-sky-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                        title={col.description}
                      >
                        <div className="flex items-center space-x-1.5 overflow-hidden">
                          {col.isPrimary ? (
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] bg-amber-200 text-amber-800 font-bold rounded">
                              <Key className="w-2.5 h-2.5" /> PK
                            </span>
                          ) : col.isForeign ? (
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] bg-sky-200 text-sky-800 font-bold rounded">
                              <Link2 className="w-2.5 h-2.5" /> FK
                            </span>
                          ) : (
                            <span className="w-6" />
                          )}
                          <span className="font-mono truncate">{col.name}</span>
                        </div>

                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {col.type}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer action */}
                <div className="px-2.5 py-1.5 border-t border-slate-100 bg-slate-50/70 rounded-b-xl flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 italic truncate max-w-[170px]" title={table.description}>
                    {table.description}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview(table.name);
                    }}
                    className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition"
                    title="Xem dữ liệu mẫu của bảng này"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Preview Modal */}
      {previewTable && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  Dữ liệu mẫu: Bảng <span className="text-sky-600 font-mono">{previewTable}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTable(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1">
              {isLoadingPreview ? (
                <div className="py-12 text-center text-slate-500 text-xs">Đang tải dữ liệu...</div>
              ) : (
                <TableView data={previewData} maxHeight="max-h-[360px]" />
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-right">
              <button
                type="button"
                onClick={() => setPreviewTable(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
