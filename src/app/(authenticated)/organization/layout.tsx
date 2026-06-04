import AiChatBot from "@/features/ai/components/ai-chat-bot";
import getAiChatMessages from "@/features/ai/queries/get-ai-chat-messages";
import { getAuth } from "@/features/auth/queries/get-auth";

const TicketsLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuth();
  const chatHistory = await getAiChatMessages();

  return (
    <>
      {children}
      {user && <AiChatBot initialMessages={chatHistory} userName={user.name} />}
    </>
  );
};

export default TicketsLayout;
