FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node and typescript globally
RUN npm install -g ts-node typescript

# Copy the rest of the application files
COPY . .

# Expose the backend port (3001)
EXPOSE 3001

# Run the server using ts-node
CMD ["npm", "run", "dev"]
