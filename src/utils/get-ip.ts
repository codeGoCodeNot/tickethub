import { headers } from "next/headers";

export const getIp = async () => {
  const headerList = await headers();
  return (
    headerList.get("x-forwarded-for")?.split(",")[0] ??
    headerList.get("x-real-ip") ??
    "127.0.0.1"
  );
};
