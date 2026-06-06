// import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_SECREATE_KEY ?? "", {
//   apiVersion: "2024-09-30.acacia",
//   typescript: true,
// });

import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECREATE_KEY;
    if (!key) throw new Error("STRIPE_SECREATE_KEY is not set");
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-09-30.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}
