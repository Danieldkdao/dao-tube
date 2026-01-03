import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks.mjs";
import { mux } from "@/lib/mux";
import { envServer } from "@/data/env/server";
import { db } from "@/drizzle/db";
import { VideoTable } from "@/drizzle/schema";

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    envServer.MUX_WEBHOOK_SECRET
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }

      await db
        .update(VideoTable)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(VideoTable.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0];

      if (!data.upload_id) {
        return new Response("Missing upload ID");
      }

      if (!playbackId) {
        return new Response("Missing playback ID", { status: 400 });
      }

      const thumbnailUrl = `https://image.mux.com/${playbackId.id}/thumbnail.jpg`;
      const previewUrl = `https://image.mux.com/${playbackId.id}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      await db
        .update(VideoTable)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId.id,
          muxAssetId: data.id,
          thumbnailUrl,
          previewUrl,
          duration,
        })
        .where(eq(VideoTable.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      await db
        .update(VideoTable)
        .set({ muxStatus: data.status })
        .where(eq(VideoTable.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      await db
        .delete(VideoTable)
        .where(eq(VideoTable.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing asset ID", { status: 400 });
      }

      await db
        .update(VideoTable)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(VideoTable.muxAssetId, assetId));

      break
    }
  }

  return new Response("Webhook received", { status: 200 });
};
