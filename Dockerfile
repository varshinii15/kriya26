##
## Next.js (npm) production image
##

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- Dependencies layer (cached) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build layer ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_PAYMENT_URL
ENV NEXT_PUBLIC_PAYMENT_URL=$NEXT_PUBLIC_PAYMENT_URL

RUN npm run build

# --- Runtime layer ---
FROM base AS runner
ENV NODE_ENV=production

# Next.js serves from the app root
WORKDIR /app

# Copy built app + runtime assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Copy node_modules (includes dev deps; required for next.config.ts runtime support)
COPY --from=builder /app/node_modules ./node_modules

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_PAYMENT_URL
ENV NEXT_PUBLIC_PAYMENT_URL=$NEXT_PUBLIC_PAYMENT_URL

# App uses port 5173 in scripts
EXPOSE 5173

CMD ["npm", "run", "start"]

