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

# Stage 3: Final stage
FROM node:16

# Set the working directory
WORKDIR /app

# Copy backend build
COPY --from=backend-build /app/backend /app/backend

# Copy frontend build
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Install serve to serve the frontend build
RUN npm install -g serve

# Expose the ports
EXPOSE 5000
EXPOSE 3000

# Start the backend and frontend
CMD ["sh", "-c", "cd /app/backend && npm start & serve -s /app/frontend/build -l 3000"]