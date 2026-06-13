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

interface Window {
  lunaSuite?: {
    platform: string;
    version: string;
    getAppStatus(appId: string): Promise<DesktopAppStatus | null>;
    openExternal(url: string): Promise<void>;
  };
}
