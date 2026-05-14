"use client";

import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { ActionState } from "./to-action-state.ts";

type FormProps = {
  action: (payload: FormData) => void;
  actionState: ActionState;
  children: React.ReactNode;
};

const Form = ({ action, actionState, children }: FormProps) => {
  const prevTimestamp = useRef(actionState.timestamp);
  const isUpdate = prevTimestamp.current !== actionState.timestamp;

  useEffect(() => {
    if (!isUpdate) return;
    if (actionState.status === "SUCCESS") {
      toast.success(actionState.message);
    } else if (actionState.status === "ERROR" && actionState.message) {
      toast.error(actionState.message);
    }
    prevTimestamp.current = actionState.timestamp;
  }, [isUpdate, actionState.status, actionState.timestamp]);

  return (
    <form action={action} className="flex flex-col gap-y-5">
      {children}
    </form>
  );
};

export default Form;
