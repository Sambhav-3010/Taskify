"use client";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, User2Icon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Nabar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">EventFlow</h1>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="inline cursor-text">{user?.displayName}</div>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <User2Icon />
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nabar;
