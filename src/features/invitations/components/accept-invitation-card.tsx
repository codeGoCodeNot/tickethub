"use client";

import { Button } from "@/components/ui/button";
import { organization } from "@/lib/auth-client";
import { homePath, organizationPath } from "@/path";
import { LucideBuilding2, LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  organizationName: string;
  inviterEmail: string;
};

type AcceptInvitationCardProps = {
  invitationId: string;
};

const AcceptInvitationCard = ({ invitationId }: AcceptInvitationCardProps) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    organization
      .getInvitation({ query: { id: invitationId } })
      .then(({ data }) => {
        setInvitation(data as Invitation);
        setLoading(false);
      });
  }, [invitationId]);

  const handleAccept = () => {
    startTransition(async () => {
      const { error } = await organization.acceptInvitation({ invitationId });
      if (error) {
        toast.error("Failed to accept invitation");
        return;
      }
      toast.success("Invitation accepted");
      router.push(homePath());
    });
  };

  const handleDecline = () => {
    startTransition(async () => {
      const { error } = await organization.rejectInvitation({ invitationId });
      if (error) {
        toast.error("Failed to decline invitation");
        return;
      }
      toast.success("Invitation declined");
      router.push(organizationPath());
    });
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LucideLoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Invitation not found or expired.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-y-6">
      <div className="flex flex-col items-center gap-y-4 text-center max-w-sm">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <LucideBuilding2 className="size-8" />
        </div>
        <div className="flex flex-col gap-y-1">
          <h2 className="text-2xl font-bold">You're invited!</h2>
          <p className="text-muted-foreground text-sm">
            <span className="font-medium text-foreground">{invitation.inviterEmail}</span> invited
            you to join{" "}
            <span className="font-medium text-foreground">{invitation.organizationName}</span> as{" "}
            <span className="font-medium text-foreground capitalize">{invitation.role}</span>.
          </p>
        </div>
      </div>
      <div className="flex gap-x-2">
        <Button variant="outline" onClick={handleDecline} disabled={isPending}>
          Decline
        </Button>
        <Button onClick={handleAccept} disabled={isPending}>
          {isPending && <LucideLoaderCircle className="animate-spin" />}
          Accept Invitation
        </Button>
      </div>
    </div>
  );
};

export default AcceptInvitationCard;
