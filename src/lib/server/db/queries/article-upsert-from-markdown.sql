-- (xmax = 0) is true only for freshly inserted rows, so callers can tell create vs update.
INSERT INTO nothing_else_blog_content.articles
	(slug, language, title, description, image, date, keywords, reposts, body_md, status, source, share_token)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'markdown', NULL)
ON CONFLICT (slug) DO UPDATE SET
	language = EXCLUDED.language,
	title = EXCLUDED.title,
	description = EXCLUDED.description,
	image = EXCLUDED.image,
	date = EXCLUDED.date,
	keywords = EXCLUDED.keywords,
	reposts = EXCLUDED.reposts,
	body_md = EXCLUDED.body_md,
	status = EXCLUDED.status,
	source = 'markdown',
	share_token = NULL,
	updated_at = now()
RETURNING (xmax = 0) AS inserted
