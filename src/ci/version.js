import { writeFileSync } from 'fs';
import { sync as spawnSync } from 'cross-spawn';
import { Logger } from './log.js';

const logger = new Logger('script:release');

const branch = 'dev';
const branchOpts = ['--branches', branch];

logger.writeWarning('Fetching the expected version.');

const versionFile = new URL(`../../.VERSION`, import.meta.url);
const result = spawnSync('semantic-release', [...branchOpts, '--no-ci', '--dry-run'], {
	stdio: 'pipe',
	env: { ...process.env, GITHUB_REF: branch }
});
const versionPrefix = 'Release note for version';
const versionLine = result.output.find(line => (line || '').includes(versionPrefix));
if (!versionLine) {
	logger.writeError(
		'There are no version found. Make sure you follow the semver convention in the commit message.'
	);
	process.exit(1);
}
const versionStart = versionLine.slice(
	versionLine.indexOf(versionPrefix) + versionPrefix.length + 1
);
const versionBuffer = versionStart.slice(0, versionStart.indexOf(':'));

writeFileSync(versionFile, `${versionBuffer}`);
logger.writeWarning(`Version ${versionBuffer} successfully saved`);
logger.writeWarning('Publishing it into github releases');
spawnSync('semantic-release', [...branchOpts], { stdio: 'inherit' });
logger.writeWarning('Published the new version successfully');
