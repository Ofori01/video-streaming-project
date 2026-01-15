import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { RootState } from "@/store/store";
import { USER_ROLE } from "@/types/User";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const AdminLayout: React.FC = () => {
  const [isAuthenticated, userRole] = useSelector((state: RootState) => [
    state.auth.isAuthenticated,
    state.auth.role,
  ]);

  return (
    <div className="relative">
      <main>
        <Toaster position="top-right" />
        {/* {isAuthenticated ? (
          userRole === USER_ROLE.USER ? (
            <Navigate to="/" />
          ) : (
            <Outlet />
          )
        ) : (
          <Navigate to="/login" />
        )} */}
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
            </div>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
};

export default AdminLayout;
