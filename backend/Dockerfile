# Use official OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
# Check if we're in root or backend directory
COPY . /tmp/source
WORKDIR /tmp/source
RUN if [ -d "backend" ]; then cp -r backend/* /app/; else cp -r . /app/; fi
WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Build the application
RUN mvn clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/ritkart-backend-1.0.0.jar"]
