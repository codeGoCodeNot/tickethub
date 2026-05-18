"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { signInPath } from "@/path";
import { LucideLoaderCircle, LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignOutItem = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Failed to sign out. Please try again.");
      } else {
        toast.success("Signed out successfully.");
        router.push(signInPath());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-x-2 w-full"
    >
      {loading ? (
        <>
          <LucideLoaderCircle className="animate-spin" />
          <span>Sign Out</span>
        </>
      ) : (
        <>
          <LucideLogOut />
          <span className="text-xs text-muted-foreground">Sign Out</span>
        </>
      )}
    </button>
  );
};

export default SignOutItem;
