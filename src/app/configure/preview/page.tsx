import { db } from "@/db";
import { notFound } from "next/navigation";
import Dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const DesignPreview = Dynamic(() => import("./DesignPreview"), {
  loading: () => <Loader />,
  ssr: false,
});
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }
  return <DesignPreview configuration={configuration} />;
};

export default Page;
