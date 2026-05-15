"use client";

import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { ActionState } from "./to-action-state.ts";

type FormProps = {
  action: (payload: FormData) => void;
  actionState: ActionState;
  children: React.ReactNode;
};

// Module-level guard: useActionState restores the last SUCCESS/ERROR state across
// remounts (Next.js progressive enhancement), which causes prevTimestamp to
// re-initialize to the stale empty value while actionState already holds the
// restored timestamp — making isUpdate true and re-firing the toast. Tracking
// shown timestamps at module scope (survives remounts) prevents duplicates.

const shownTimestamps = new Set<number>();

const Form = ({ action, actionState, children }: FormProps) => {
  const prevTimestamp = useRef(actionState.timestamp);
  const isUpdate = prevTimestamp.current !== actionState.timestamp;

  useEffect(() => {
    if (!isUpdate) return;
    prevTimestamp.current = actionState.timestamp;
    if (shownTimestamps.has(actionState.timestamp)) return;
    shownTimestamps.add(actionState.timestamp);
    if (actionState.status === "SUCCESS") {
      toast.success(actionState.message);
    } else if (actionState.status === "ERROR" && actionState.message) {
      toast.error(actionState.message);
    }
  }, [isUpdate, actionState.status, actionState.timestamp]);

  return (
    <form action={action} className="flex flex-col gap-y-5">
      {children}
    </form>
  );
};

export default Form;
