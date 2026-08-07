import { ensureSchema } from '$lib/server/db';
import { reconcileArticles } from '$lib/server/articles-sync';
import { load } from '$lib/server/content';

// Full boot sequence: ensure schema -> reconcile markdown articles -> warm the cache.
// Shared by the server init hook and the health endpoint: when boot fails (e.g. the DB
// was briefly unreachable), the Docker healthcheck keeps probing /api/v1/health, which
// retries this until it succeeds — no redeploy needed. A successful run is cached
// forever (warmup happens once); only a failed attempt is cleared so the next call
// retries. Concurrent callers await the same attempt.
let attempt: Promise<void> | null = null;

export const warmup = (): Promise<void> => {
	if (!attempt) {
		attempt = (async () => {
			await ensureSchema();
			await reconcileArticles();
			await load();
		})().catch((err: unknown) => {
			attempt = null;
			throw err;
		});
	}
	return attempt;
};
