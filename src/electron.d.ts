type DesktopAppStatus = {
  installed: boolean;
  installedVersion: string | null;
  latestVersion: string;
  updateAvailable: boolean;
  downloadUrl: string;
  releaseUrl: string;
  releaseNotes: string;
  publishedAt: string | null;
};

type LauncherUpdateStatus =
  | { status: "checking" }
  | { status: "available"; version: string; releaseNotes?: string }
  | { status: "not-available"; version?: string }
  | { status: "downloading"; version: string; percent: number; transferred: number; total: number; bytesPerSecond: number }
  | { status: "downloaded"; version: string }
  | { status: "error"; message: string };

interface Window {
  lunaSuite?: {
    platform: string;
    version: string;
    getAppStatus(appId: string): Promise<DesktopAppStatus | null>;
    openExternal(url: string): Promise<void>;
    checkLauncherUpdates(): Promise<unknown>;
    downloadLauncherUpdate(): Promise<unknown>;
    getLauncherVersion(): Promise<string>;
    onLauncherUpdateStatus(callback: (status: LauncherUpdateStatus) => void): () => void;
  };
}
