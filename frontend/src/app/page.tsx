"use client"

import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Manage Events with
            <span className="text-primary"> AI Power</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, organize, and collaborate on events seamlessly. Let AI help you plan while you focus on what matters
            most.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI-Powered Creation</CardTitle>
              <CardDescription>
                Describe your event in natural language and let AI create the perfect plan with tasks and timeline.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>
                See who&rsquo;s online, track progress together, and collaborate seamlessly with your team in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Keep all your events organized with intelligent task management and progress tracking.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="text-center bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to streamline your events?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of teams already using EventFlow to manage their events efficiently.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
