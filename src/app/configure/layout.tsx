import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Steps from "@/components/Steps";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "configure",
  description: "caseCobra",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper className="flex-1 grainy-light bg-white flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

export default Layout;
