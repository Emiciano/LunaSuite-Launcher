import {
  CalendarDays,
  ChevronDown,
  Cloud,
  Download,
  FileText,
  HelpCircle,
  Home,
  LayoutGrid,
  Mail,
  Moon,
  PackageCheck,
  RefreshCw,
  Settings,
  X
} from "lucide-react";

export type NavigationId = "overview" | "apps" | "updates" | "downloads" | "settings" | "support";

type Props = {
  active: NavigationId;
  open: boolean;
  onNavigate: (id: NavigationId) => void;
  onClose: () => void;
};

const primaryNav = [
  { id: "overview" as const, label: "Übersicht", icon: Home },
  { id: "apps" as const, label: "Meine Apps", icon: PackageCheck },
  { id: "updates" as const, label: "Updates", icon: RefreshCw },
  { id: "downloads" as const, label: "Downloads", icon: Download }
];

const apps = [
  { label: "LunaMail", icon: Mail, active: true },
  { label: "LunaWorkspace", icon: LayoutGrid },
  { label: "LunaNotes", icon: FileText },
  { label: "LunaDrive", icon: Cloud },
  { label: "LunaCalendar", icon: CalendarDays }
];

export function Sidebar({ active, open, onNavigate, onClose }: Props) {
  function navigate(id: NavigationId) {
    onNavigate(id);
    onClose();
  }

  return (
    <>
      {open ? <button className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Navigation schließen" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col border-r border-white/[0.08] bg-[#09090a] px-5 py-6 transition-transform duration-200 lg:static lg:z-auto lg:w-[318px] lg:translate-x-0 lg:px-6 lg:py-7 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <button className="flex items-center gap-3" onClick={() => navigate("overview")}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black">
              <Moon size={23} fill="currentColor" />
            </span>
            <span className="text-xl font-semibold tracking-[-0.04em]">LunaSuite</span>
          </button>
          <button className="text-white/45 lg:hidden" onClick={onClose} aria-label="Navigation schließen">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {primaryNav.map((item) => (
            <NavButton key={item.id} active={active === item.id} label={item.label} icon={item.icon} onClick={() => navigate(item.id)} />
          ))}
        </nav>

        <div className="mt-8 px-3 text-xs font-medium uppercase tracking-[0.14em] text-white/28">Apps</div>
        <div className="mt-3 space-y-1">
          {apps.map((app) => (
            <button
              key={app.label}
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-white/55 transition hover:bg-white/[0.045] hover:text-white"
              onClick={() => navigate("apps")}
            >
              <app.icon size={17} strokeWidth={1.7} />
              <span className="flex-1">{app.label}</span>
              {!app.active ? <span className="h-1.5 w-1.5 rounded-full bg-white/20" /> : null}
            </button>
          ))}
        </div>

        <div className="mt-auto border-t border-white/[0.08] pt-5">
          <NavButton active={active === "settings"} label="Einstellungen" icon={Settings} onClick={() => navigate("settings")} />
          <NavButton active={active === "support"} label="Hilfe & Support" icon={HelpCircle} onClick={() => navigate("support")} />

          <button className="mt-5 flex w-full items-center gap-3 border-t border-white/[0.08] px-2 pt-5 text-left">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-sm font-medium">AM</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">Alex Müller</span>
              <span className="mt-0.5 block truncate text-xs text-white/38">alex@lunasuite.de</span>
            </span>
            <ChevronDown size={15} className="text-white/42" />
          </button>
        </div>
      </aside>
    </>
  );
}

function NavButton({
  active,
  label,
  icon: Icon,
  onClick
}: {
  active: boolean;
  label: string;
  icon: typeof Home;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition ${
        active ? "border border-white/[0.08] bg-white/[0.09] text-white" : "border border-transparent text-white/58 hover:bg-white/[0.045] hover:text-white"
      }`}
      onClick={onClick}
    >
      <Icon size={18} strokeWidth={1.75} />
      {label}
    </button>
  );
}
