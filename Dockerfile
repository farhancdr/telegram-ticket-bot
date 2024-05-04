# Use the official Node.js image as base
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port specified in the .env file or default to 3000
EXPOSE ${PORT:-3000}

# Command to run the application
CMD ["npm", "run", "start"]
