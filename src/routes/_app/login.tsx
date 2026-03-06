import { LoginForm } from "#/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return (
    <div className="relative flex min-h-svh items-center justify-center p-6 overflow-hidden">
      {/* Decorative sticker shapes */}
      <div
        className="deco-sticker w-16 h-16 top-[12%] left-[8%]"
        style={{ background: "var(--sticker-mint)", rotate: "-12deg" }}
      />
      <div
        className="deco-sticker w-10 h-10 top-[8%] right-[15%]"
        style={{ background: "var(--sticker-yellow)", rotate: "8deg" }}
      />
      <div
        className="deco-sticker w-12 h-12 bottom-[18%] left-[12%]"
        style={{ background: "var(--sticker-blue)", rotate: "15deg" }}
      />
      <div
        className="deco-sticker w-8 h-8 bottom-[25%] right-[10%]"
        style={{ background: "var(--sticker-pink)", rotate: "-6deg" }}
      />
      <div
        className="deco-sticker w-14 h-14 top-[45%] right-[6%]"
        style={{
          background: "var(--sticker-lavender)",
          rotate: "20deg",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
      />

      {/* Star shape */}
      <svg
        className="absolute top-[20%] right-[22%] pointer-events-none"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="var(--sticker-yellow)"
        style={{
          rotate: "15deg",
          filter: "drop-shadow(0 1px 2px rgba(61,53,41,0.1))",
        }}
      >
        <path d="M14 0l3.6 10.4L28 14l-10.4 3.6L14 28l-3.6-10.4L0 14l10.4-3.6z" />
      </svg>

      {/* Heart shape */}
      <svg
        className="absolute bottom-[12%] right-[25%] pointer-events-none"
        width="24"
        height="22"
        viewBox="0 0 24 22"
        fill="var(--sticker-pink)"
        style={{
          rotate: "-10deg",
          filter: "drop-shadow(0 1px 2px rgba(61,53,41,0.1))",
        }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Sparkle */}
      <svg
        className="absolute top-[30%] left-[5%] pointer-events-none"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="var(--sticker-mint)"
        style={{
          rotate: "30deg",
          filter: "drop-shadow(0 1px 2px rgba(61,53,41,0.1))",
        }}
      >
        <path d="M10 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" />
      </svg>

      <LoginForm
        className="relative z-10 w-full max-w-sm"
        redirectTo={redirect}
      />
    </div>
  );
}
