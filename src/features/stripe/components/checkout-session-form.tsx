"use client";

import Form from "@/components/form/utils/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import createCheckoutSession from "../actions/create-checkout-session";
import createCustomerPortal from "../actions/create-customer-portal";

type CheckoutSessionFormProps = {
  priceId: string;
  organizationId: string;
  children: React.ReactNode;
  activePriceId: string | undefined | null;
  interval: string;
};

const CheckoutSessionForm = ({
  priceId,
  organizationId,
  children,
  activePriceId,
  interval,
}: CheckoutSessionFormProps) => {
  const [actionState, action] = useActionState(
    !activePriceId
      ? createCheckoutSession.bind(null, organizationId, priceId)
      : createCustomerPortal.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  const isActivePrice = activePriceId === priceId;

  return (
    <div className="flex-1">
      <Form action={action} actionState={actionState}>
        <Button
          type="submit"
          disabled={isActivePrice}
          variant="outline"
          className="w-full h-auto flex flex-col items-center py-2.5"
        >
          <span className="text-xs text-muted-foreground">
            {isActivePrice ? `Current · ${interval}` : interval}
          </span>
          <div className="text-base font-semibold">{children}</div>
        </Button>
      </Form>
    </div>
  );
};

export default CheckoutSessionForm;
