"use client";

import Form from "@/components/form/utils/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import createCheckoutSession from "../actions/create-checkout-session";

type CheckoutSessionFormProps = {
  priceId: string;
  organizationId: string;
  children: React.ReactNode;
  activePriceId: string | undefined | null;
};

const CheckoutSessionForm = ({
  priceId,
  organizationId,
  children,
  activePriceId,
}: CheckoutSessionFormProps) => {
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, organizationId, priceId),
    EMPTY_ACTION_STATE,
  );

  const isActivePrice = activePriceId === priceId;

  return (
    <div className="flex-1">
      <Form action={action} actionState={actionState}>
        <Button
          type="submit"
          disabled={isActivePrice}
          className="w-full h-16 flex flex-col"
        >
          {isActivePrice ? <span>Current Plan</span> : <span>Other Plan</span>}
          <div>{children}</div>
        </Button>
      </Form>
    </div>
  );
};

export default CheckoutSessionForm;
