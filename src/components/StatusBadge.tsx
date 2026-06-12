import type { AppStatus } from "../data/apps";

const labels: Record<AppStatus, string> = {
  available: "Verfügbar",
  installed: "Installiert",
  update: "Update verfügbar",
  "coming-soon": "Coming Soon"
};

export function StatusBadge({ status }: { status: AppStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        status === "update"
          ? "border-white/20 bg-white text-black"
          : status === "available" || status === "installed"
            ? "border-white/14 bg-white/[0.08] text-white"
            : "border-white/[0.07] bg-white/[0.025] text-white/42"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === "update" ? "bg-black" : "bg-current"}`} />
      {labels[status]}
    </span>
  );
}
