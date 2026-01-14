"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, FolderOpen, CheckSquare, Github } from "lucide-react";
import Link from "next/link";
import LandingPageSkeleton from "@/components/landing-page-skeleton";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <>
      {loading ? (
        <LandingPageSkeleton />
      ) : (
        <div className="bg-background pt-[80px] flex flex-col min-h-screen">
          <main className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center items-center">
            <div className="text-center mb-24 max-w-4xl">
              <h2 className="text-5xl md:text-7xl font-extrabold text-foreground mb-8 leading-tight">
                Organize Your Tasks
                <span className="text-primary block md:inline-block">
                  {" "}
                  With Ease
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Create projects, manage tasks, and track deadlines.
                Export to Google Calendar and stay on top of your schedule.
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg w-full sm:w-auto"
                    >
                      Get Started Free
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg w-full sm:w-auto bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-12 mb-24 w-full max-w-6xl">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <FolderOpen className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">
                    Project Organization
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  Group related tasks into projects. Keep everything organized
                  and easy to find.
                </CardDescription>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <CheckSquare className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">
                    Task Management
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  Create tasks with priorities, deadlines, and status tracking.
                  Never miss a deadline again.
                </CardDescription>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Calendar className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">
                    Calendar Integration
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  View tasks on a calendar and export to Google Calendar with
                  one click.
                </CardDescription>
              </Card>
            </div>

            {/* CTA Section */}
            {!user && (
              <div className="text-center bg-card border border-border rounded-lg p-12 w-full max-w-2xl shadow-xl">
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  Ready to get organized?
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Start managing your projects and tasks today. It&apos;s free!
                </p>
                <Link href="/auth/signup">
                  <Button size="lg" className="px-10 py-5 text-xl">
                    Start Using Taskify
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}

            {/* How to Use Section */}
            <div className="w-full max-w-6xl my-24 text-center">
              <h3 className="text-4xl font-bold text-foreground mb-12">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-12">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                      1
                    </div>
                    <CardTitle className="text-xl font-bold">
                      Create Projects
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-base">
                    Start by creating a new project to organize your work.
                    Give it a name and description.
                  </CardDescription>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                      2
                    </div>
                    <CardTitle className="text-xl font-bold">
                      Add Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-base">
                    Break down your project into tasks. Set priorities
                    and deadlines to stay on track.
                  </CardDescription>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                      3
                    </div>
                    <CardTitle className="text-xl font-bold">
                      Track & Export
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-base">
                    Track progress on the calendar view and export tasks
                    to Google Calendar.
                  </CardDescription>
                </Card>
              </div>
            </div>

            <Card className="p-6 text-center max-w-2xl w-full hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center p-0 mb-4">
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl font-bold">
                  {user ? "Go to Dashboard" : "Get Started Now"}
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-base flex justify-center w-full">
                {user ? (
                  <Link href="/dashboard" className="">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg w-full sm:w-auto"
                    >
                      Open Dashboard
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signup" className="">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg"
                    >
                      Sign Up Free
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </CardDescription>
            </Card>
          </main>
          <footer className="w-full bg-card border-t border-border py-4 text-center text-muted-foreground">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
              <p className="mb-4 sm:mb-0">
                &copy; {new Date().getFullYear()} Taskify. Made by Sambhav.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/Sambhav-3010"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
