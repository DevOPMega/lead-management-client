import {
  BarChart2,
  ChevronRight,
  ChevronUp,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Settings,
  Trophy,
  User2,
  Users,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Home,
  },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: RefreshCw, label: "Follow-ups" },
  { icon: Trophy, label: "Deals" },
  { icon: FileText, label: "Policies" },
  { icon: BarChart2, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const navigate = useNavigate()


  return (
    <aside className={`${sidebarOpen ? "w-56" : "w-16"} flex-shrink-0 transition-all duration-300 flex flex-col`}
      style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(18px)", borderRight: "1px solid rgba(255,255,255,0.7)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 38 38" fill="none">
            <circle cx="9" cy="9" r="4" fill="white" />
            <circle cx="19" cy="9" r="4" fill="white" />
            <circle cx="29" cy="9" r="4" fill="white" />
            <circle cx="9" cy="22" r="4" fill="rgba(255,255,255,0.6)" />
            <circle cx="19" cy="22" r="4" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
        {sidebarOpen && (
          <span className="text-base font-bold text-gray-800 tracking-tight">
            e<span className="text-violet-600">Sanad</span>
          </span>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-400 hover:text-violet-600 transition-colors">
          {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ icon: Icon, label }) => {
          const isActive = activeNav === label;
          return (
            <button key={label} onClick={() => {
              setActiveNav(label);
              navigate(`/${label.toLowerCase()}`);
            }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                  ${isActive ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-200" : "text-gray-600 hover:bg-white/60 hover:text-violet-700"}`}>
              <Icon size={17} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && isActive && <ChevronRight size={13} className="ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/50">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50/60 transition-all text-sm">
          <LogOut size={16} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )

  // return (
  //   <Sidebar variant="floating" collapsible="icon">
  //     <SidebarContent>
  //       <SidebarGroup>
  //         <SidebarGroupLabel>Application</SidebarGroupLabel>
  //         <SidebarGroupContent>
  //           <SidebarMenu>
  //             {items.map((item) => 
  //                 <SidebarMenuItem key={item.title}>
  //                   <SidebarMenuButton asChild>
  //                     <Link to={item.url}>
  //                       <item.icon />
  //                       <span>{item.title}</span>
  //                     </Link>
  //                   </SidebarMenuButton>
  //                 </SidebarMenuItem>
  //               )
  //             }
  //           </SidebarMenu>
  //         </SidebarGroupContent>
  //       </SidebarGroup>
  //     </SidebarContent>
  //     <SidebarFooter>
  //       <SidebarMenu>
  //         <SidebarMenuItem>
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <SidebarMenuButton>
  //                 {/* <User2 /> {user.name || user.email} */}
  //                 <User2 /> Akash Gupta
  //                 <ChevronUp className="ml-auto" />
  //               </SidebarMenuButton>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent
  //               side="top"
  //               className="w-[--radix-popper-anchor-width]"
  //             >
  //               <DropdownMenuItem>
  //                 <span>Account</span>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem>
  //                 <span>Billing</span>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem>
  //                 <span>Sign out</span>
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </SidebarMenuItem>
  //       </SidebarMenu>
  //     </SidebarFooter>
  //   </Sidebar>
  // );
}
