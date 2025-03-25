"use client";

import { TemporaryDataProvider } from "@/app/_globalContext/temporaryData";
import Header from "../_components/Header";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SessionContextProvider from "../_globalContext/sessionContext";
import Spinner from "../_components/Spinner";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Spinner></Spinner>
      </div>
    );
  }

  return (
    <SessionContextProvider>
      <TemporaryDataProvider>
        <div className="flex flex-col overflow-hidden w-full h-screen">
          <Header />
          <div className="flex-1 flex-grow overflow-y-auto h-full py-3 px-2 md:px-3">
            {children}
          </div>
        </div>
      </TemporaryDataProvider>
    </SessionContextProvider>
  );
}
