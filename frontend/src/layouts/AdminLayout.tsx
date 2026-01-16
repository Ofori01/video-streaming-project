import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
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
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

const AdminLayout: React.FC = () => {
  const [isAuthenticated, userRole] = useSelector((state: RootState) => [
    state.auth.isAuthenticated,
    state.auth.role,
  ]);

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

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
            <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-destructive/30 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4 ">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {pathSegments.map((segment, index) => {
                      // Build the URL for each breadcrumb link
                      const href = `/${pathSegments
                        .slice(0, index + 1)
                        .join("/")}`;
                      const isLast = index === pathSegments.length - 1;

                      return (
                        <React.Fragment key={href}>
                          <BreadcrumbItem>
                            {isLast ? (
                              <span className="font-bold text-primary">
                                {segment}
                              </span>
                            ) : (
                              <BreadcrumbLink href={href}>
                                {segment}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            {/* contents */}

            <div className=" mt-2 flex flex-1 flex-col gap-4 p-4 pt-0">
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
