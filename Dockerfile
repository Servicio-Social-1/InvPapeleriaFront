# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# Debug: Show the directory structure
RUN echo "=== Build output structure ===" && \
    ls -R /app/dist/

# Stage 2: Serve the app with Apache
FROM httpd:2.4-alpine AS production

# Enable mod_rewrite
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/Listen 80/Listen 4300/g' /usr/local/apache2/conf/httpd.conf

# Remove default Apache files
RUN rm -rf /usr/local/apache2/htdocs/*

# Copy dist and then move files properly
COPY --from=build /app/dist /tmp/dist

# Find and move the actual built files (index.html location)
RUN cd /tmp/dist && \
    INDEX_PATH=$(find . -name "index.html" -type f | head -n 1) && \
    INDEX_DIR=$(dirname "$INDEX_PATH") && \
    echo "Found index.html at: $INDEX_PATH" && \
    echo "Copying from: $INDEX_DIR" && \
    cp -r $INDEX_DIR/* /usr/local/apache2/htdocs/ && \
    rm -rf /tmp/dist

# Copy .htaccess for Angular routing
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

# Verify the setup
RUN echo "=== Final htdocs contents ===" && \
    ls -lah /usr/local/apache2/htdocs/

# Expose port 4300
EXPOSE 4300

# Start Apache
CMD ["httpd-foreground"]