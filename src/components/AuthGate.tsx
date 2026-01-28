"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { redirectForRole } from "@/src/lib/auth";
import { Spinner } from "@/components/ui/Spinner";

type AuthGateProps = {
  mode: "publicOnly" | "protected";
  allowedRoles?: ("ADMIN" | "TUTOR" | "STUDENT")[];
  children: React.ReactNode;
};

export function AuthGate({ mode, allowedRoles, children }: AuthGateProps) {
  const { user, token, authLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Never redirect while auth is loading
    if (authLoading) {
      return;
    }

    // Prevent multiple redirects
    if (hasRedirected.current) {
      return;
    }

    if (mode === "publicOnly") {
      // Public pages (login/register) - redirect if user is authenticated
      if (user) {
        hasRedirected.current = true;
        router.replace(redirectForRole(user.role));
        return;
      }
    } else if (mode === "protected") {
      // Protected pages - redirect if not authenticated
      const hasToken = token || (typeof window !== "undefined" && localStorage.getItem("token"));
      
      if (!hasToken || !user) {
        hasRedirected.current = true;
        router.replace("/login");
        return;
      }

      // Check role restrictions if provided
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          hasRedirected.current = true;
          router.replace(redirectForRole(user.role));
          return;
        }
      }
    }
  }, [authLoading, user, token, mode, allowedRoles, router]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} />
          <p className="text-sm text-white/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading if redirect is in progress
  if (hasRedirected.current) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} />
          <p className="text-sm text-white/70">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
