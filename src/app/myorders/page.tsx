import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import AllOrders from "./AllOrders";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return notFound();
  }

  return (
    <MaxWidthWrapper className="flex-1 grainy-light bg-white flex flex-col">
      <AllOrders userId={user?.id} />
    </MaxWidthWrapper>
  );
};

export default Page;
