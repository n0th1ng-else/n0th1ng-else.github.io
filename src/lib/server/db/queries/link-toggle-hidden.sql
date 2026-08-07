UPDATE nothing_else_blog_content.links
SET hidden = NOT hidden, updated_at = now()
WHERE id = $1
