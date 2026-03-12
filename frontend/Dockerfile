# Build stage
FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Runtime stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist/coursemgmt /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
