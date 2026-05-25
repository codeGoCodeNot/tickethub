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
  title?: string;
  description?: string;
  existingOrg?: { id: string; name: string };
};

const OrganizationDialog = ({
  trigger,
  title = "+ Create Organization",
  description = "Create a new organization to collaborate with your team.",
  existingOrg,
}: OrganizationCreateDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>{title}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <OrganizationCreateForm
          onSuccess={() => setOpen(false)}
          existingOrg={existingOrg}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationDialog;
