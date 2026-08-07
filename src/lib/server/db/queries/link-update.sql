UPDATE nothing_else_blog_content.links
SET kind = $2, service = $3, lang = $4, url = $5, link = $6, title = $7,
	description = $8, image = $9, note = $10, date = $11, sort_order = $12, updated_at = now()
WHERE id = $1
