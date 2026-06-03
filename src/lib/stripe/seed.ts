import prisma from "../prisma";
import stripe from "./stripe";

const seed = async () => {
  const t0 = performance.now();
  console.log("Seeding Stripe data...");

  //   clean up

  const prices = await stripe.prices.list();
  const products = await stripe.products.list();
  const customers = await stripe.customers.list();

  await prisma.stripeCustomer.deleteMany();

  for (const price of prices.data) {
    await stripe.prices.update(price.id, { active: false });
  }

  for (const product of products.data) {
    await stripe.products.update(product.id, { active: false });
  }

  for (const customer of customers.data) {
    await stripe.customers.del(customer.id);
  }

  //   seed

  const organization = await prisma.organization.findFirstOrThrow({
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  const customer = await stripe.customers.create({
    name: organization.name,
    email: organization.members[0].user.email,
  });

  await prisma.stripeCustomer.create({
    data: {
      customerId: customer.id,
      organizationId: organization.id,
    },
  });

  const businessPlan = await stripe.products.create({
    name: "Business Plan",
    description: "The Business Plan",
    metadata: {
      allowedTeamMembers: "unlimited",
    },
    marketing_features: [
      {
        name: "Cancel anytime",
      },
      {
        name: "Unlimited team members",
      },
    ],
  });

  const startUpPlan = await stripe.products.create({
    name: "Start-Up Plan",
    description: "The Start-Up Plan",
    metadata: {
      allowedTeamMembers: "3",
    },
    marketing_features: [
      {
        name: "Cancel anytime",
      },
      {
        name: "Up to 3 team members",
      },
    ],
  });

  await stripe.prices.create({
    product: startUpPlan.id,
    unit_amount: 19999,
    currency: "usd",
    recurring: {
      interval: "year",
    },
  });

  await stripe.prices.create({
    product: startUpPlan.id,
    unit_amount: 1999,
    currency: "usd",
    recurring: {
      interval: "month",
    },
  });

  await stripe.prices.create({
    product: businessPlan.id,
    unit_amount: 39999,
    currency: "usd",
    recurring: {
      interval: "year",
    },
  });

  await stripe.prices.create({
    product: businessPlan.id,
    unit_amount: 3999,
    currency: "usd",
    recurring: {
      interval: "month",
    },
  });

  const t1 = performance.now();
  console.log(`Stripe data seeded in ${(t1 - t0).toFixed(2)} milliseconds.`);
};

seed();
