import { LIMIT } from "@/constants";
import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const StudioPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions({
      limit: LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudioView />
    </HydrationBoundary>
  );
};

export default StudioPage;
