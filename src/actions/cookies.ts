// toast for cookie actions

"use server";

import { cookies } from "next/headers";

export const getCookieByKey = async (key: string) => {
  const cookieStore = (await cookies()).get(key);

  if (!cookieStore) {
    return null;
  }
  return cookieStore.value;
};

export const setCookieByKey = async (key: string, value: string) => {
  (await cookies()).set(key, value);
};

export const deleteCookie = async (key: string) => {
  (await cookies()).delete(key);
};
