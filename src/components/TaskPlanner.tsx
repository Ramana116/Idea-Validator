import { useState } from 'react';
import { CheckCircle, Circle, Calendar, Clock, Target, Zap, List } from 'lucide-react';
import { generateActionPlan, getQuickWins, generateChecklist, getTimeToMilestone, type Task } from '../utils/taskGenerator';
import type { AnalysisResult } from '../utils/mockData';

interface TaskPlannerProps {
  analysis: AnalysisResult;
}

export default function TaskPlanner({ analysis }: TaskPlannerProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'quick' | 'checklist' | 'milestones'>('plan');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const actionPlan = generateActionPlan(analysis);
  const quickWins = getQuickWins(analysis);
  const checklists = generateChecklist(analysis);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const tabs = [
    { id: 'plan' as const, label: 'Action Plan', icon: Calendar },
    { id: 'quick' as const, label: 'Quick Wins', icon: Zap },
    { id: 'checklist' as const, label: 'Checklists', icon: List },
    { id: 'milestones' as const, label: 'Milestones', icon: Target },
  ];

  const TaskItem = ({ task }: { task: Task }) => {
    const isComplete = completedTasks.has(task.id);
    
    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
          isComplete
            ? 'bg-emerald-600/5 border-emerald-500/20'
            : 'bg-surface-800/50 border-surface-700 hover:border-violet-500/30'
        }`}
        onClick={() => toggleTask(task.id)}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-medium ${isComplete ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
              {task.title}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              task.priority === 'High' ? 'bg-red-600/20 text-red-300' :
              task.priority === 'Medium' ? 'bg-amber-600/20 text-amber-300' :
              'bg-blue-600/20 text-blue-300'
            }`}>
              {task.priority}
            </span>
          </div>
          <p className={`text-xs mb-2 ${isComplete ? 'text-gray-600' : 'text-gray-500'}`}>{task.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimatedHours}h
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due in {task.dueInDays} days
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              task.category === 'Validation' ? 'bg-violet-600/20 text-violet-300' :
              task.category === 'Product' ? 'bg-blue-600/20 text-blue-300' :
              task.category === 'Marketing' ? 'bg-pink-600/20 text-pink-300' :
              task.category === 'Fundraising' ? 'bg-emerald-600/20 text-emerald-300' :
              'bg-gray-600/20 text-gray-300'
            }`}>
              {task.category}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                : 'bg-surface-800 text-gray-400 border border-surface-700 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Plan Tab */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-violet-400">{actionPlan.totalTasks}</div>
              <div className="text-xs text-gray-500">Total Tasks</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{completedTasks.size}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{actionPlan.totalHours}</div>
              <div className="text-xs text-gray-500">Total Hours</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((completedTasks.size / actionPlan.totalTasks) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Progress</div>
            </div>
          </div>

          {/* Week 1 Tasks */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-sm font-bold">1</span>
              Week 1 Tasks
            </h3>
            <div className="space-y-3">
              {actionPlan.week1.map(task => <TaskItem key={task.id} task={task} />)}
            </div>
          </div>

          {/* Weeks 2-4 Tasks */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-bold">2-4</span>
              Weeks 2-4 Tasks
            </h3>
            <div className="space-y-3">
              {actionPlan.week2to4.map(task => <TaskItem key={task.id} task={task} />)}
            </div>
          </div>

          {/* Months 2-3 Tasks */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold">2-3</span>
              Months 2-3 Tasks
            </h3>
            <div className="space-y-3">
              {actionPlan.month2to3.map(task => <TaskItem key={task.id} task={task} />)}
            </div>
          </div>

          {/* Months 4-6 Tasks */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm font-bold">4-6</span>
              Months 4-6 Tasks
            </h3>
            <div className="space-y-3">
              {actionPlan.month4to6.map(task => <TaskItem key={task.id} task={task} />)}
            </div>
          </div>

          {/* Critical Path */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Critical Path</h3>
            <div className="flex flex-wrap items-center gap-2">
              {actionPlan.criticalPath.map((step, i) => (
                <span key={i} className="text-sm text-gray-300">{step}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Wins Tab */}
      {activeTab === 'quick' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Wins - High Impact, Low Effort</h3>
          <div className="space-y-4">
            {quickWins.map((win, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-r from-emerald-600/5 to-transparent border border-emerald-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-emerald-300">{win.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      win.impact === 'High' ? 'bg-emerald-600/20 text-emerald-300' :
                      win.impact === 'Medium' ? 'bg-amber-600/20 text-amber-300' :
                      'bg-blue-600/20 text-blue-300'
                    }`}>
                      {win.impact} Impact
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      win.effort === 'Low' ? 'bg-emerald-600/20 text-emerald-300' :
                      win.effort === 'Medium' ? 'bg-amber-600/20 text-amber-300' :
                      'bg-red-600/20 text-red-300'
                    }`}>
                      {win.effort} Effort
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{win.description}</p>
                <div className="text-xs text-gray-500">⏱️ {win.timeToComplete}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklists Tab */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {checklists.map((category, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.items.map((item, j) => (
                  <label
                    key={j}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-surface-600 bg-surface-800 text-violet-600 focus:ring-violet-500/20 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{item.text}</span>
                        {item.critical && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-600/20 text-red-300">
                            Critical
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Time to Milestone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'First 10 Users',
              'First 100 Users',
              'First 1000 Users',
              'First Paying Customer',
              '$1K MRR',
              '$10K MRR',
              'Product-Market Fit',
              'Seed Funding',
            ].map((milestone) => {
              const data = getTimeToMilestone(analysis, milestone);
              return (
                <div
                  key={milestone}
                  className="p-4 rounded-xl bg-surface-800/50 border border-surface-700"
                >
                  <h4 className="text-sm font-medium text-gray-200 mb-2">{milestone}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-violet-400">{data.estimatedDays}</span>
                    <span className="text-xs text-gray-500">days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${
                      data.confidence === 'High' ? 'bg-emerald-600/20 text-emerald-300' :
                      data.confidence === 'Medium' ? 'bg-amber-600/20 text-amber-300' :
                      'bg-red-600/20 text-red-300'
                    }`}>
                      {data.confidence} confidence
                    </span>
                  </div>
                  {data.blockers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-surface-700">
                      <div className="text-xs text-gray-500 mb-1">Blockers:</div>
                      {data.blockers.map((b, i) => (
                        <div key={i} className="text-xs text-red-300 flex items-center gap-1">
                          <span>⚠️</span> {b}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
