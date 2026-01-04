import { FormSection } from "../sections/form-section";

export const VideoView = ({ videoId }: { videoId: string }) => {
  return (
    <div className="px-4 pt-2.5 max-w-screen-5xl">
      <FormSection videoId={videoId} />
    </div>
  );
};
