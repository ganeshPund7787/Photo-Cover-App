"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GetMyOrders } from "./actions";
import {
  BillingAddress,
  Configuration,
  OrderStatus,
  ShippingAddress,
} from "@prisma/client";
import Phone from "@/components/Phone";
import { cn } from "@/lib/utils";
import Loader from "@/components/Loader";

export type OrderType = {
  id: string;
  amount?: number;
  isPaid?: boolean;
  status?: OrderStatus;
  configuration?: Configuration;
  shippingAddressId?: string | null;
  shippingAddress?: ShippingAddress | null;
  billingAddressId?: string | null;
  billingAddress?: BillingAddress | null;
  createdAt?: Date | string;
};

const AllOrders = ({ userId }: { userId: string }) => {
  const { data: Orders, isLoading } = useQuery({
    queryKey: ["get-my-orders", userId],
    queryFn: async () => await GetMyOrders({ userId }),
    retry: 3,
  });

  if (isLoading) return <Loader />;

  if (!Orders || Orders.length === 0) {
    return (
      <div className="text-center mt-[10%]"> You Don't Have Any Order.</div>
    );
  }
  return (
    <div className="mx-5 flex flex-col gap-5 mt-5">
      <div className="">
        <h1 className="text-2xl md:text-4xl font-semibold">My Orders</h1>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {Orders &&
          Orders?.map((order: OrderType) => {
            return (
              <Card key={order.createdAt?.toString()}>
                <CardHeader className="pb-2">
                  <CardDescription>
                    Order Date:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col justify-between md:flex-row w-full">
                    <div className="md:w-[20%">
                      <Phone
                        className={cn(
                          `bg-${order.configuration?.color}`,
                          "max-w-[150px]"
                        )}
                        imgSrc={
                          order.configuration?.croppedImageUrl
                            ? order.configuration?.croppedImageUrl
                            : ""
                        }
                      />
                    </div>
                    <div className="md:w-[70%]">
                      <div className="flex flex-col gap-2">
                        <span>Order No : {order.id}</span>
                        <span>
                          Order Status:{" "}
                          <span className="text-green-700">{order.status}</span>{" "}
                        </span>
                        <span>Price: {order.amount}</span>
                        <span>
                          Payment Status:{" "}
                          {order.isPaid && (
                            <span className="text-green-700">Paid</span>
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            Shipping address
                          </p>
                          <div className="mt-2 text-zinc-700">
                            <address className="not-italic">
                              <span className="block">
                                {order.shippingAddress?.name}
                              </span>
                              <span className="block">
                                {order.shippingAddress?.street}
                              </span>
                              <span className="block">
                                {order.shippingAddress?.postalCode}{" "}
                                {order.shippingAddress?.city}
                              </span>
                            </address>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Billing address
                          </p>
                          <div className="mt-2 text-zinc-700">
                            <address className="not-italic">
                              <span className="block">
                                {order.billingAddress?.name}
                              </span>
                              <span className="block">
                                {order.billingAddress?.street}
                              </span>
                              <span className="block">
                                {order.billingAddress?.postalCode}{" "}
                                {order.billingAddress?.city}
                              </span>
                            </address>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default AllOrders;
