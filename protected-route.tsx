import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#0F0F23]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-cyan-400 font-orbitron">Accessing Protocol...</p>
          </div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Component />;
}