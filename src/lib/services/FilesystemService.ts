import { readdirSync } from "fs";
import { join } from "path";
import glob from "glob";
import { promisify } from "util";

const globAsync = promisify(glob);

export class FilesystemService {
  readDirectory(path: string): string[] {
    const paths = readdirSync(path);

    return paths.map((p) => join(path, p));
  }

  async globReadDirectory(...globPatterns: string[]): Promise<string[]> {
    return (
      await Promise.all(
        globPatterns.map((globPattern) => globAsync(globPattern))
      )
    ).flat();
  }
}
