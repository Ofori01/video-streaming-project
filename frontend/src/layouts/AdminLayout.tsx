import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="relative scroll-smooth">
      <main>
        <Toaster position="top-right" />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 fixed bg-transparent backdrop-blur-3xl w-full z-9999">
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
                              <NavLink
                                data-slot="breadcrumb-link"
                                className="hover:text-foreground transition-colors"
                                viewTransition={true}
                                to={href}
                              >
                                {segment}
                              </NavLink>
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
            <div className="pt-16 group-has-data-[collapsible=icon]/sidebar-wrapper:pt-12 transition-all ease-linear">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
};

export default AdminLayout;
