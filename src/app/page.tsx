import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import AiChatBot from "@/features/ai/components/ai-chat-bot";
import getAiChatMessages from "@/features/ai/queries/get-ai-chat-messages";
import { getAuth } from "@/features/auth/queries/get-auth";
import TicketList from "@/features/ticket/components/ticket-list";
import { searchParamsCache } from "@/features/ticket/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketListWrapper = async ({ searchParams }: HomePageProps) => {
  const { search, sort, page, size } = searchParamsCache.parse(
    await searchParams,
  );
  return <TicketList search={search} sort={sort} page={page} size={size} />;
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const user = await getAuth();
  const chatHistory = await getAiChatMessages();

  return (
    <>
      <div className="flex flex-col flex-1 gap-y-8">
        <Heading
          title="All tickets in one place"
          description="Tickets by everyone at one place"
        />
        <Suspense fallback={<Spinner />}>
          <TicketListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
      {user && <AiChatBot initialMessages={chatHistory} userName={user.name} />}
    </>
  );
};

export default HomePage;
