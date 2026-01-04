"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModal = () => {
  const router = useRouter();
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

  const onSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon className="animate-spin size-24" />
        )}
      </ResponsiveModal>
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
    </>
  );
};
