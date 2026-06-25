FROM node:20-slim

# Prisma needs OpenSSL for database connections
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma client before building
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and compile TypeScript
COPY . .
RUN npm run build

# Create upload directory
RUN mkdir -p public/uploads/avatars

# HF Spaces requires port 7860
EXPOSE 7860

# Push DB schema then start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
