import React, { useState } from "react";
import Logo from "../../assets/Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {  Menu, Search, X } from "lucide-react";
import LoginButton from "./LoginButton";

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const location = useLocation();

  return (
    <nav className="inline-flex md:mx-10 p-5 pd-md-10 align-center justify-between  bg-transparent absolute left-0 right-0 z-100">
      <Link
        to="/"
        className="flex flex-row items-center gap-x-3 hover:cursor-pointer"
      >
        <img src={Logo} alt="StreamVibe logo" />
        <h1 className="text-secondary font-body">StreamVibe</h1>
      </Link>

      <div className="relative">
        {/* for mobile */}
        {isMobile && (
          <button onClick={toggleMenu} className="p-2 text-black">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* nav menus */}
        <NavigationMenu
          viewport={isMobile}
          className={`${
            isMobile
              ? `absolute top-full  right-0 mt-2 min-w-36   ${
                  isMenuOpen ? "block" : "hidden"
                } `
              : "block"
          }    p-2 bg-black rounded-lg text-gray-300 outline-2 outline-ring`}
        >
          <NavigationMenuList
            className={`flex ${
              isMobile ? "flex-col gap-y-2" : "flex-row gap-x-4"
            }  `}
          >
            {navbarItems.map((navItem) => (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  asChild
                  data-active={location.pathname === navItem.href}
                >
                  <NavLink
                    to={navItem.href}
                    onClick={() => isMobile && setIsMenuOpen(false)}
                  >
                    {navItem.title}
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Login/Logout */}
      {!isMobile && (
        <div className="flex flex-row items-center justify-center gap-x-5 text-secondary ">
          {/* notification and search icon */}
          <LoginButton/>
          <button>
            <Search />
          </button>
        </div>
      )}
    </nav>
  );
};

const navbarItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Movies & Shows",
    href: "/movies",
  },
  {
    title: "Support",
    href: "/support",
  },
];

export default Navbar;
