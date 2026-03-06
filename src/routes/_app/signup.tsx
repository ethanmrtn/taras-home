import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

export const Route = createFileRoute("/_app/signup")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || "",
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { code } = Route.useSearch();
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">(
    "loading",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) {
      setStatus("invalid");
      return;
    }
    const client = new ConvexHttpClient(convexUrl);
    client
      .query(api.functions.invites.validate, { code })
      .then((valid) => setStatus(valid ? "valid" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [code]);

  if (status === "invalid") {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4">
            Invalid invite
          </h1>
          <p className="text-muted-foreground">
            You need a valid invite link to sign up.
          </p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground font-display">
          Checking invite...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Sign up failed");
        setLoading(false);
        return;
      }

      const client = new ConvexHttpClient(convexUrl);
      await client.mutation(api.functions.invites.consume, { code, email });
      window.location.href = "/";
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex flex-col w-full max-w-sm">
        <h1 className="font-display text-5xl font-bold mb-8 text-center">
          Join Tara's home
        </h1>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
