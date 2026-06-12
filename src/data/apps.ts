import type { LucideIcon } from "lucide-react";
import { CalendarDays, Cloud, FileText, LayoutGrid, Mail } from "lucide-react";

export type AppStatus = "available" | "installed" | "update" | "coming-soon";
export type ReleaseChannel = "stable" | "beta";

export type LauncherApp = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: AppStatus;
  version: string;
  repositoryUrl: string;
  downloadUrl: string | null;
  releaseChannel: ReleaseChannel;
  installed: boolean;
  updateAvailable: boolean;
  comingSoon: boolean;
  size?: string;
  lastUpdated?: string;
};

export const launcherApps: LauncherApp[] = [
  {
    id: "lunamail",
    name: "LunaMail",
    description: "E-Mails einfach, sicher und fokussiert verwalten.",
    icon: Mail,
    status: "update",
    version: "v1.0.0",
    repositoryUrl: "https://github.com/Emiciano/LunaMail",
    downloadUrl: "https://github.com/Emiciano/LunaMail/releases/latest",
    releaseChannel: "stable",
    installed: true,
    updateAvailable: true,
    comingSoon: false,
    size: "84,3 MB",
    lastUpdated: "Heute, 01:24"
  },
  {
    id: "lunaworkspace",
    name: "LunaWorkspace",
    description: "Projekte und Teams an einem ruhigen Ort organisieren.",
    icon: LayoutGrid,
    status: "coming-soon",
    version: "Noch nicht verfügbar",
    repositoryUrl: "https://github.com/Emiciano/LunaWorkspace",
    downloadUrl: null,
    releaseChannel: "stable",
    installed: false,
    updateAvailable: false,
    comingSoon: true
  },
  {
    id: "lunanotes",
    name: "LunaNotes",
    description: "Notizen, Gedanken und Ideen ohne Ablenkung festhalten.",
    icon: FileText,
    status: "coming-soon",
    version: "Noch nicht verfügbar",
    repositoryUrl: "https://github.com/Emiciano/LunaNotes",
    downloadUrl: null,
    releaseChannel: "stable",
    installed: false,
    updateAvailable: false,
    comingSoon: true
  },
  {
    id: "lunadrive",
    name: "LunaDrive",
    description: "Dateien sicher speichern, teilen und überall öffnen.",
    icon: Cloud,
    status: "coming-soon",
    version: "Noch nicht verfügbar",
    repositoryUrl: "https://github.com/Emiciano/LunaDrive",
    downloadUrl: null,
    releaseChannel: "stable",
    installed: false,
    updateAvailable: false,
    comingSoon: true
  },
  {
    id: "lunacalendar",
    name: "LunaCalendar",
    description: "Termine, Fokuszeit und Aufgaben im Blick behalten.",
    icon: CalendarDays,
    status: "coming-soon",
    version: "Noch nicht verfügbar",
    repositoryUrl: "https://github.com/Emiciano/LunaCalendar",
    downloadUrl: null,
    releaseChannel: "stable",
    installed: false,
    updateAvailable: false,
    comingSoon: true
  }
];

export const updateHistory = [
  { version: "LunaMail v1.0.1", note: "Sicherheitsupdate vorbereitet", date: "Heute" },
  { version: "LunaMail v1.0.0", note: "Erste stabile Version installiert", date: "11. Juni 2026" },
  { version: "Launcher v0.1.0", note: "Zentrale App-Verwaltung eingerichtet", date: "10. Juni 2026" }
];
