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
import { cn } from "@/lib/utils";

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
    <div className="flex w-full justify-between gap-x-2">
      {prices.data.map((price) => (
        <CheckoutSessionForm
          key={price.id}
          priceId={price.id}
          organizationId={organizationId}
          activePriceId={activePriceId}
          interval={price.recurring?.interval ?? ""}
        >
          <span className="text-base font-semibold">
            {toCurrencyFromCents(price.unit_amount ?? 0)}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            / {price.recurring?.interval}
          </span>
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
    <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-4 py-10">
      {products.data.map((product) => {
        const isActiveProduct = activeProductId === product.id;

        return (
          <Card
            key={product.id}
            className={cn(
              "w-full max-w-[460px] flex flex-col relative",
              isActiveProduct && "border-2 border-primary",
            )}
          >
            {isActiveProduct && (
              <div className="absolute -top-px right-5 flex items-center gap-x-1 rounded-b-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                <LucideShieldCheck className="size-3" />
                Current plan
              </div>
            )}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
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
        );
      })}
    </div>
  );
};

export default Products;
