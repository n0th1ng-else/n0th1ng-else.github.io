import { getRuntimeEnvironment } from '$lib/server/env';

// Opens (or updates) a GitHub PR that adds an article markdown file to the repo, so published
// content lands in git — the canonical source. On merge + redeploy, launch reconciliation
// (articles-sync.ts) imports it and marks it published. Requires GITHUB_REPO_* env vars.

const API = 'https://api.github.com';
const BASE_BRANCH = 'dev';

type RepoConfig = { token: string; owner: string; repo: string };

const getRepoConfig = (): RepoConfig => {
	const env = getRuntimeEnvironment();
	if (!env.GITHUB_REPO_TOKEN || !env.GITHUB_REPO_OWNER || !env.GITHUB_REPO_NAME) {
		throw new Error('Publishing is not configured (set GITHUB_REPO_TOKEN/OWNER/NAME)');
	}
	return { token: env.GITHUB_REPO_TOKEN, owner: env.GITHUB_REPO_OWNER, repo: env.GITHUB_REPO_NAME };
};

const headers = (token: string): Record<string, string> => ({
	Authorization: `Bearer ${token}`,
	Accept: 'application/vnd.github+json',
	'Content-Type': 'application/json',
	'User-Agent': 'n0th1ng-else-admin',
	'X-GitHub-Api-Version': '2022-11-28'
});

export type PublishArticle = {
	slug: string;
	year: number;
	title: string;
	markdown: string;
};

export const openArticlePR = async (article: PublishArticle): Promise<string> => {
	const { token, owner, repo } = getRepoConfig();
	const path = `articles/${article.year}/${article.slug}.md`;
	const branch = `publish/${article.slug}`;
	const base = `${API}/repos/${owner}/${repo}`;

	const refRes = await fetch(`${base}/git/ref/heads/${BASE_BRANCH}`, { headers: headers(token) });
	if (!refRes.ok) {
		throw new Error(`Failed to read base ref (${refRes.status})`);
	}
	const refData = (await refRes.json()) as { object: { sha: string } };

	// Create the publish branch (ignore 422 = already exists).
	await fetch(`${base}/git/refs`, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: refData.object.sha })
	});

	// If the file already exists on the branch, we need its blob sha to update it.
	let existingSha: string | undefined;
	const fileRes = await fetch(`${base}/contents/${path}?ref=${branch}`, {
		headers: headers(token)
	});
	if (fileRes.ok) {
		existingSha = ((await fileRes.json()) as { sha: string }).sha;
	}

	const putRes = await fetch(`${base}/contents/${path}`, {
		method: 'PUT',
		headers: headers(token),
		body: JSON.stringify({
			message: `chore(article): publish ${article.slug}`,
			content: Buffer.from(article.markdown, 'utf-8').toString('base64'),
			branch,
			sha: existingSha
		})
	});
	if (!putRes.ok) {
		throw new Error(`Failed to write article file (${putRes.status})`);
	}

	const prRes = await fetch(`${base}/pulls`, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify({
			title: `Publish: ${article.title}`,
			head: branch,
			base: BASE_BRANCH,
			body: `Publishes \`${path}\` from the admin editor.`
		})
	});
	if (prRes.ok) {
		return ((await prRes.json()) as { html_url: string }).html_url;
	}

	// A PR for this branch may already be open — return it instead of failing.
	const openRes = await fetch(
		`${base}/pulls?head=${owner}:${branch}&base=${BASE_BRANCH}&state=open`,
		{ headers: headers(token) }
	);
	if (openRes.ok) {
		const list = (await openRes.json()) as { html_url: string }[];
		const existing = list.at(0);
		if (existing) {
			return existing.html_url;
		}
	}
	throw new Error(`Failed to open PR (${prRes.status})`);
};
