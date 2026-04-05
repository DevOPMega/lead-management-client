import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between pr-4">
          <SidebarTrigger />
          <div className="flex gap-0.5 items-center">
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
