import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import stripe from "@/lib/stripe/stripe";
import { toCurrencyFromCents } from "@/utils/currency";
import { LucideCheck, LucideShieldCheck } from "lucide-react";
import getStripeCustomer from "../queries/get-stripe-customer";
import CheckoutSessionForm from "./checkout-session-form";

type PricesProps = {
  productId: string;
  organizationId: string;
  activePriceId: string | undefined | null;
};

type ProductsProps = {
  organizationId: string;
};

const Prices = async ({
  productId,
  organizationId,
  activePriceId,
}: PricesProps) => {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
  });

  return (
    <div className="flex w-full justify-between gap-x-1">
      {prices.data.map((price) => (
        <CheckoutSessionForm
          key={price.id}
          priceId={price.id}
          organizationId={organizationId}
          activePriceId={activePriceId}
        >
          <span className="text-lg font-bold">
            {toCurrencyFromCents(price.unit_amount ?? 0)}
          </span>
          / <span>{price.recurring?.interval}</span>
        </CheckoutSessionForm>
      ))}
    </div>
  );
};

const Products = async ({ organizationId }: ProductsProps) => {
  const stripeCustomer = await getStripeCustomer(organizationId);

  const subscriptionStatus = stripeCustomer?.subscriptionStatus;
  const activeSubscription = subscriptionStatus === "active";
  const activeProductId = activeSubscription ? stripeCustomer?.productId : null;
  const activePriceId = activeSubscription ? stripeCustomer?.priceId : null;

  const products = await stripe.products.list({ active: true });

  return (
    <div className="flex justify-center items-stretch gap-x-4 py-10">
      {products.data.map((product) => (
        <Card key={product.id} className="w-full max-w-[460px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{product.name}</span>
              {activeProductId === product.id && <LucideShieldCheck />}
            </CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-y-2">
            {product.marketing_features.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center gap-x-2 text-sm"
              >
                <LucideCheck className="size-4 text-primary shrink-0" />
                {feature.name}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Prices
              organizationId={organizationId}
              productId={product.id}
              activePriceId={activePriceId}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Products;
