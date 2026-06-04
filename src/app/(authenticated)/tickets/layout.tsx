import AiChatBot from "@/features/ai/components/ai-chat-bot";
import getAiChatMessages from "@/features/ai/queries/get-ai-chat-messages";
import { getAuth } from "@/features/auth/queries/get-auth";
import AccountGuard from "@/features/organizations/components/org-guard";
import { Suspense } from "react";

const TicketsLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuth();
  const chatHistory = await getAiChatMessages();

  return (
    <Suspense>
      <AccountGuard>{children}</AccountGuard>
      {user && <AiChatBot initialMessages={chatHistory} userName={user.name} />}
    </Suspense>
  );
};

export default TicketsLayout;
