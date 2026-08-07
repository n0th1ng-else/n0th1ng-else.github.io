UPDATE nothing_else_blog_content.articles
SET slug = $2, language = $3, title = $4, description = $5, image = $6, date = $7,
	keywords = $8, reposts = $9, body_md = $10, updated_at = now()
WHERE id = $1
