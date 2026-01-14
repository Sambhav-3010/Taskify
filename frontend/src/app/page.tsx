"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, Users, Zap, Github } from "lucide-react";
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
                Manage Events with
                <span className="text-primary block md:inline-block">
                  {" "}
                  AI Power
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Create, organize, and collaborate on events seamlessly. Let AI
                help you plan while you focus on what matters most.
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
              <Card className="p-6 text-center">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">
                    AI-Powered Creation
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  Describe your event in natural language and let AI create the
                  perfect plan with tasks and timeline.
                </CardDescription>
              </Card>

              <Card className="p-6 text-center">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">
                    Real-time Collaboration
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  See who’s online, track progress together, and collaborate
                  seamlessly with your team in real-time.
                </CardDescription>
              </Card>

              <Card className="p-6 text-center">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Calendar className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">
                    Smart Organization
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  Keep all your events organized with intelligent task
                  management and progress tracking.
                </CardDescription>
              </Card>
            </div>

            {/* CTA Section */}
            {!user && (
              <div className="text-center bg-card border border-border rounded-lg p-12 w-full max-w-2xl shadow-xl">
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  Ready to streamline your events?
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of teams already using Taskify to manage their
                  events efficiently.
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
                How to Use Taskify
              </h3>
              <div className="grid md:grid-cols-3 gap-12">
                <Card className="p-6 text-center">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <Zap className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-xl font-bold">
                      1. Create Projects
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-base">
                    Start by creating a new project for your event. Give it a
                    name and a brief description.
                  </CardDescription>
                </Card>
                <Card className="p-6 text-center">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <Users className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-xl font-bold">
                      2. Add Tasks & Events
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-base">
                    Break down your project into manageable tasks and schedule
                    important events.
                  </CardDescription>
                </Card>
                <Card className="p-6 text-center">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <Calendar className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-xl font-bold">
                      3. Track Progress
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-base">
                    Monitor the status of your tasks and events, and collaborate
                    with your team in real-time.
                  </CardDescription>
                </Card>
              </div>
            </div>
            <Card className="p-6 text-center max-w-2xl w-full">
              <CardHeader className="flex flex-col items-center p-0 mb-4">
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl font-bold">
                  Open Dashboard to Get Started
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-base flex justify-center w-full">
                {user ? (
                  <Link href="/dashboard" className="">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg w-full sm:w-auto"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signup" className="">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg"
                    >
                      Sign Up to Get Started
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
