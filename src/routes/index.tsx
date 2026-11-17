import { createFileRoute } from "@tanstack/react-router";
import { CorteApp } from "@/corte-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CorteApp />;
}
