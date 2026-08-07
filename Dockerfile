FROM node:22.19.0-slim as builder

ENV NODE_ENV production

ARG APP_DIR=/usr/src/app/

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml svelte.config.js $APP_DIR
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod false

COPY . $APP_DIR

# Build the SvelteKit app. No external scraping happens at build time anymore — dynamic
# content is served from Postgres at runtime (see docs/0001-content-runtime-postgres.md).
RUN pnpm build

# Run stage layer

FROM node:22.19.0-slim

ENV NODE_ENV production

ARG APP_DIR=/usr/src/app/

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

# Version metadata is baked as runtime env so /api/v1/version and /api/v1/health report it.
ARG APP_VERSION=0.0.0
ENV APP_VERSION ${APP_VERSION}

ARG COMMIT_HASH=local
ENV COMMIT_HASH ${COMMIT_HASH}

COPY --from=builder $APP_DIR/package.json $APP_DIR
# TODO: copy only production dependencies
COPY --from=builder $APP_DIR/node_modules $APP_DIR/node_modules

# copy the app build
COPY --from=builder $APP_DIR/dist $APP_DIR/dist
# copy the startup banner script
COPY --from=builder $APP_DIR/src/ci/welcome.ts $APP_DIR/src/ci/welcome.ts
COPY --from=builder $APP_DIR/src/ci/log.ts $APP_DIR/src/ci/log.ts

RUN npm install -g pnpm@9

EXPOSE 8080

# Report unhealthy until the in-memory content cache is warmed (counts > 0).
# node:slim has no curl, so use Node's global fetch.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:8080/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

USER node

CMD ["pnpm", "start"]
