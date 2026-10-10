import React, { useState } from 'react';
import { TaskItem, TaskLevel } from '../types';
import { CheckCircle, Circle, PlayCircle, Search, Trophy, Filter, ChevronRight, Award } from 'lucide-react';

interface TaskListProps {
  tasks: TaskItem[];
  activeTaskId: string;
  onSelectTask: (task: TaskItem) => void;
  completedTaskIds: string[];
  totalScore: number;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  completedTaskIds,
  totalScore
}) => {
  const [filterLevel, setFilterLevel] = useState<TaskLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = tasks.filter((t) => completedTaskIds.includes(t.id)).length;

  const filteredTasks = tasks.filter((t) => {
    const matchesLevel = filterLevel === 'all' || t.level === filterLevel;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelBadge = (level: TaskLevel) => {
    switch (level) {
      case 'nhan_biet':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">Nhận biết</span>;
      case 'thong_hieu':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">Thông hiểu</span>;
      case 'van_dung':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-purple-50 text-purple-700 border border-purple-200">Vận dụng</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header with stats */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-800">Nhiệm vụ truy vấn</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
              {completedCount}/{tasks.length} đạt
            </span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-xs flex items-center gap-1">
              <Award className="w-3 h-3" /> {totalScore}đ
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài tập..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-400"
          />
        </div>

        {/* Level filter tabs */}
        <div className="flex rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setFilterLevel('all')}
            className={`flex-1 py-1 rounded-md transition text-center ${
              filterLevel === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setFilterLevel('nhan_biet')}
            className={`flex-1 py-1 rounded-md transition text-center ${
              filterLevel === 'nhan_biet' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Nhận biết
          </button>
          <button
            type="button"
            onClick={() => setFilterLevel('thong_hieu')}
            className={`flex-1 py-1 rounded-md transition text-center ${
              filterLevel === 'thong_hieu' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Thông hiểu
          </button>
          <button
            type="button"
            onClick={() => setFilterLevel('van_dung')}
            className={`flex-1 py-1 rounded-md transition text-center ${
              filterLevel === 'van_dung' ? 'bg-white text-purple-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Vận dụng
          </button>
        </div>
      </div>

      {/* Task list items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1.5 space-y-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Không tìm thấy bài tập phù hợp.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            const isActive = task.id === activeTaskId;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onSelectTask(task)}
                className={`w-full text-left p-3 rounded-lg transition border cursor-pointer ${
                  isActive
                    ? 'bg-sky-50/80 border-sky-300 shadow-xs'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                      ) : isActive ? (
                        <PlayCircle className="w-4 h-4 text-sky-600 fill-sky-100" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold leading-snug ${
                        isActive ? 'text-sky-900' : 'text-slate-800'
                      }`}>
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {task.prompt}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-sky-600' : 'text-slate-300'}`} />
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
                  <div className="flex items-center space-x-1.5">
                    {getLevelBadge(task.level)}
                    <span className="font-semibold text-slate-500">+{task.points}đ</span>
                  </div>
                  <span className={`font-medium ${
                    isCompleted ? 'text-emerald-600' : isActive ? 'text-sky-600' : 'text-slate-400'
                  }`}>
                    {isCompleted ? 'Đã hoàn thành' : isActive ? 'Đang thực hiện' : 'Chưa làm'}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
