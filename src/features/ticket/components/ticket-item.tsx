"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@/generated/prisma/client";
import { ticketEditPath, ticketPath } from "@/path";
import { toCurrencyFromCents } from "@/utils/currency";
import clsx from "clsx";
import { format } from "date-fns";
import {
  LucideCalendar,
  LucideFileEdit,
  LucideLoaderCircle,
  LucideMenu,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import {
  STATUS_CLASSES,
  TICKET_ICONS,
  TICKET_STATUS_LABEL,
} from "../constants";
import TicketMoreMenu from "./ticket-more-menu";

type TicketItemProps = {
  ticket: Prisma.TicketGetPayload<{
    include: { user: { select: { name: true; image: true } } };
  }>;
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
      <Card className="w-full border-0 bg-card shadow-sm hover:shadow-md ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-x-2">
            <Avatar className="size-6 shrink-0">
              <AvatarImage
                src={ticket.user.image ?? undefined}
                alt={ticket.user.name || "User Avatar"}
              />
              <AvatarFallback className="text-xs">
                {ticket.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{ticket.user.name}</span>
            <Badge
              className={clsx(
                "ml-auto shrink-0 gap-x-1 rounded-full border-0 text-xs font-medium px-2.5",
                STATUS_CLASSES[optimisticStatus],
              )}
            >
              {isPending ? (
                <LucideLoaderCircle className="animate-spin size-3" />
              ) : (
                <>
                  {TICKET_ICONS[optimisticStatus]}
                  {TICKET_STATUS_LABEL[optimisticStatus]}
                </>
              )}
            </Badge>
          </div>
          <Separator />
          <h2 className="text-sm font-semibold leading-snug text-foreground pt-1">
            {ticket.title}
          </h2>
        </CardHeader>
        <CardContent className="pb-3">
          <p
            className={clsx("text-xs text-muted-foreground leading-relaxed", {
              "line-clamp-2": !isDetail,
            })}
          >
            {ticket.content}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 mt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-x-1">
            <LucideCalendar className="size-3" />
            {ticket.deadline
              ? format(new Date(ticket.deadline), "MMM d, yyyy")
              : "—"}
          </span>
          <span className="text-xs font-semibold text-foreground">
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
