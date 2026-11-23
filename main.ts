import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const projectDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copySubmission(): void {
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(projectDir, 'game'), join(outputDir, 'game'), { recursive: true });

  const submittedShots = join(outputDir, 'screenshots');
  mkdirSync(submittedShots, { recursive: true });
  const sourceShots = join(projectDir, 'screenshots');
  if (existsSync(sourceShots)) cpSync(sourceShots, submittedShots, { recursive: true });
}

function countFiles(folder: string): number {
  return readdirSync(folder).reduce((total, name) => {
    const entry = join(folder, name);
    return total + (statSync(entry).isDirectory() ? countFiles(entry) : 1);
  }, 0);
}

copySubmission();

// These limits match the hand-in format accepted by the game runner.
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};
writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, dossierCaps));

console.log(`Handed in ${countFiles(outputDir)} files to ${outputDir}`);
