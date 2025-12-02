import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, AlertTriangle, Wrench, Database, Map, Bot, Shield, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  frequency: string;
  lastCompleted: Date | null;
  nextDue: Date;
  status: 'completed' | 'pending' | 'overdue';
  category: 'database' | 'maps' | 'ai' | 'security' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function MaintenanceSchedule() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    // Initialize maintenance tasks
    const maintenanceTasks: MaintenanceTask[] = [
      {
        id: 'med-db-update',
        title: 'Medication Database Update',
        description: 'Update medication information, drug interactions, and dosage guidelines',
        frequency: 'Monthly',
        lastCompleted: new Date('2024-12-01'),
        nextDue: new Date('2025-01-01'),
        status: 'pending',
        category: 'database',
        priority: 'high'
      },
      {
        id: 'hospital-data-sync',
        title: 'Hospital Location Sync',
        description: 'Synchronize hospital locations, contact information, and service availability',
        frequency: 'Weekly',
        lastCompleted: new Date('2024-12-10'),
        nextDue: new Date('2024-12-17'),
        status: 'overdue',
        category: 'maps',
        priority: 'critical'
      },
      {
        id: 'ai-model-update',
        title: 'AI Model Enhancement',
        description: 'Update medical AI models with latest research and treatment protocols',
        frequency: 'Quarterly',
        lastCompleted: new Date('2024-10-01'),
        nextDue: new Date('2025-01-01'),
        status: 'pending',
        category: 'ai',
        priority: 'high'
      },
      {
        id: 'emergency-contacts-verify',
        title: 'Emergency Contacts Verification',
        description: 'Verify all emergency contact numbers and service availability',
        frequency: 'Monthly',
        lastCompleted: new Date('2024-11-15'),
        nextDue: new Date('2024-12-15'),
        status: 'overdue',
        category: 'database',
        priority: 'critical'
      },
      {
        id: 'protocol-review',
        title: 'Medical Protocol Review',
        description: 'Review and update emergency medical protocols based on latest guidelines',
        frequency: 'Quarterly',
        lastCompleted: new Date('2024-09-01'),
        nextDue: new Date('2024-12-01'),
        status: 'overdue',
        category: 'database',
        priority: 'high'
      },
      {
        id: 'map-data-refresh',
        title: 'Map Data Refresh',
        description: 'Update geographical data, road networks, and point-of-interest information',
        frequency: 'Monthly',
        lastCompleted: new Date('2024-11-20'),
        nextDue: new Date('2024-12-20'),
        status: 'pending',
        category: 'maps',
        priority: 'medium'
      },
      {
        id: 'security-audit',
        title: 'Security Audit',
        description: 'Perform comprehensive security assessment and vulnerability scanning',
        frequency: 'Monthly',
        lastCompleted: new Date('2024-11-30'),
        nextDue: new Date('2024-12-30'),
        status: 'pending',
        category: 'security',
        priority: 'high'
      },
      {
        id: 'offline-cache-cleanup',
        title: 'Offline Cache Optimization',
        description: 'Clean and optimize offline data cache for improved performance',
        frequency: 'Weekly',
        lastCompleted: new Date('2024-12-08'),
        nextDue: new Date('2024-12-15'),
        status: 'overdue',
        category: 'system',
        priority: 'medium'
      }
    ];

    setTasks(maintenanceTasks);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return Database;
      case 'maps': return Map;
      case 'ai': return Bot;
      case 'security': return Shield;
      case 'system': return Wrench;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const runMaintenance = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'completed' as const,
            lastCompleted: new Date(),
            nextDue: new Date(Date.now() + (task.frequency === 'Weekly' ? 7 : task.frequency === 'Monthly' ? 30 : 90) * 24 * 60 * 60 * 1000)
          }
        : task
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 border border-blue-200/50 px-6 py-2 rounded-full mb-6">
              <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">{t('maintenance.systemMaintenance')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              {t('maintenance.routineSchedule')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('maintenance.scheduleDescription')}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              {(['all', 'pending', 'overdue'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === filterOption
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(`maintenance.filter.${filterOption}`)} 
                  ({tasks.filter(task => filterOption === 'all' || task.status === filterOption).length})
                </button>
              ))}
            </div>
          </div>

          {/* Maintenance Tasks Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => {
              const IconComponent = getCategoryIcon(task.category);
              
              return (
                <div
                  key={task.id}
                  className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="p-6 relative">
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                          <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            {task.title}
                          </h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {t(`maintenance.priority.${task.priority}`)}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {t(`maintenance.status.${task.status}`)}
                      </div>
                    </div>

                    {/* Task Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Task Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{t('maintenance.frequency')}: {task.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{t('maintenance.nextDue')}: {task.nextDue.toLocaleDateString()}</span>
                      </div>
                      {task.lastCompleted && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>{t('maintenance.lastCompleted')}: {task.lastCompleted.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => runMaintenance(task.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        {t('maintenance.runMaintenance')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Auto-Maintenance Info */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">
                  {t('maintenance.automatedSystem')}
                </h3>
                <p className="text-green-700 dark:text-green-300 leading-relaxed">
                  {t('maintenance.automatedDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}