# Multi-stage build for Java Spring Boot application
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Production stage
FROM eclipse-temurin:17-jdk-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/ritkart-backend-1.0.0.jar app.jar

# Change ownership to app user
RUN chown -R appuser:appgroup /app

# Switch to app user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
CMD ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]