INSERT INTO nothing_else_blog_content.articles
	(slug, language, title, description, image, date, keywords, reposts, body_md, status, source, share_token)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', 'db', $10)
RETURNING id
