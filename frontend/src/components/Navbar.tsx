"use client";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, User2Icon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Taskify</h1>
          </Link>

          <div className="flex items-center space-x-2">
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
                <Link href="/events">
                  <Button variant="ghost" size="sm">Events</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
