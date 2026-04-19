import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <main className="flex h-screen overflow-hidden">

      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
}
