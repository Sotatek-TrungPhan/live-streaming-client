# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

#Run npm
RUN pnpm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

