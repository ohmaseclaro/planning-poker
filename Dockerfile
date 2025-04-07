FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy application code
COPY . .

# Create .env file with secure random values if not provided
RUN if [ ! -f .env ]; then \
    echo "# Application password" > .env && \
    echo "APP_PASSWORD=$(openssl rand -base64 32)" >> .env && \
    echo "" >> .env && \
    echo "# JWT Secret Key" >> .env && \
    echo "JWT_SECRET=$(openssl rand -base64 64)" >> .env; \
    fi

# Build the application
RUN yarn build

# Production image
FROM node:18-alpine as production

# Set working directory
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy built artifacts and necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env ./.env

# Expose port for the application
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"] 