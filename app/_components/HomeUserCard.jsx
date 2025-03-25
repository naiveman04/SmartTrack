"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sun, Moon, UserCheck, Clock, CircleCheck, LayoutDashboard } from "lucide-react";

function HomeUserCard() {
  const { data: session } = useSession();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const isAdmin = session?.user?.email === adminEmail;
  const isOnline = Boolean(session);
  const userName = isAdmin ? `${session?.user?.name} (Admin)` : session?.user?.name || "Guest";

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = currentDate.getHours();
  let greeting = "Good Morning";
  let Icon = Sun;
  let iconColor = "text-yellow-500";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    iconColor = "text-orange-500";
  } else if (hour >= 17 && hour < 20) {
    greeting = "Good Evening";
    iconColor = "text-purple-500";
  } else if (hour >= 20 || hour < 5) {
    greeting = "Good Night";
    Icon = Moon;
    iconColor = "text-blue-500";
  }
  
  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-purple-200 opacity-20 blur-lg"></div>

      {/* Greeting Section */}
      <div className="flex items-center gap-3 relative z-10">
        <Icon className={`w-12 h-12 drop-shadow-lg ${iconColor}`} />
        <h2 className="text-2xl font-semibold text-gray-800">{greeting}!</h2>
      </div>

      {/* Date */}
      <div className="relative z-10">
        <p className="text-lg text-gray-600 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" /> {formattedDate}
        </p>
      </div>

      {/* User Details */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-green-500" />
          <p className="text-lg text-gray-600">User</p>
        </div>
        <p className="text-2xl font-semibold text-green-700">{userName}</p>

        <div className="flex items-center gap-2 mt-3">
          <CircleCheck className={`w-6 h-6 ${isOnline ? "text-green-500" : "text-red-500"}`} />
          <p className={`text-lg font-medium ${isOnline ? "text-green-600" : "text-red-600"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <div className="relative z-10">
          <Link href="/dashboard/admin">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              <LayoutDashboard className="w-5 h-5" /> Admin Board
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomeUserCard;
