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
    const { error } = await signOut();
    setLoading(false);

    if (error) {
      return toast.error("Failed to sign out. Please try again.");
    } else {
      toast.success("Signed out successfully.");
      router.push(signInPath());
    }
  };

  return (
    <Button onClick={handleLogout} disabled={loading}>
      {loading ? (
        <>
          <span>Sign Out</span>
          <LucideLoaderCircle className="animate-spin" />
        </>
      ) : (
        <>
          <span>Sign Out</span>
          <LucideLogOut />
        </>
      )}
    </Button>
  );
};

export default SignOutItem;
