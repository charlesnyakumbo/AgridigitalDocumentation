---
sidebar_position: 3
---

# Setup Guide

This guide walks you through setting up the Agritech application for development or production environments. The application is built with Spring Boot, uses Docker for containerization, and GraalVM for generating native images for optimal performance.

---

## Prerequisites

Before starting, ensure you have the following installed:

1. **Java Development Kit (JDK 23 or later)**  
   Install JDK compatible with GraalVM:

   ```bash
   sudo apt update
   sudo apt install openjdk-23-jdk
   ```

2. **GraalVM**  
   Download and install GraalVM Community Edition:

   ```bash
   curl -L -o graalvm.tar.gz https://github.com/graalvm/graalvm-ce-builds/releases/download/<version>/graalvm-ce-java23-linux-amd64-<version>.tar.gz
   tar -xvf graalvm.tar.gz
   sudo mv graalvm-ce-java23-<version> /usr/lib/graalvm
   export PATH=/usr/lib/graalvm/bin:$PATH
   ```

   Validate installation:

   ```bash
   java -version
   ```

3. **Docker**  
   Install Docker to run containers:

   ```bash
   sudo apt update
   sudo apt install docker.io
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

4. **Maven**  
   Ensure Maven is installed for building the project:

   ```bash
   sudo apt install maven
   ```

5. **Git**  
   Clone the repository:
   ```bash
   sudo apt install git
   git clone <repository-url>
   cd <repository-directory>
   ```

---

## Development Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Configure Docker**
   Navigate to `infrastructure/docker` and start the containers e.g `docker compose -f postgres.yml up` | `docker compose -f redis.yml up`

3. **Configure Application Properties**
   Update `*.yml` with your local configurations (e.g., database credentials).

4. **Start the Application**
   Run the application locally using Maven:

   ```bash
   mvn spring-boot:run
   ```

5. **Access the Application**
   - Default port: `http://localhost:8080`

---

## Building a Native Image

The native images are built using docker, this allows flexibility to generate images for any platform without requiring to install too many dependencies on the image building host machine.

### Ubuntu 20.04

1. **Create docker image**

   ```bash
   docker build -f ./docker/Dockerfile20-04 -t graalvm-native-ubuntu-20-04 .
   ```

2. **Generate native image**

   ```bash
   docker run -v $(pwd):/app -w /app graalvm-native-ubuntu-20-04 bash -c "mvn package -Pnative -DskipTests"
   ```

### Ubuntu 22.04

1. **Create docker image**

   ```bash
   docker build -f ./docker/Dockerfile22-04 -t graalvm-native-ubuntu-22-04 .
   ```

2. **Generate native image**

   ```bash
   docker run -v $(pwd):/app -w /app graalvm-native-ubuntu-22-04 bash -c "mvn package -Pnative -DskipTests"
   ```

### Native image

The generated native image is located at `target/Agritech`

## Production Setup

### Environment Variables

Ensure sensitive configurations are provided as environment variables (e.g., database URLs, API keys):

```bash
export DATABASE_URL=<your-database-url>
export API_KEY=<your-api-key>
```

### Native image

In ubuntu setup **systemd** to automate app running

1. **Copy** the native image to production host e.g `cp target/Agritech ~/apps/Agritech`
2. Setup **systemd**

```bash
sudo touch /etc/systemd/system/Agritech.service
sudo nano /etc/systemd/system/Agritech.service
```

Paste this script in above Agritech.service

```bash
[Unit]
Description=Agritech App
After=network.target

[Service]
ExecStart=~/apps/Agritech
WorkingDirectory=~/apps
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

Then allow the Agritech app in **systemd**

```bash
sudo systemctl daemon-reload
sudo systemctl start Agritech
sudo systemctl enable Agritech
```

### Monitoring and Logging

- Use tools like **Prometheus** or **ELK Stack** for monitoring and logging.
- Ensure logs are written to `stdout` for easy access in containerized environments.

---

## Troubleshooting

1. **Port Conflicts**: If port 8080 is already in use, modify the port in `application.properties`:

   ```yaml
   server:
     port: 9090
   ```

2. **Docker Issues**: Verify Docker service is running:

   ```bash
   sudo systemctl status docker
   ```

3. **Native Image Errors**: Ensure all dependencies are compatible with GraalVM and resolve unsupported reflection warnings.

---

With this setup guide, you are now ready to run the Agritech application in development or production environments. For further assistance, refer to the [official Spring Boot documentation](https://spring.io/projects/spring-boot) or contact the team.
