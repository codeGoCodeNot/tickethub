"use client";

import Form from "@/components/form/utils/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import createCheckoutSession from "../actions/create-checkout-session";
import createCustomerPortal from "../actions/create-customer-portal";

type CustomerPortalFormProps = {
  organizationId: string;
  children: React.ReactNode;
};

const CustomerPortalForm = ({
  organizationId,
  children,
}: CustomerPortalFormProps) => {
  const [actionState, action] = useActionState(
    createCustomerPortal.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit">{children}</Button>
    </Form>
  );
};

export default CustomerPortalForm;
