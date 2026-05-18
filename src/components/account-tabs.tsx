"use client";

import { profilePath, passwordPath } from "@/path";
import Link from "next/link";
import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
import { usePathname } from "next/navigation";

const AccountTabs = () => {
  const pathname = usePathname();
  const value = pathname === passwordPath() ? "password" : "profile";

  return (
    <Tabs value={value} className="w-[400px] z-[10]">
      <TabsList>
        <TabsTrigger value="profile" asChild>
          <Link href={profilePath()}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="password" asChild>
          <Link href={passwordPath()}>Password</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AccountTabs;
