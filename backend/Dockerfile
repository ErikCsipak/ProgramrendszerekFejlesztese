# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:resolve
COPY src/ src/
RUN mvn clean package -DskipTests

# Runtime stage
# Use Debian-based Temurin JRE (non-alpine) so native libraries used by argon2-jvm
# work correctly. Alpine (musl) often causes SIGSEGV in JNI/native libs.
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/target/quarkus-app/ /app/
EXPOSE 8082
CMD ["java", "-jar", "quarkus-run.jar"]
