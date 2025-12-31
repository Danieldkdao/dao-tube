import { type ReactNode } from "react";
import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

const Layout = ({ children }: { children: ReactNode }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
