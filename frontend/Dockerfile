# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the source code of the Svelte app to the working directory
COPY . .

# Set environment variables
ARG GITHUB_ID, GITHUB_SECRET, AUTH_SECRET, NEXTAUTH_URL, AUTH_SECRET
ENV GITHUB_ID=${GITHUB_ID}
ENV GITHUB_SECRET=${GITHUB_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}

# Build the Svelte app using the Node adapter
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# ENV HOST=

# Start the application using the Node adapter
CMD ["node", "./build/index.js"]
