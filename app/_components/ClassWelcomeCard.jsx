import React, { useState, useEffect } from "react";
import { Sun, Moon, Clock } from "lucide-react";

function ClassWelcomeCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setCurrentTime(new Date()); // Set time only on mount
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = currentTime.getHours();
  let greeting = "Good Morning";
  let Icon = Sun;
  let iconColor = "text-yellow-500";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    iconColor = "text-orange-500";
  } else if (hour >= 17 && hour < 20) {
    greeting = "Good Evening";
    Icon = Moon;
    iconColor = "text-purple-500";
  } else {
    greeting = "Good Night";
    Icon = Moon;
    iconColor = "text-blue-500";
  }

  return (
    <div className="flex flex-col p-4 py-8 bg-gradient-to-br from-indigo-50
     to-white rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="flex items-center gap-5">
        {/* Icon Wrapper */}
        <div className="flex items-center justify-center bg-indigo-100 rounded-full p-4 shadow-md">
          <Icon className={`w-16 h-16 drop-shadow-lg ${iconColor}`} />
        </div>

        {/* Date Information */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{greeting}!</h1>
          <h2 className="text-lg text-gray-600">{formattedDate}</h2>
          <p className="text-md text-gray-500 flex items-center gap-2 mt-1">
            <Clock className="w-5 h-5 text-blue-500" /> {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClassWelcomeCard;

