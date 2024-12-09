# Build Stage
FROM node:23-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . . 

# Build the React app
RUN npm run build

# Production Stage - Serve with nginx
FROM nginx:alpine

# Copy build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html


# Expose port 80 for the server
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
