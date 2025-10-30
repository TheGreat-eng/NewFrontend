# b/thegreat-eng-newfrontend/Dockerfile

# ---- Stage 1: Build React App ----
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
# Nếu có package-lock.json hoặc yarn.lock thì copy cả nó
# COPY package-lock.json ./ 
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app for production
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:1.25-alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80