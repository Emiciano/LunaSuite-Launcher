# LunaSuite Launcher

Zentrale Oberfläche zum Installieren, Starten und Aktualisieren aller LunaSuite Apps.

## Aktueller Stand

- LunaMail ist als aktive, installierbare App vorbereitet.
- LunaWorkspace, LunaNotes und LunaCalendar sind als Coming Soon markiert.
- Download, Installation, Update-Prüfung, Toasts und Release Notes sind als UI-Mockups umgesetzt.
- Die App-Datenstruktur ist für spätere GitHub-Releases oder API-Daten vorbereitet.

## Technik

- React 19
- TypeScript
- Vite
- TailwindCSS
- lucide-react

## Entwicklung

```bash
npm install
npm run dev
```

Der Entwicklungsserver ist anschließend standardmäßig unter `http://localhost:5173` erreichbar.

## Produktions-Build

```bash
npm run build
npm run preview
```

Der fertige Web-Build wird in `dist/` erzeugt.

## Windows-App und Installer

```bash
npm run build:desktop
```

Der installierbare Windows-Setup-Assistent wird anschließend unter `release/LunaSuite Launcher-Setup-<version>.exe` erzeugt. Der Installer legt auf Wunsch Verknüpfungen auf dem Desktop und im Startmenü an.

Installierte Versionen prüfen beim Start automatisch auf neue GitHub Releases. Verfügbare Updates können direkt im Launcher bestätigt, heruntergeladen und beim automatischen Neustart installiert werden.

## Struktur

```text
src/
  components/
    AppCard.tsx
    Header.tsx
    LauncherButton.tsx
    SettingsPanel.tsx
    Sidebar.tsx
    StatusBadge.tsx
    UpdatePanel.tsx
  data/
    apps.ts
  App.tsx
  main.tsx
  styles.css
```

## Spätere Anbindung

Die Einträge in `src/data/apps.ts` enthalten bereits Repository-, Download-, Versions-, Kanal- und Installationsfelder. Die aktuellen Mock-Aktionen können später durch Electron-/Tauri-Befehle oder einen API-Service ersetzt werden.

## Versionierung

Die erste veröffentlichte Version ist `0.0.1`. Vor jedem weiteren Update wird die Versionsnummer in `package.json` und `package-lock.json` erhöht.
