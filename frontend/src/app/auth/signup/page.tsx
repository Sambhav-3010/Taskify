"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../lib/firebase.client";
import Cookies from "js-cookie";
import { GoogleAuthProvider } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, displayName);
      router.push("/dashboard");
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  function handleGoogleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        console.log("Logged in user:", user);
        console.log("Display Name:", user.displayName);
        console.log("Email:", user.email);

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          Cookies.set("token", token, { expires: 7 });
        }
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Create account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start managing your events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your full name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <Button className="w-full mt-4" onClick={handleGoogleLogin}>
            <FcGoogle />
            Sign in with google
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
