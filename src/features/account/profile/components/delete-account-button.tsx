"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import deleteAccount from "../actions/delete-account";

const DeleteAccountButton = () => {
  const [open, setOpen] = useState(false);
  const [actionState, action, isPending] = useActionState(
    deleteAccount,
    EMPTY_ACTION_STATE,
  );

  useEffect(() => {
    if (actionState.status === "ERROR") {
      toast.error(actionState.message);
    }
  }, [actionState.status, actionState.timestamp]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {isPending ? (
          <Button disabled variant="destructive">
            <LucideLoaderCircle className="animate-spin" />
            Deleting...
          </Button>
        ) : (
          <Button variant="destructive" size="sm">
            Delete account
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your account and all associated data
            will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={action}>
            <AlertDialogAction
              type="submit"
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete my account
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountButton;
