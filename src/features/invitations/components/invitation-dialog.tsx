"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import InvitationCreateForm from "./invitation-create-form";

type InvitationDialogProps = {
  trigger?: React.ReactNode;
  organizationId: string;
  allowedTeamMembers: number;
  currentTeamMembers: number;
};

const InvitationDialog = ({
  trigger,
  organizationId,
  allowedTeamMembers,
  currentTeamMembers,
}: InvitationDialogProps & {
  allowedTeamMembers: number;
  currentTeamMembers: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>+ Invite Member</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization.
          </DialogDescription>
        </DialogHeader>
        <InvitationCreateForm
          organizationId={organizationId}
          onSuccess={() => setOpen(false)}
          allowedTeamMembers={allowedTeamMembers}
          currentTeamMembers={currentTeamMembers}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvitationDialog;
