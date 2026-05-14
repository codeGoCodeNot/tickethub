import { initialTickets } from "@/data";
import { ticketPath } from "@/path";
import Link from "next/link";
import clsx from "clsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LucideCircleCheck, LucideFileText, LucidePencil } from "lucide-react";
import Heading from "@/components/heading";

const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};

const TicketsPage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets in one place."
      />

      <div className="flex flex-col flex-1 items-center gap-y-4 animate-fade-from-top">
        {initialTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="w-full max-w-[500px] hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>
                <span> {TICKET_ICONS[ticket.status]}</span>
                <h2 className="text-lg">{ticket.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={clsx("text-sm truncate", "text-slate-500", {
                  "line-through": ticket.status === "DONE",
                })}
              >
                {ticket.content}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={ticketPath(ticket.id)} className="text-sm underline">
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
