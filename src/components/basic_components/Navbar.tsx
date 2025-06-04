import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BellIcon,
  ClipboardIcon,
  DocumentTextIcon,
  HomeIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
} from "../../utils/Icons";

import Modal from "./Modal"; // Assuming Modal is a separate component
import type { NavItem } from "../../types/Types";


interface NavbarProp{
  notifications?:[];
  trigger?:()=>void
}

const Navbar = ({ }: NavbarProp) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state


  // Navigation items
  const navItems: NavItem[] = [
    { to: "/", title: "Dashboard", icon: HomeIcon },
    { to: "/requests", title: "Requests", icon: ClipboardIcon },
    { to: "/spend_analysys", title: "Approved", icon: DocumentTextIcon },
    { to: "/settings/user-managment", title: "Settings", icon: SettingsIcon },
  ];

  const bottomItems: NavItem[] = [
    { to: "/profile", title: "User Profile", icon: UserIcon },
  ];

  // Props type for Nav_Link
  interface NavLinkProps {
    to?: string; // optional for flexibility
    title: string;
    icon: React.ElementType; // The component type for the icon
    onClick?: () => void;
  }

  const Nav_Link: React.FC<NavLinkProps> = ({ to, title, icon: Icon, onClick }) => (
    <NavLink
      to={to || "#"} // Default to "#" if no `to` provided
      title={title}
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 text-black hover:bg-gray-200 rounded-md transition-colors duration-100"
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{title}</span>
    </NavLink>
  );

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <img src={""} alt="Logo" className="w-10 h-10" />

        {/* Menu Icon for Mobile */}
        <button
          className="p-2 rounded-md hover:bg-gray-200"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isDropdownOpen && (
        <div className="bg-white shadow-md p-4">
          {/* Navigation Links */}
          <div className="space-y-2">
            {navItems.map(({ to, title, icon }) => (
              <Nav_Link
                key={title}
                to={to}
                title={title}
                icon={icon}
                onClick={() => setIsDropdownOpen(false)}
              />
            ))}

            {/* Bottom Items */}
            <div className="border-t pt-2">
              {bottomItems.map(({ to, title, icon }) => (
                <Nav_Link
                  key={title}
                  to={to}
                  title={title}
                  icon={icon}
                  onClick={() => setIsDropdownOpen(false)}
                />
              ))}

  
            </div>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default Navbar;
