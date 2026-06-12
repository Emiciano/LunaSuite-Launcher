import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const releaseDirectory = path.resolve("release");

try {
  const entries = await readdir(releaseDirectory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    if (
      entry.name.endsWith(".exe")
      || entry.name.endsWith(".blockmap")
      || entry.name === "latest.yml"
      || entry.name === "win-unpacked"
    ) {
      await rm(path.join(releaseDirectory, entry.name), { recursive: true, force: true });
    }
  }));
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
