"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TicketPoller = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    document.addEventListener("visibilitychange", handleRefresh);
    window.addEventListener("focus", handleRefresh);
    return () => {
      document.removeEventListener("visibilitychange", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [router]);

  return null;
};

export default TicketPoller;
