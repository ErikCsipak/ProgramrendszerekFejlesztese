# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:resolve
COPY src/ src/
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/quarkus-app/lib/ lib/
COPY --from=builder /build/target/quarkus-app/*.jar .
EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]
