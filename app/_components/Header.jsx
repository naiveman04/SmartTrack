"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/public/common";
import { usePathname } from "next/navigation"; 
import { signOut } from "next-auth/react";  

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: 1, name: "Home", url: "/dashboard/home" },
    { id: 2, name: "Sessions", url: "/dashboard/session" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-md p-4 md:px-10 flex items-center justify-between">
      {/* Logo */}
      <Link
        href="/"
        className="text-3xl font-extrabold text-darkPurple tracking-wide relative"
      >
        SmartTrack
        <span className="absolute left-0 top-full h-1 w-full bg-darkPurple scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <li key={item.id} className="relative group">
            <Link
              href={item.url}
              className={`text-lg px-5 py-2 rounded-md font-medium transition-all duration-300 ${
                pathname === item.url
                  ? "bg-faintPurple text-white font-semibold shadow-md"
                  : "text-gray-600 hover:text-darkPurple"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        {/* Logout Button */}
        <Button
          onClick={handleSignOut}
          className="ml-6 px-5 py-2 text-lg rounded-md bg-darkPurple hover:bg-darkPurple/90 transition-all duration-300"
        >
          LogOut
        </Button>
      </ul>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-darkPurple focus:outline-none"
        >
          <MenuIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-50`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-darkPurple focus:outline-none"
            >
              <CloseIcon className="w-8 h-8" />
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="mt-8 space-y-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-xl px-5 py-3 rounded-md font-medium transition-all duration-300 ${
                    pathname === item.url
                      ? "bg-faintPurple text-white font-semibold shadow-md"
                      : "text-gray-700 hover:text-darkPurple"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button in Mobile Menu */}
          <div className="mt-auto">
            <Button
              onClick={handleSignOut}
              className="w-full text-lg px-5 py-3 bg-darkPurple rounded-md hover:bg-darkPurple/90 transition-all duration-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
