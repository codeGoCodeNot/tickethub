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
import OrganizationCreateForm from "./organization-create-form";

type OrganizationCreateDialogProps = {
  trigger?: React.ReactNode;
};

const OrganizationCreateDialog = ({
  trigger,
}: OrganizationCreateDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>+ Create Organization</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization for your team.
          </DialogDescription>
        </DialogHeader>
        <OrganizationCreateForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationCreateDialog;
