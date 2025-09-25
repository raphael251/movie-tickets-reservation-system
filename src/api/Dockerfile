FROM node:22-alpine AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY src/api ./src/api
COPY tsconfig.json .
COPY package.json .
COPY package-lock.json .
RUN npm ci
WORKDIR /app/src/api
RUN npm run build:ci

FROM node:22-alpine AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/src/api/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN touch /usr/local/bin/husky && chmod +x /usr/local/bin/husky
RUN npm ci --omit=dev

FROM node:22-alpine AS runner
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=installer /app .

EXPOSE 80

CMD ["npm", "run", "start:prod"]