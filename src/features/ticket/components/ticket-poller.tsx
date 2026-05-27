"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TicketPoller = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        queryClient.invalidateQueries();
      }
    };

    document.addEventListener("visibilitychange", handleRefresh);
    window.addEventListener("focus", handleRefresh);
    return () => {
      document.removeEventListener("visibilitychange", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [router, queryClient]);

  return null;
};

export default TicketPoller;
