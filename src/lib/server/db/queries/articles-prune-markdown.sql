DELETE FROM nothing_else_blog_content.articles
WHERE source = 'markdown' AND NOT (slug = ANY($1::text[]))
RETURNING slug
