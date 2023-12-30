# Use an official Node.js runtime as a parent image
FROM node:18.18

# Set the working directory in the container
WORKDIR /D:/dev/capstone/db_service2

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./   

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential python-is-python3

# Install node-pre-gyp globally
RUN npm install -g node-pre-gyp

# Install dependencies
RUN npm install


# Copy the application code
COPY . .

# Expose the port on which the app runs
EXPOSE 9200

# Define the command to run your application
CMD ["npm", "start"]

# how to find  ip address of docker container inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-mongodb-instance
