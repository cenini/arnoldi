# Use the official Node.js image as the base image
FROM node:16

ARG ARNOLDI_GITHUB_ID, ARNOLDI_GITHUB_SECRET, AUTH_SECRET
ENV ARNOLDI_GITHUB_ID=$ARNOLDI_GITHUB_ID
ENV ARNOLDI_GITHUB_SECRET=$ARNOLDI_GITHUB_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the source code of the Svelte app to the working directory
COPY . .
RUN echo $ARNOLDI_GITHUB_SECRET
# Build the Svelte app using the Node adapter
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# ENV HOST=

# Start the application using the Node adapter
CMD ["node", "./build/index.js"]
