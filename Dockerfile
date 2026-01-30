# Use an official Node.js runtime as a parent image
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use an Apache image to serve the built application
FROM httpd:alpine

# Copy the built Angular app to the Apache HTML directory
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Expose port 80 to the outside world
EXPOSE 4300

# Start Apache server
CMD ["httpd-foreground"]