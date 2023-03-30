# Build stage
FROM node:lts AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the Svelte application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy the built Svelte app from the build stage to the nginx HTML directory
COPY --from=build /app/public /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]