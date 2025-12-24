import React, { useState } from "react";
import Logo from "../assets/Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="flex flex-wrap md:mx-10 p-5 pd-md-10 align-center justify-between  bg-transparent absolute left-0 right-0">
      <div className="flex flex-row items-center gap-x-1">
        <img src={Logo} alt="StreamVibe logo" />
        <h1>StreamVibe</h1>
      </div>

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
          }    p-2 bg-black rounded-lg text-gray-300 outline-2 outline-slate-300`}
        >
          <NavigationMenuList
            className={`flex ${
              isMobile ? "flex-col gap-y-2" : "flex-row gap-x-4"
            }  `}
          >
            {navbarItems.map((navItem) => (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink asChild>
                  <Link
                    to={navItem.href}
                    onClick={() => isMobile && setIsMenuOpen(false)}
                  >
                    {" "}
                    {navItem.title}{" "}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {!isMobile &&<button>Get Started</button>  }
      
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
