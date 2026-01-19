"use client";

import * as React from "react";
import {
  Settings2,
  TvMinimalPlay,
} from "lucide-react";
import Logo from '../assets/Logo.svg'
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "@/store/store";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Movies",
      url: "#",
      icon: TvMinimalPlay,
      isActive: true,
      items: [
        {
          title: "All",
          url: "/admin/movies",
        },
        {
          title: "Create",
          url: "/admin/movies/add",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Profile",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {email,name } = useSelector((state: RootState)=> ({name: state.auth.username, email: state.auth.email, }), shallowEqual)
  const avatar = "/avatars/shadcn.jpg"
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src={Logo} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Stream Vibe</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{avatar, email, name}} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
