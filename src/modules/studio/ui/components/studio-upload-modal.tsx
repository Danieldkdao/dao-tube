"use client";

import { Button } from "@/components/ui/button";
import { LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.video.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryOptions({ limit: LIMIT })
        );
        toast.success("Video created successfully!");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Create
    </Button>
  );
};
