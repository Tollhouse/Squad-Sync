# Use the official Node.js image as a base
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /client

# Copy only package.json and package-lock.json first to install dependencies
COPY . ./

# Install dependencies
RUN npm install

# Expose the app port (usually for frontend apps)
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "dev"]