import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_authenticated/")({ component: App });

function App() {
  return <main className="page-wrap"></main>;
}
