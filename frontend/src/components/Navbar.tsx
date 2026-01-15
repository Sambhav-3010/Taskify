"use client";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, User2Icon, MenuIcon, XIcon, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Taskify</h1>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2"
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {user && (
              <Button variant="name" className="inline cursor-text">
                {user?.name}
              </Button>
            )}
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <User2Icon />
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            {user && (
              <>
                <Link href="/projects">
                  <Button variant="ghost" size="sm">Projects</Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm">Tasks</Button>
                </Link>
                <Link href="/calendar">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendar
                  </Button>
                </Link>
                <Link href="/notes">
                  <Button variant="ghost" size="sm">Notes</Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu content */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-4">
            {user && (
              <Button variant="name" className="inline cursor-text justify-start">
                {user?.name}
              </Button>
            )}
            <Link href="/profile">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User2Icon className="mr-2" /> Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            {user && (
              <>
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="w-full justify-start">Projects</Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="w-full justify-start">Tasks</Button>
                </Link>
                <Link href="/calendar">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </Link>
                <Link href="/notes">
                  <Button variant="ghost" size="sm" className="w-full justify-start">Notes</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
