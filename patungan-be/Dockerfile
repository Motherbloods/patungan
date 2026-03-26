FROM node:20-alpine

WORKDIR /app

RUN addgroup -S patungan-group && adduser -S patungan-be-user -G patungan-group

COPY --chown=patungan-be-user:patungan-group package*.json ./

RUN npm ci --omit-dev --no-audit --no-fund

COPY --chown=patungan-be-user:patungan-group  . .

USER patungan-be-user

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm","start"]
