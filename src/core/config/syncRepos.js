import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';

const copyDirectory = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

export const syncRepos = async (exampleDir) => {
    const configPath = path.join('conf', exampleDir, 'config.json');

    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configContent);

        for (const repo of config.remoteRepos) {
            const git = simpleGit();

            // Cloner le dépôt dans un dossier temporaire
            await git.clone(repo.url, 'temp_folder');

            // Si une branche est spécifiée, passer à cette branche
            if (repo.branch) {
                await git.cwd('temp_folder').checkout(repo.branch);
            }

            // Emplacement du répertoire source à copier
            const srcPath = path.join('temp_folder', repo.path);

            // Emplacement du répertoire de destination
            const destPath = path.join('conf', exampleDir, repo.destination);

            // Copier les fichiers ou dossiers
            if (fs.existsSync(srcPath)) {
                if (fs.statSync(srcPath).isDirectory()) {
                    copyDirectory(srcPath, destPath);
                } else {
                    if (!fs.existsSync(path.dirname(destPath))) {
                        fs.mkdirSync(path.dirname(destPath), { recursive: true });
                    }
                    fs.copyFileSync(srcPath, destPath);
                }
            }

            // Effacez 'temp_folder' après la copie
            fs.rmdirSync('temp_folder', { recursive: true });
        }
    }
};
