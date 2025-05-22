'use client';

import { useState, useEffect } from 'react';

export default function ClientDateTime() {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial date on the client side only
    setCurrentDateTime(new Date());
    
    // Update the date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Don't render anything during SSR
  if (!currentDateTime) {
    return (
      <div className="flex items-center space-x-2 whitespace-nowrap py-1 px-3 bg-purple-700 bg-opacity-80 rounded-md">
        <span className="text-sm font-medium text-purple-200 whitespace-nowrap opacity-0">
          Loading...
        </span>
      </div>
    );
  }

  // Format the day of week
  const dayOfWeek = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });

  // Format the date as "Month Day, Year" (e.g., "May 20, 2025")
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Format the time with AM/PM
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="flex items-center space-x-2 whitespace-nowrap py-1 px-3 bg-purple-700 bg-opacity-80 rounded-md">
      <span className="text-sm font-medium text-purple-200 whitespace-nowrap">
        {dayOfWeek}
      </span>
      <span className="text-sm text-purple-400 font-medium">•</span>
      <span className="text-sm font-medium text-purple-200 whitespace-nowrap">
        {formattedDate}
      </span>
      <span className="text-sm text-purple-400 font-medium">•</span>
      <span className="text-sm font-bold text-purple-100 whitespace-nowrap">
        {formattedTime}
      </span>
    </div>
  );
}
