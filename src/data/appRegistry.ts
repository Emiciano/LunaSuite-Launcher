import { CalendarDays, FileText, LayoutGrid, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AppStatus = "available" | "installed" | "update" | "coming-soon";
export type ReleaseChannel = "stable" | "beta";
export type AppIconName = "mail" | "workspace" | "notes" | "calendar";

export type LauncherApp = {
  id: string;
  name: string;
  description: string;
  icon: AppIconName;
  iconPath: string;
  status: AppStatus;
  version: string;
  latestVersion: string;
  installed: boolean;
  updateAvailable: boolean;
  comingSoon: boolean;
  githubRepo: string;
  githubReleases: string;
  releaseNotes: string;
  releaseChannel: ReleaseChannel;
  downloadUrl: string | null;
  size?: string;
  lastUpdated?: string;
};

export const appIcons: Record<AppIconName, LucideIcon> = {
  mail: Mail,
  workspace: LayoutGrid,
  notes: FileText,
  calendar: CalendarDays
};

export const appRegistry: LauncherApp[] = [
  {
    id: "lunamail",
    name: "LunaMail",
    description: "E-Mails einfach, sicher und fokussiert verwalten.",
    icon: "mail",
    iconPath: "./app-icons/lunamail.png",
    status: "available",
    version: "",
    latestVersion: "0.9.49",
    installed: false,
    updateAvailable: false,
    comingSoon: false,
    githubRepo: "https://github.com/Emiciano/LunaMail",
    githubReleases: "https://github.com/Emiciano/LunaMail/releases",
    releaseNotes: "Aktuelle stabile LunaMail-Version ohne eigenen App-Updater. Updates werden zentral über den LunaSuite Launcher installiert.",
    releaseChannel: "stable",
    downloadUrl: "https://github.com/Emiciano/LunaMail/releases/latest",
    size: "84,3 MB",
    lastUpdated: "13. Juni 2026"
  },
  {
    id: "lunaworkspace",
    name: "LunaWorkspace",
    description: "Projekte und Teams an einem ruhigen Ort organisieren.",
    icon: "workspace",
    iconPath: "./app-icons/lunaworkspace.png",
    status: "coming-soon",
    version: "",
    latestVersion: "",
    installed: false,
    updateAvailable: false,
    comingSoon: true,
    githubRepo: "https://github.com/Emiciano/LunaWorkspace",
    githubReleases: "https://github.com/Emiciano/LunaWorkspace/releases",
    releaseNotes: "Noch keine Veröffentlichung verfügbar.",
    releaseChannel: "stable",
    downloadUrl: null
  },
  {
    id: "lunanotes",
    name: "LunaNotes",
    description: "Notizen, Gedanken und Ideen ohne Ablenkung festhalten.",
    icon: "notes",
    iconPath: "./app-icons/lunanotes.png",
    status: "coming-soon",
    version: "",
    latestVersion: "",
    installed: false,
    updateAvailable: false,
    comingSoon: true,
    githubRepo: "https://github.com/Emiciano/LunaNotes",
    githubReleases: "https://github.com/Emiciano/LunaNotes/releases",
    releaseNotes: "Noch keine Veröffentlichung verfügbar.",
    releaseChannel: "stable",
    downloadUrl: null
  },
  {
    id: "lunacalendar",
    name: "LunaCalendar",
    description: "Termine, Fokuszeit und Aufgaben im Blick behalten.",
    icon: "calendar",
    iconPath: "./app-icons/lunacalendar.png",
    status: "coming-soon",
    version: "",
    latestVersion: "",
    installed: false,
    updateAvailable: false,
    comingSoon: true,
    githubRepo: "https://github.com/Emiciano/LunaCalendar",
    githubReleases: "https://github.com/Emiciano/LunaCalendar/releases",
    releaseNotes: "Noch keine Veröffentlichung verfügbar.",
    releaseChannel: "stable",
    downloadUrl: null
  }
];

export function getRegistryApp(appId: string) {
  return appRegistry.find((app) => app.id === appId);
}
