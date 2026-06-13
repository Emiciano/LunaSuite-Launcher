export {
  appIcons,
  appRegistry,
  appRegistry as launcherApps,
  getRegistryApp
} from "./appRegistry";
export type {
  AppIconName,
  AppStatus,
  LauncherApp,
  ReleaseChannel
} from "./appRegistry";

export const updateHistory = [
  { version: "LunaMail v0.9.47", note: "Aktuell veröffentlichte stabile Version", date: "13. Juni 2026" },
  { version: "Launcher v0.0.8", note: "Launcher-Updates werden künftig vollständig still installiert", date: "13. Juni 2026" },
  { version: "Launcher v0.0.7", note: "Kompaktere Übersicht mit Feature- und Versionskarten", date: "13. Juni 2026" },
  { version: "Launcher v0.0.6", note: "Reduzierte Übersicht und Updateverwaltung in den Einstellungen", date: "13. Juni 2026" },
  { version: "Launcher v0.0.5", note: "In-App-Updates für den Launcher", date: "13. Juni 2026" },
  { version: "Launcher v0.0.4", note: "App Registry, Installations- und Update-Services", date: "13. Juni 2026" }
];
