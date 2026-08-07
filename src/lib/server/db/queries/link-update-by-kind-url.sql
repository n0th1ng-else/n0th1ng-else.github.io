UPDATE nothing_else_blog_content.links
SET service = $2, lang = $3, link = $5, title = $6, description = $7,
	image = $8, note = $9, date = $10, sort_order = $11, updated_at = now()
WHERE kind = $1 AND url = $4
