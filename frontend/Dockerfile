# =========================================
# Stage 1: Build the Angular Application
# =========================================

# Use a lightweight DHI Node.js image for building
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json* ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN npm install


# Copy the rest of the application source code into the container
COPY . .

# Build the Angular application
RUN npm run build 

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================

FROM nginx:alpine AS runner

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /app/dist/coursemgmt /usr/share/nginx/html

# Ensure nginx can write its runtime/cache directories, then switch to non-root user
RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx /var/log/nginx \
	&& chown -R nginx:nginx /var/cache/nginx /var/run/nginx /var/log/nginx

# Note: keep the container running as root so nginx master process can create the pid file;
# worker processes still drop privileges to the `nginx` user because we've chowned runtime dirs.

# Expose port 4200 to allow HTTP traffic from host
# The custom Nginx config listens on port 4200 so expose the same port
EXPOSE 4200

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]