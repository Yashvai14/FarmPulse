"use client";

import NavBar from "@/components/navBar";
import React, { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  crop: string;
  dueDate: string;
  status: "completed" | "in-progress" | "pending";
  assignee?: string;
  priority?: "low" | "medium" | "high";
  category?: string;
};

type WeatherData = {
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
};

const initialTasks: Task[] = [
  { id: "t1", title: "Irrigate North Field", crop: "Wheat", dueDate: "2025-09-22", status: "in-progress", assignee: "Ramesh", priority: "high", category: "Irrigation" },
  { id: "t2", title: "Spray pesticide - Block B", crop: "Cotton", dueDate: "2025-09-24", status: "pending", assignee: "Priya", priority: "medium", category: "Pest Control" },
  { id: "t3", title: "Harvest - South Plot", crop: "Tomato", dueDate: "2025-09-30", status: "pending", assignee: "Suresh", priority: "high", category: "Harvesting" },
  { id: "t4", title: "Fertilizer application", crop: "Rice", dueDate: "2025-09-20", status: "completed", assignee: "Ramesh", priority: "medium", category: "Fertilization" },
  { id: "t5", title: "Soil testing - East Field", crop: "Corn", dueDate: "2025-09-25", status: "pending", assignee: "Priya", priority: "low", category: "Testing" },
];

