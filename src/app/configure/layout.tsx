import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Steps from "@/components/Steps";
import { constructMetadata } from "@/lib/utils";
import { ReactNode } from "react";

export const metadata = constructMetadata({ title: "Configure" });

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper className="flex-1 grainy-light bg-white flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

export default Layout;
