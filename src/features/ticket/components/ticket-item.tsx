"use client";

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
import { toCurrencyFromCents } from "@/utils/currency";
import clsx from "clsx";
import { format } from "date-fns";
import {
  LucideFileEdit,
  LucideLoaderCircle,
  LucideMenu,
  LucideSquareArrowOutUpRight,
  LucideTrash2,
} from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import deleteTicket from "../actions/delete-ticket";
import { STATUS_CLASSES, TICKET_ICONS } from "../constants";
import TicketMoreMenu from "./ticket-more-menu";
import { TICKET_STATUS_LABEL } from "../constants";
import { Badge } from "@/components/ui/badge";

type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(ticket.status);
  const [isPending, startTransition] = useTransition();

  const detailButton = (
    <Button variant="outline" size="icon" asChild>
      <Link href={ticketPath(ticket.id)} className="text-sm underline">
        <LucideSquareArrowOutUpRight />
      </Link>
    </Button>
  );

  const editButton = (
    <Button variant="outline" size="icon" asChild>
      <Link href={ticketEditPath(ticket.id)} className="text-sm underline">
        <LucideFileEdit className="h-4 w-4" />
      </Link>
    </Button>
  );

  const moreMenu = (
    <TicketMoreMenu
      ticket={ticket}
      optimisticStatus={optimisticStatus}
      onOptimisticStatusChange={setOptimisticStatus}
      onStartTransition={startTransition}
      trigger={
        <Button variant="outline" size="icon">
          <LucideMenu />
        </Button>
      }
    />
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
            <div className="flex items-center gap-x-1 shrink-0">
              <Badge
                variant="secondary"
                className={clsx(
                  "gap-x-1 rounded-sm border-0 text-xs font-medium",
                  STATUS_CLASSES[optimisticStatus],
                )}
              >
                {isPending ? (
                  <LucideLoaderCircle className="animate-spin" />
                ) : (
                  <>
                    {TICKET_ICONS[optimisticStatus]}
                    {TICKET_STATUS_LABEL[optimisticStatus]}
                  </>
                )}
              </Badge>
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
          <span className="text-muted-foreground">
            {ticket.deadline
              ? format(new Date(ticket.deadline), "MMM d, yyyy")
              : ""}
          </span>
          <span className="text-muted-foreground font-medium">
            {toCurrencyFromCents(ticket.bounty)}
          </span>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-y-1">
        {isDetail ? (
          <>
            {moreMenu}
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
