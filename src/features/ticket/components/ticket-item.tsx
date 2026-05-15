import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket } from "@/generated/prisma/client";
import { ticketEditPath, ticketPath } from "@/path";
import clsx from "clsx";
import {
  LucideCurrency,
  LucideFileEdit,
  LucideSquareArrowOutUpRight,
  LucideTrash2,
} from "lucide-react";
import Link from "next/link";
import deleteTicket from "../actions/delete-ticket";
import { TICKET_ICONS } from "../constants";
import { toCurrencyFromCents } from "@/utils/currency";

type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const detailButton = (
    <Button variant="outline" size="icon" asChild>
      <Link href={ticketPath(ticket.id)} className="text-sm underline">
        <LucideSquareArrowOutUpRight />
      </Link>
    </Button>
  );

  const deleteButton = (
    <form action={deleteTicket.bind(null, ticket.id)}>
      <Button variant="destructive" size="icon">
        <LucideTrash2 className="h-4 w-4" />
      </Button>
    </form>
  );

  const editButton = (
    <Button variant="outline" size="icon" asChild>
      <Link href={ticketEditPath(ticket.id)} className="text-sm underline">
        <LucideFileEdit className="h-4 w-4" />
      </Link>
    </Button>
  );

  return (
    <div
      className={clsx("w-full flex gap-x-1", {
        "max-w-[580px]": isDetail,
        "max-w-[500px]": !isDetail,
      })}
    >
      <Card className="w-full border hover:border-primary hover:shadow-lg hover:bg-accent/50 transition-all">
        <CardHeader>
          <CardTitle>
            <div className="flex gap-x-1 items-center">
              <span> {TICKET_ICONS[ticket.status]}</span>
              <h2 className="text-lg">{ticket.title}</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span
            className={clsx("whitespace-break-spaces", {
              "line-clamp-3": !isDetail,
            })}
          >
            {ticket.content}
          </span>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-muted-foreground">{ticket.deadline}</span>
          <span className="text-muted-foreground font-medium">
            {toCurrencyFromCents(ticket.bounty)}
          </span>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-y-1">
        {isDetail ? (
          <>
            {deleteButton}
            {editButton}
          </>
        ) : (
          <>
            {editButton}
            {detailButton}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
