"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { useActiveOrganization, useSession } from "@/lib/auth-client";
import { toCurrencyFromCents } from "@/utils/currency";
import { format } from "date-fns";
import { LucideCalendar, LucideClock, LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import approveTicket from "../actions/approve-ticket";
import TicketDeleteDialog from "./ticket-delete-dialog";

type TicketApprovalItemProps = {
  ticket: {
    id: string;
    title: string;
    content: string;
    bounty: number;
    deadline: string | null;
    user: { name: string; image: string | null };
  };
};

const TicketApprovalItem = ({ ticket }: TicketApprovalItemProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      await approveTicket(ticket.id);
      router.refresh();
    });
  };

  const { data: activeOrganization } = useActiveOrganization();
  const { data: session } = useSession();
  const user = session?.user;
  const currentUserRole = activeOrganization?.members.find(
    (member) => member.userId === user?.id,
  )?.role;

  const isOrgAdminOrOwner = ["owner", "admin"].includes(currentUserRole ?? "");

  return (
    <div className="w-full max-w-[500px] self-center">
      <Card className="w-full border-0 bg-card shadow-sm hover:shadow-md ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-x-2 mb-2">
            <UserAvatar
              name={ticket.user.name}
              image={ticket.user.image}
              className="size-6 shrink-0 text-xs"
            />
            <span className="text-sm font-medium">
              {ticket.user.name.split(" ")[0]}
            </span>
            <Badge className="shrink-0 gap-x-1 rounded-full border-0 text-xs font-medium px-2.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              <LucideClock className="size-3" />
              Pending
            </Badge>
            <div className="ml-auto flex items-center gap-x-1">
              <TicketDeleteDialog
                ticketId={ticket.id}
                title="Reject ticket"
                description="This action cannot be undone."
                isOrgAdminOrOwner={isOrgAdminOrOwner}
                type="rejected"
                trigger={
                  <Button variant="destructive" size="sm" className="ml-auto">
                    <span>Reject</span>
                  </Button>
                }
              />
              <Button size="sm" onClick={handleApprove} disabled={isPending}>
                {isPending ? (
                  <LucideLoaderCircle className="animate-spin size-3" />
                ) : (
                  "Approve"
                )}
              </Button>
            </div>
          </div>
          <Separator />
          <h2 className="text-sm font-semibold leading-snug text-foreground pt-1">
            {ticket.title}
          </h2>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {ticket.content}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 mt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-x-1">
            Deadline: <LucideCalendar className="size-3" />
            {ticket.deadline
              ? format(new Date(ticket.deadline), "MMM d, yyyy")
              : "—"}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {toCurrencyFromCents(ticket.bounty)}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketApprovalItem;
