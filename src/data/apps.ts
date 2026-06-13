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
  { version: "LunaMail v0.9.49", note: "App-Updater deaktiviert, Updates laufen zentral über den Launcher", date: "13. Juni 2026" },
  { version: "Launcher v0.0.17", note: "LunaMail Updates werden jetzt echt heruntergeladen und silent installiert", date: "13. Juni 2026" },
  { version: "LunaMail v0.9.48", note: "Einheitlicheres Layout und verbesserte Fensterbewegung", date: "13. Juni 2026" },
  { version: "Launcher v0.0.16", note: "Installierte Apps können direkt aus dem Launcher gestartet werden", date: "13. Juni 2026" },
  { version: "Launcher v0.0.15", note: "Größere App-Logos ohne Hintergrundfläche", date: "13. Juni 2026" },
  { version: "Launcher v0.0.14", note: "Eigene App-Logos und bereinigte App-Detailseiten", date: "13. Juni 2026" },
  { version: "Launcher v0.0.13", note: "Flüssigere Animationen und präzise Header-Ausrichtung", date: "13. Juni 2026" },
  { version: "Launcher v0.0.12", note: "Breiteres Layout, Account-Menü und neues LunaSuite-Logo", date: "13. Juni 2026" },
  { version: "Launcher v0.0.11", note: "Schwarze Sidebar und dezente Content-Outline", date: "13. Juni 2026" },
  { version: "Launcher v0.0.10", note: "Äußeren Rahmen der Sidebar entfernt", date: "13. Juni 2026" },
  { version: "Launcher v0.0.9", note: "Linienfreie Sidebar und abgerundete Content-Fläche", date: "13. Juni 2026" },
  { version: "Launcher v0.0.8", note: "Launcher-Updates werden künftig vollständig still installiert", date: "13. Juni 2026" },
  { version: "Launcher v0.0.7", note: "Kompaktere Übersicht mit Feature- und Versionskarten", date: "13. Juni 2026" },
  { version: "Launcher v0.0.6", note: "Reduzierte Übersicht und Updateverwaltung in den Einstellungen", date: "13. Juni 2026" },
  { version: "Launcher v0.0.5", note: "In-App-Updates für den Launcher", date: "13. Juni 2026" },
  { version: "Launcher v0.0.4", note: "App Registry, Installations- und Update-Services", date: "13. Juni 2026" }
];
