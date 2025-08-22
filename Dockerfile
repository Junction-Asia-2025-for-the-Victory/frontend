# ---- build stage ----
FROM eclipse-temurin:17-jdk as build
WORKDIR /app

# Gradle wrapper와 설정 파일들 복사
COPY gradlew ./
COPY gradle/ ./gradle/
COPY build.gradle settings.gradle ./

# Gradle wrapper 실행 권한 설정 및 의존성 다운로드
RUN chmod +x gradlew
RUN ./gradlew --version >/dev/null 2>&1 || true

# 소스 코드 복사 및 빌드
COPY src ./src
RUN ./gradlew clean bootJar -x test

# ---- run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# 보안을 위한 비-root 사용자 생성
RUN useradd -m appuser

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 사용자 변경
USER appuser

# 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]