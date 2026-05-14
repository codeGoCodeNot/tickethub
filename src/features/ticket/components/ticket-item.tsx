import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketPath } from "@/path";
import clsx from "clsx";
import { LucideSquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { TICKET_ICONS } from "../constant";
import { Ticket } from "../type";

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

  return (
    <div
      className={clsx("w-full flex gap-x-1", {
        "max-w-[580px]": isDetail,
        "max-w-[500px]": !isDetail,
      })}
    >
      <Card className="w-full hover:shadow-lg transition-shadow">
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
      </Card>
      {isDetail ? null : (
        <div className="flex flex-col gap-y-1">{detailButton}</div>
      )}
    </div>
  );
};

export default TicketItem;
