# Use the official Node.js image as the base image
FROM node:20

# Running in development mode
ENV NODE_ENV development

# Set the working directory
WORKDIR /html

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose port 80
EXPOSE 8080

# Build and run
CMD ["npm", "start"]
