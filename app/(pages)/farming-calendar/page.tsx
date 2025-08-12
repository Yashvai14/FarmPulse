'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Bell, Leaf, Droplet, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import NavBar from '@/components/navBar';

const dummyCropCycles = {
  wheat: [
    { date: '2025-08-02', task: 'Sowing', icon: <Leaf /> },
    { date: '2025-08-15', task: 'Irrigation', icon: <Droplet /> },
    { date: '2025-09-10', task: 'Fertilizing', icon: <Bell /> },
    { date: '2025-11-20', task: 'Harvesting', icon: <CalendarDays /> },
  ],
  rice: [
    { date: '2025-08-05', task: 'Sowing', icon: <Leaf /> },
    { date: '2025-08-25', task: 'Irrigation', icon: <Droplet /> },
    { date: '2025-09-15', task: 'Fertilizing', icon: <Bell /> },
    { date: '2025-11-30', task: 'Harvesting', icon: <CalendarDays /> },
  ],
};

export default function FarmingCalendarPage() {
  const [crop, setCrop] = useState<'wheat' | 'rice'>('wheat');
  const [value, setValue] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const data = dummyCropCycles[crop];
    setReminders(data);
  }, [crop]);

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCrop(e.target.value as 'wheat' | 'rice');
  };

  return (
    <>
    <NavBar />
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-6xl text-lime-500 font-bold mb-4 text-center"> Farming Calendar & Reminders</h1>

      <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <label className="text-xl m-5 font-semibold mr-2">Select Crop:</label>
          <select
            className="border px-3 py-1 rounded"
            onChange={handleCropChange}
            value={crop}
          >
            <option value="wheat">Wheat</option>
            <option value="rice">Rice</option>
          </select>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Today's Date: {format(new Date(), 'PPP')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-3 text-green-600">📅 Calendar View</h2>
          <Calendar onChange={setValue} value={value} />
        </div>

        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-3 text-green-600">🔔 Upcoming Tasks</h2>
          <ul className="space-y-4">
            {reminders.map((r, idx) => (
              <li
                key={idx}
                className={`flex items-center justify-between border-l-4 px-4 py-2 rounded-md ${
                  new Date(r.date).toDateString() === new Date().toDateString()
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">{r.icon}</span>
                  <span className="font-medium">{r.task}</span>
                </div>
                <span className="text-gray-600 text-xs">{format(new Date(r.date), 'PPP')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
