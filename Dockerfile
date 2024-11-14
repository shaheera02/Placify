# Dockerfile

# Step 1: Build the React app using Vite
FROM node:18-alpine AS build

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY . /app

# Install dependencies
RUN npm install

# Build the application, which creates the /app/dist folder in the container
RUN npm run build

# Step 2: Serve the app with a minimal HTTP server
FROM node:18-alpine

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy the built files from the previous stage's /app/dist to /app in this stage
COPY --from=build /app/dist /app

# Expose port 8080
EXPOSE 8080

# Serve the app on port 8080
CMD ["serve", "-s", "/app", "-l", "8080"]
