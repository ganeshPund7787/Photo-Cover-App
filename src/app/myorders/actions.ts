"use server";

import { db } from "@/db";

export const GetMyOrders = async ({ userId }: { userId: string }) => {
  if (!userId) return [];

  const orders = await db.order.findMany({
    where: { userId },
    include: {
      configuration: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!orders || orders.length === 0) {
    return [];
  }

  orders.forEach((order) => {
    console.log(`Order ID: ${order.id}`);
    console.log(`Configuration: ${order.configuration.croppedImageUrl}`);
    console.log(`Shipping Address: ${order.shippingAddress?.country}`);
    console.log(`Billing Address: ${order.billingAddress?.city}`);
  });

  return orders;
};

export const GetConfiguration = async ({
  configurationId,
}: {
  configurationId: string;
}) => {
  const configuration = await db.configuration.findFirst({
    where: { id: configurationId },
  });
  return configuration;
};
