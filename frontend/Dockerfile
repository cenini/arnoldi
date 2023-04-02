# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci --omit dev

# Copy the source code of the Svelte app to the working directory
COPY . .

# Build the Svelte app using the Node adapter
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application using the Node adapter
CMD ["node", "./build/index.js"]
