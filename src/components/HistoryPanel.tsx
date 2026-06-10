import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Trash2, Download, ChevronRight, Clock, 
  TrendingUp, AlertCircle, CheckCircle, X, Search, Filter
} from 'lucide-react';
import type { SavedAnalysis } from '../utils/storage';
import { getHistory, deleteAnalysis, clearHistory, exportHistory } from '../utils/storage';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadAnalysis: (id: string) => void;
}

export default function HistoryPanel({ isOpen, onClose, onLoadAnalysis }: HistoryPanelProps) {
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterScore === 'all' 
      ? true 
      : filterScore === 'high' 
        ? item.validationScore >= 80
        : filterScore === 'medium'
          ? item.validationScore >= 60 && item.validationScore < 80
          : item.validationScore < 60;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-600/20 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-600/20 border-amber-500/30';
    return 'text-red-400 bg-red-600/20 border-red-500/30';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-3 h-3" />;
    if (score >= 60) return <AlertCircle className="w-3 h-3" />;
    return <X className="w-3 h-3" />;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-900 border-l border-surface-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-violet-400" />
                <h2 className="font-semibold">Analysis History</h2>
                <span className="text-xs text-gray-500">({history.length} saved)</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="p-4 border-b border-surface-800 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search analyses..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value as any)}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm focus:border-violet-500 focus:outline-none"
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (80+)</option>
                  <option value="medium">Medium (60-79)</option>
                  <option value="low">Low (Under 60)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-surface-800 flex gap-2">
              <button
                onClick={exportHistory}
                disabled={history.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export All
              </button>
              <button
                onClick={handleClearAll}
                disabled={history.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 text-red-300 text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No analyses found</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-violet-400 text-sm mt-2 hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4 hover:border-violet-500/30 transition-all cursor-pointer group"
                    onClick={() => onLoadAnalysis(item.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-200 truncate">{item.idea.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.industry}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getScoreColor(item.validationScore)}`}>
                        {getScoreIcon(item.validationScore)}
                        <span className="font-medium">{item.validationScore}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.idea.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {item.successProbability}% success
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                          className="p-1.5 hover:bg-red-600/20 rounded text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-violet-400" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Stats */}
            {history.length > 0 && (
              <div className="p-4 border-t border-surface-800 bg-surface-900/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-emerald-400">
                      {history.filter(h => h.validationScore >= 80).length}
                    </div>
                    <div className="text-xs text-gray-500">High Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-400">
                      {history.filter(h => h.validationScore >= 60 && h.validationScore < 80).length}
                    </div>
                    <div className="text-xs text-gray-500">Medium</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-400">
                      {history.filter(h => h.validationScore < 60).length}
                    </div>
                    <div className="text-xs text-gray-500">Low Score</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
