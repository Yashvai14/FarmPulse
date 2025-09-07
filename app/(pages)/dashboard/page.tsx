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
};

const initialTasks: Task[] = [
  { id: "t1", title: "Irrigate North Field", crop: "Wheat", dueDate: "2025-09-22", status: "in-progress", assignee: "Ramesh" },
  { id: "t2", title: "Spray pesticide - Block B", crop: "Cotton", dueDate: "2025-09-24", status: "pending", assignee: "Priya" },
  { id: "t3", title: "Harvest - South Plot", crop: "Tomato", dueDate: "2025-09-30", status: "pending", assignee: "Suresh" },
  { id: "t4", title: "Fertilizer application", crop: "Rice", dueDate: "2025-09-20", status: "completed", assignee: "Ramesh" },
];

export default function FarmPulseDashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [nowSeconds, setNowSeconds] = useState<number>(0);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskCrop, setNewTaskCrop] = useState<string>("");
  const [newTaskDue, setNewTaskDue] = useState<string>("");

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
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskCrop("");
    setNewTaskDue("");
  }

  function updateTaskStatus(id: string, status: Task["status"]) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <>
    <NavBar />
    <div className="min-h-screen  text-gray-800">
      <div className="max-w-[1200px] mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold text-lime-500">FarmPulse Dashboard</div>
            <div className="text-sm text-gray-500">Plan, prioritize, and accomplish farm tasks with ease.</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="border rounded-xl px-4 py-2 w-64 bg-white"
                placeholder="Search tasks, crops, or weather..."
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded">⌕</button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">Ram Prakash</div>
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">👨🏽‍🌾</div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-4 bg-white rounded-2xl p-5 shadow flex flex-col justify-between">
            <div className="text-xs text-gray-500">Total Tasks</div>
            <div className="text-3xl font-bold text-lime-500">{total}</div>
            <div className="text-sm text-green-600 mt-2">↑ 12% from last month</div>
          </div>
          <div className="col-span-2 bg-white rounded-2xl p-5 shadow">
            <div className="text-xs text-gray-500">Completed</div>
            <div className="text-2xl font-semibold text-lime-500">{completed}</div>
          </div>
          <div className="col-span-3 bg-white rounded-2xl p-5 shadow">
            <div className="text-xs text-gray-500">Running</div>
            <div className="text-2xl font-semibold text-lime-500">{running}</div>
          </div>
          <div className="col-span-3 bg-white rounded-2xl p-5 shadow">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="text-2xl font-semibold text-lime-500">{pending}</div>
          </div>
        </section>

        {/* Time Tracker */}
        <section className="bg-white rounded-2xl p-4 shadow">
          <div>
            <div className="font-medium text-lime-500">Time Tracker</div>
            <div className="text-xs text-gray-500">Total active farm hours today</div>
            <div className="mt-3 text-2xl font-semibold text-lime-500">{humanTime(nowSeconds)}</div>
          </div>
        </section>

        {/* Add New Task */}
        <section className="bg-white rounded-2xl p-4 shadow">
          <div className="font-medium mb-2 text-lime-500">Add New Task</div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Task Title"
              className="border p-2 rounded flex-1"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Crop"
              className="border p-2 rounded w-32"
              value={newTaskCrop}
              onChange={(e) => setNewTaskCrop(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={newTaskDue}
              onChange={(e) => setNewTaskDue(e.target.value)}
            />
            <button
              onClick={addTask}
              className="px-3 py-2 rounded bg-green-600 text-white"
            >
              Add
            </button>
          </div>
        </section>

        {/* Task List */}
        <section className="bg-white rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lime-500">Tasks</div>
            <div className="text-sm text-gray-500">Showing latest tasks</div>
          </div>

          <div className="mt-4 space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold text-lime-500">{t.title}</div>
                  <div className="text-xs text-gray-500">{t.crop} • Due: {t.dueDate}</div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as Task["status"])}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                  <div className="text-xs text-gray-500">{t.assignee}</div>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="px-3 py-1 rounded bg-red-50 text-sm text-red-600">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Calendar */}
        <section className="bg-white rounded-2xl p-4 shadow">
          <div className="font-medium mb-2 text-lime-500">Calendar</div>
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="flex justify-between border p-2 rounded">
                <span className="text-lime-500 font-semibold">{t.title} ({t.crop})</span>
                <span className="text-xs text-gray-500">Due: {t.dueDate}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Analytics */}
        <section className="bg-white rounded-2xl p-4 shadow">
          <div className="font-medium mb-2 text-lime-500">Analytics</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold text-lime-500">{total}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-xl font-bold text-lime-500">{completed} ({completedPct}%)</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl font-bold text-lime-500">{pending}</div>
            </div>
          </div>
        </section>

       
      </div>
    </div>
    </>
  );
}
