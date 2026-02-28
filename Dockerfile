# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

ARG VITE_TOSS_CLIENT_KEY
ENV VITE_TOSS_CLIENT_KEY=${VITE_TOSS_CLIENT_KEY}

ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Runtime variable for backend upstream used by nginx template rendering
ENV BACKEND_UPSTREAM=http://server:8080

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx template (official nginx entrypoint renders /etc/nginx/templates/*.template)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
