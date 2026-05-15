"use client";

import { deleteCookie, getCookieByKey } from "@/actions/cookies";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const RedirectToast = () => {
  const pathname = usePathname();

  useEffect(() => {
    const showCookie = async () => {
      const message = await getCookieByKey("toast");
      if (message) {
        toast.success(message);
        await deleteCookie("toast");
      }
    };

    showCookie();
  }, [pathname]);

  return null;
};

export default RedirectToast;
