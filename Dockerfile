# Stage 1: Build the frontend
FROM node:16 AS frontend-build

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the React app
RUN npm run build

# Stage 2: Build the backend
FROM node:16 AS backend-build

# Set the working directory
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ ./

# Copy frontend build to backend
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Expose the ports
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]