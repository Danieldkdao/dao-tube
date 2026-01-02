import { HomeView } from "@/modules/home/ui/views/home-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) => {
  const { categoryId } = await searchParams;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView categoryId={categoryId} />
    </HydrationBoundary>
  );
};

export default HomePage;
