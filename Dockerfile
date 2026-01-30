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

# Stage 2: Serve the app with Apache
FROM httpd:2.4-alpine AS production

# Enable mod_rewrite
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/Listen 80/Listen 4300/g' /usr/local/apache2/conf/httpd.conf

# Remove default Apache files
RUN rm -rf /usr/local/apache2/htdocs/*

# Copy all dist content
COPY --from=build /app/dist/ /tmp/dist/

# Move the actual build files to the correct location
RUN if [ -d /tmp/dist/InvPapeleriaFront/browser ]; then \
        cp -r /tmp/dist/InvPapeleriaFront/browser/* /usr/local/apache2/htdocs/; \
    elif [ -d /tmp/dist/InvPapeleriaFront ]; then \
        cp -r /tmp/dist/InvPapeleriaFront/* /usr/local/apache2/htdocs/; \
    else \
        cp -r /tmp/dist/* /usr/local/apache2/htdocs/; \
    fi && \
    rm -rf /tmp/dist

# Copy .htaccess for Angular routing
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

# Verify files were copied (for debugging)
RUN ls -la /usr/local/apache2/htdocs/

# Expose port 4300
EXPOSE 4300

# Start Apache
CMD ["httpd-foreground"]