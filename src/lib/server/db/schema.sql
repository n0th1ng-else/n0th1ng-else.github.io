-- content schema: runtime-managed dynamic content for the site.
-- Idempotent: safe to run on every boot. See docs/0001-content-runtime-postgres.md.

CREATE SCHEMA IF NOT EXISTS content;

-- Links: reading-list items, external publications, and packages.
-- Manual metadata entry in iteration 1; getLinkInfo() auto-fill is a future enhancement.
CREATE TABLE IF NOT EXISTS content.links (
	id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	kind        text NOT NULL CHECK (kind IN ('reading_list', 'publication', 'package')),
	service     text,
	lang        text NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'ru')),
	url         text NOT NULL,
	title       text,
	description text,
	image       text,
	note        text,
	date        bigint,
	sort_order  integer NOT NULL DEFAULT 0,
	created_at  timestamptz NOT NULL DEFAULT now(),
	updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS links_kind_idx ON content.links (kind);

-- Articles: draft workspace + serving copy. Git (./articles/*.md) stays canonical;
-- launch reconciliation overrides published rows from markdown (source='markdown').
CREATE TABLE IF NOT EXISTS content.articles (
	id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	slug        text NOT NULL UNIQUE,
	language    text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ru')),
	title       text NOT NULL,
	description text,
	image       text,
	date        date,
	keywords    text[] NOT NULL DEFAULT '{}',
	reposts     text[] NOT NULL DEFAULT '{}',
	body_md     text NOT NULL DEFAULT '',
	status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
	source      text NOT NULL DEFAULT 'db' CHECK (source IN ('db', 'markdown')),
	share_token uuid,
	created_at  timestamptz NOT NULL DEFAULT now(),
	updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_status_idx ON content.articles (status);
CREATE UNIQUE INDEX IF NOT EXISTS articles_share_token_idx
	ON content.articles (share_token) WHERE share_token IS NOT NULL;
