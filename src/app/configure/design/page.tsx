import { db } from "@/db";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const DesignConfigurator = dynamic(() => import("./DesignConfigurator"), {
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

  const { height, width, imageUrl } = configuration;

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageUrl={imageUrl}
      imageDimensions={{ height, width }}
    />
  );
};

export default Page;
