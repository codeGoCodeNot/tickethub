"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type ChangeNameDialogProps = {
  currentName: string;
};

const ChangeNameDialog = ({ currentName }: ChangeNameDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const reset = () => setName(currentName);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const toastId = toast.loading("Updating name...");
      const { error } = await updateUser({ name });
      if (error) {
        toast.error(error.message ?? "Failed to update name.", { id: toastId });
        return;
      }
      router.refresh();
      toast.success("Name updated", { id: toastId });
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(prev) => {
        setOpen(prev);
        if (!prev) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="link" size="sm" className="h-auto p-0">
          Change name
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>Update your display name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="change-name">Name</Label>
            <Input
              id="change-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !name.trim() || name === currentName}
            >
              {isPending && <LucideLoaderCircle className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeNameDialog;
