FROM node:22-alpine

RUN apk upgrade --no-cache

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN addgroup -S patungan-group && adduser -S patungan-be-user -G patungan-group

COPY --chown=patungan-be-user:patungan-group package*.json ./

RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --chown=patungan-be-user:patungan-group . .

RUN mkdir -p /app/logs && chown patungan-be-user:patungan-group /app/logs

USER patungan-be-user

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["sh", "-c", "wget -qO- http://127.0.0.1:${PORT}/health >/dev/null || exit 1"]

CMD ["node", "app.js"]
