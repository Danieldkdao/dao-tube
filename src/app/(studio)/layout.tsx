import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
