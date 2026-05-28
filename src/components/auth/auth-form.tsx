"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { AlertCircle, CheckCircle2, Loader2, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeAppRedirect } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/client";
import { authCredentialsSchema } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";
type NoticeTone = "error" | "success" | "info";

type AuthFormProps = {
  authUnavailable: boolean;
  initialNotice?: {
    tone: NoticeTone;
    message: string;
  };
  redirectTo: string;
};

const modeCopy = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to access your protected PersonaVault workspace.",
    button: "Sign in",
    loading: "Signing in",
  },
  "sign-up": {
    title: "Create your account",
    description: "Start with Supabase email/password auth. Profile setup comes next.",
    button: "Create account",
    loading: "Creating account",
  },
} satisfies Record<AuthMode, Record<"title" | "description" | "button" | "loading", string>>;

export function AuthForm({ authUnavailable, initialNotice, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(initialNotice);

  const safeRedirectTo = useMemo(() => getSafeAppRedirect(redirectTo), [redirectTo]);
  const copy = modeCopy[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (authUnavailable) {
      setNotice({
        tone: "error",
        message: "Supabase Auth is not configured yet. Add your project URL and anon key first.",
      });
      return;
    }

    const parsed = authCredentialsSchema.safeParse({ email, password });

    if (!parsed.success) {
      setNotice({
        tone: "error",
        message: parsed.error.issues[0]?.message ?? "Check your email and password.",
      });
      return;
    }

    setIsLoading(true);
    setNotice(undefined);

    const supabase = createClient();

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);

      if (error) {
        setNotice({ tone: "error", message: error.message });
        setIsLoading(false);
        return;
      }

      setNotice({ tone: "success", message: "Signed in. Opening your workspace..." });
      router.refresh();
      router.push(safeRedirectTo as Route);
      return;
    }

    const emailRedirectTo = new URL("/auth/callback", window.location.origin);
    emailRedirectTo.searchParams.set("next", safeRedirectTo);

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: emailRedirectTo.toString(),
      },
    });

    if (error) {
      setNotice({ tone: "error", message: error.message });
      setIsLoading(false);
      return;
    }

    if (data.session) {
      setNotice({ tone: "success", message: "Account created. Opening your workspace..." });
      router.refresh();
      router.push(safeRedirectTo as Route);
      return;
    }

    setNotice({
      tone: "success",
      message: "Account created. Check your email to confirm your sign-up before signing in.",
    });
    setPassword("");
    setIsLoading(false);
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice(initialNotice);
    setPassword("");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4">
        <div className="grid grid-cols-2 rounded-md border bg-muted p-1">
          {(["sign-in", "sign-up"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                "rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                mode === item && "bg-white text-foreground shadow-sm",
              )}
              onClick={() => switchMode(item)}
            >
              {item === "sign-in" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {notice ? (
            <div
              className={cn(
                "flex gap-3 rounded-md border p-3 text-sm",
                notice.tone === "error" && "border-red-200 bg-red-50 text-red-800",
                notice.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
                notice.tone === "info" && "border-blue-200 bg-blue-50 text-blue-800",
              )}
              role={notice.tone === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {notice.tone === "error" ? (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{notice.message}</span>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-9"
                disabled={isLoading || authUnavailable}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-9"
                disabled={isLoading || authUnavailable}
              />
            </div>
          </div>

          <Button className="w-full" disabled={isLoading || authUnavailable}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {copy.loading}
              </>
            ) : (
              copy.button
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
