FROM node:20-alpine AS builder

WORKDIR /app

RUN addgroup -S patungan-fe-group && adduser -S patungan-fe-user -G patungan-fe-group

COPY --chown=patungan-fe-user:patungan-fe-group package*.json ./

RUN npm ci --no-audit --no-fund

COPY --chown=patungan-fe-user:patungan-fe-group . .

ARG VITE_API_BASE_URL
ARG VITE_CREDENTIALS
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CREDENTIALS=$VITE_CREDENTIALS
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \; \
    && find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
    && mkdir -p /tmp/client_body /tmp/proxy /tmp/fastcgi /tmp/uwsgi /tmp/scgi \
    && chown -R nginx:nginx /tmp/client_body /tmp/proxy /tmp/fastcgi /tmp/uwsgi /tmp/scgi
EXPOSE 5176
CMD ["nginx", "-g", "daemon off;"]