export default function FarmPulseDashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [nowSeconds, setNowSeconds] = useState<number>(0);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskCrop, setNewTaskCrop] = useState<string>("");
  const [newTaskDue, setNewTaskDue] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium");
  const [newTaskCategory, setNewTaskCategory] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    condition: "Sunny",
    humidity: 65,
    rainfall: 2.5
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => setNowSeconds(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const running = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completedPct = Math.round((completed / Math.max(1, total)) * 100);

  function humanTime(s: number) {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  }

  function addTask() {
    if (!newTaskTitle || !newTaskCrop || !newTaskDue) return;
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: newTaskTitle,
      crop: newTaskCrop,
      dueDate: newTaskDue,
      status: "pending",
      assignee: "Unassigned",
      priority: newTaskPriority,
      category: newTaskCategory || "General"
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskCrop("");
    setNewTaskDue("");
    setNewTaskPriority("medium");
    setNewTaskCategory("");
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  function updateTaskStatus(id: string, status: Task["status"]) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex items-center gap-4">
            <div className="bg-lime-100 p-3 rounded-xl">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-lime-600">FarmPulse Dashboard</h1>
              <p className="text-gray-600">Plan, prioritize, and accomplish farm tasks with ease.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                className="border-2 border-green-200 rounded-xl px-4 py-2 w-64 bg-white focus:border-lime-400 focus:outline-none transition-colors"
                placeholder="Search tasks, crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">🔍</span>
            </div>

            <div className="flex items-center gap-3 bg-lime-50 px-4 py-2 rounded-xl border border-lime-200">
              <div>
                <div className="text-sm font-medium text-gray-800">Ram Prakash</div>
                <div className="text-xs text-gray-500">Farm Owner</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white font-semibold">RP</div>
            </div>
          </div>
        </header>

        {/* Stats and Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-lime-400 to-green-500 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/80 text-sm font-medium">Total Tasks</div>
                  <div className="text-4xl font-bold">{total}</div>
                  <div className="text-white/90 text-sm mt-1">↑ 12% from last month</div>
                </div>
                <div className="text-4xl opacity-20">📋</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-500 text-sm font-medium">Completed</div>
                  <div className="text-3xl font-bold text-green-600">{completed}</div>
                  <div className="text-green-600 text-sm mt-1">{completedPct}% done</div>
                </div>
                <div className="text-3xl text-green-200">✓</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-500 text-sm font-medium">In Progress</div>
                  <div className="text-3xl font-bold text-orange-500">{running}</div>
                  <div className="text-orange-500 text-sm mt-1">Active now</div>
                </div>
                <div className="text-3xl text-orange-200">⏱</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-500 text-sm font-medium">Pending</div>
                  <div className="text-3xl font-bold text-yellow-500">{pending}</div>
                  <div className="text-yellow-500 text-sm mt-1">Upcoming</div>
                </div>
                <div className="text-3xl text-yellow-200">⏰</div>
              </div>
            </div>
          </div>
          
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Weather</h3>
              <span className="text-3xl">☀️</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
                <div className="text-white/80">{weatherData.condition}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>💧</span>
                  <span className="text-sm">Humidity: {weatherData.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌧️</span>
                  <span className="text-sm">Rainfall: {weatherData.rainfall}mm</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/80">Agricultural Advisory</div>
              <div className="text-sm mt-1">Perfect weather for irrigation activities</div>
            </div>
          </div>
        </div>

        {/* Time Tracker */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex items-center gap-4">
            <div className="bg-lime-100 p-3 rounded-xl">
              <span className="text-2xl">⏱️</span>
            </div>
            <div>
              <div className="font-semibold text-lime-600 text-lg">Time Tracker</div>
              <div className="text-sm text-gray-500">Total active farm hours today</div>
              <div className="mt-2 text-3xl font-bold text-lime-600">{humanTime(nowSeconds)}</div>
            </div>
          </div>
        </section>

        {/* Add New Task */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-lime-100 p-2 rounded-lg">
              <span className="text-xl">➕</span>
            </div>
            <h3 className="font-semibold text-lime-600 text-lg">Add New Task</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Task Title"
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-lime-400 focus:outline-none transition-colors"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Crop"
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-lime-400 focus:outline-none transition-colors"
              value={newTaskCrop}
              onChange={(e) => setNewTaskCrop(e.target.value)}
            />
            <input
              type="date"
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-lime-400 focus:outline-none transition-colors"
              value={newTaskDue}
              onChange={(e) => setNewTaskDue(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-lime-400 focus:outline-none transition-colors"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
            />
            <select
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-lime-400 focus:outline-none transition-colors"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task["priority"])}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>➕</span>
              Add Task
            </button>
          </div>
        </section>

        {/* Task List */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-lime-100 p-2 rounded-lg">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-lime-600 text-lg">Task Management</h3>
                <p className="text-sm text-gray-500">Organize and track your farm activities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-lime-400 focus:outline-none text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((t) => (
              <div key={t.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{t.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span>🌾</span>
                        {t.crop}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        Due: {t.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💼</span>
                        {t.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👤</span>
                        {t.assignee}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as Task["status"])}
                      className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-lime-400 focus:outline-none text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => removeTask(t.id)}
                      className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl text-gray-300 mb-2">📋</div>
              <p className="text-gray-500">No tasks found matching your criteria</p>
            </div>
          )}
        </section>

        {/* Calendar and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-lime-100 p-2 rounded-lg">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-lime-600 text-lg">Upcoming Tasks</h3>
                <p className="text-sm text-gray-500">Tasks scheduled for this week</p>
              </div>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== 'completed').slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      t.priority === 'high' ? 'bg-red-400' :
                      t.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-800">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.crop}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">{t.dueDate}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'in-progress' ? 'bg-orange-100 text-orange-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {t.status === 'in-progress' ? 'Active' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Analytics */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-lime-100 p-2 rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-lime-600 text-lg">Task Analytics</h3>
                <p className="text-sm text-gray-500">Performance overview</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-lime-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600">Completion Rate</div>
                  <div className="text-2xl font-bold text-green-600">{completedPct}%</div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${completedPct}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="text-sm text-blue-600 font-medium">Total Tasks</div>
                  <div className="text-2xl font-bold text-blue-700">{total}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <div className="text-sm text-orange-600 font-medium">Active</div>
                  <div className="text-2xl font-bold text-orange-700">{running}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-sm text-gray-600 font-medium mb-2">Task Distribution by Priority</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      High Priority
                    </span>
                    <span className="font-medium">{tasks.filter(t => t.priority === 'high').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      Medium Priority
                    </span>
                    <span className="font-medium">{tasks.filter(t => t.priority === 'medium').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      Low Priority
                    </span>
                    <span className="font-medium">{tasks.filter(t => t.priority === 'low').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

       
      </div>
    </div>
    </>
  );
}
