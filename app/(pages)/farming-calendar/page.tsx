'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Bell, Leaf, Droplet, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import NavBar from '@/components/navBar';
import { Button } from '@/components/ui/button';

// Dynamically import Calendar to avoid SSR issues
const Calendar = dynamic(() => import('react-calendar').then(mod => ({ default: mod.Calendar })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
});

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
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-6xl text-lime-500 font-bold mb-4 text-center">Farming Calendar & Reminders</h1>

      <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <label className="text-lg md:text-xl mb-2 md:mb-0 md:mr-2 font-semibold block md:inline">Select Crop:</label>
          <select
            className="border px-3 py-2 rounded-md w-full md:w-auto"
            onChange={handleCropChange}
            value={crop}
          >
            <option value="wheat">Wheat</option>
            <option value="rice">Rice</option>
          </select>
        </div>

        <div>
          <p className="text-gray-600 text-xs md:text-sm text-center md:text-right">
            Today's Date: {format(new Date(), 'PPP')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-green-600">📅 Calendar View</h2>
          <div className="calendar-container">
            <Calendar 
              onChange={setValue} 
              value={value}
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-green-600">🔔 Upcoming Tasks</h2>
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
                <span className="text-gray-600 text-xs hidden md:block">{format(new Date(r.date), 'MMM dd')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
