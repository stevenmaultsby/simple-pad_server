# Firefox Extension Backend Server

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-compose-ready-blue?logo=docker)](https://docs.docker.com/compose/)

A backend server designed to handle requests from a [Firefox browser extension] (https://github.com/stevenmaultsby/simple-pad.git). Built with scalability and security in mind, this service provides a robust API layer for your extension's functionality.

> 🔗 **Firefox Extension Repository**: 

---

## 📋 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Managing the Server](#-managing-the-server)
- [Environment Variables](#-environment-variables)
- [Docker Compose Setup](#-docker-compose-setup)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

- 🔐 Secure API endpoints for Firefox extension communication
- 🐳 Docker & Docker Compose ready for easy deployment
- 🗄️ PostgreSQL database integration with configurable connection strings
- 🔄 Environment-based configuration for development, staging, and production
- 🛡️ Service secret authentication for request validation
- 📦 NGINX reverse proxy included for production-ready setups
- 📜 Simple bash script wrappers for common server management tasks

---

## 📦 Requirements

### Hardware Requirements (Minimum)

| Component | Requirement |
|-----------|-------------|
| CPU | 2 cores |
| RAM | 8 GB |
| Storage | 40 GB HDD/SSD |

### Software Requirements

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- Bash shell (for management scripts)
- Git

---

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Create and configure the `.env` file**

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

> ⚠️ **Important**: Never commit your `.env` file to version control. It is already included in `.gitignore`.

3. **Make management scripts executable**

```bash
chmod +x run.sh down.sh restart.sh exec.sh
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DB_USER` | PostgreSQL database username | `myuser` | ✅ |
| `DB_PASSWORD` | PostgreSQL database password | `secure_password_123` | ✅ |
| `DB_NAME` | PostgreSQL database name | `extension_db` | ✅ |
| `DB_PATH` | Database connection string (auto-generated) | `psql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}` | ✅ |
| `DB_EXTERNAL_PORT` | External port for database access | `5432` | ✅ |
| `NGINX_PORT` | Public-facing port for the API | `8080` | ✅ |
| `SERVICE_SECRET` | Secret key for authenticating extension requests | `your-super-secret-key` | ✅ |

> 💡 The `DB_PATH` variable uses shell variable expansion. Ensure your `.env` file is processed by a tool that supports this syntax (e.g., `docker-compose` with interpolation enabled).

### Example `.env` File

```env
# Database Configuration
DB_USER=myuser
DB_PASSWORD=secure_password_123
DB_NAME=extension_db
DB_PATH=psql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
DB_EXTERNAL_PORT=5432

# Server Configuration
NGINX_PORT=8080
SERVICE_SECRET=your-super-secret-key-change-in-production
```

---

## 🎛️ Managing the Server

This project includes a set of bash scripts to simplify server management. All scripts should be executed from the project root directory.

### Available Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `run.sh` | Build and start all services in detached mode | `./run.sh` |
| `down.sh` | Stop and remove all running containers | `./down.sh` |
| `restart.sh` | Restart all services (graceful reload) | `./restart.sh` |
| `exec.sh` | Execute a command inside a running container | `./exec.sh <service> <command>` |

### Usage Examples

```bash
# Start the server
./run.sh

# Stop the server
./down.sh

# Restart the server
./restart.sh

# Execute a command inside the app container
./exec.sh app npm run migrate

# Open a shell inside the database container
./exec.sh db bash

# Run a database query
./exec.sh db psql -U $DB_USER -d $DB_NAME -c "SELECT version();"

# View logs of a specific service
./exec.sh app docker compose logs -f
```

### Script Details

#### `run.sh`
- Runs `docker compose up -d --build`
- Ensures all services are built and started in the background
- Displays a success message with service endpoints

#### `down.sh`
- Runs `docker compose down`
- Stops and removes containers, networks, and volumes (if configured)
- Safe to run multiple times

#### `restart.sh`
- Combines `down.sh` and `run.sh` for a clean restart
- Useful after configuration or code changes

#### `exec.sh`
- Wrapper for `docker compose exec`
- Usage: `./exec.sh <service_name> <command...>`
- Passes all arguments after the service name to the container

> 💡 **Tip**: Source the `.env` file before using `exec.sh` to ensure environment variables are available:
> ```bash
> set -a && source .env && set +a
> ./exec.sh app your-command
> ```

---

## 🐳 Docker Compose Setup

The `docker-compose.yml` file orchestrates the following services:

| Service | Description | Ports |
|---------|-------------|-------|
| `app` | Main backend server | Internal |
| `db` | PostgreSQL database | `${DB_EXTERNAL_PORT}:5432` |
| `nginx` | Reverse proxy & static file server | `${NGINX_PORT}:80` |

### Direct Docker Compose Usage

If you prefer not to use the bash scripts, you can manage services directly:

```bash
# Start services
docker compose up -d --build

# Stop services
docker compose down

# View logs
docker compose logs -f

# Execute command in container
docker compose exec app bash
```

---

## 🔧 Development

### Local Development (Without Docker)

> ⚠️ For advanced users only. Docker Compose is the recommended approach.

1. Install dependencies:
```bash
npm install  # or pip install -r requirements.txt, depending on your stack
```

2. Set up a local PostgreSQL instance and update `.env` accordingly.

3. Start the development server:
```bash
npm run dev  # or python main.py, etc.
```

### Connecting the Firefox Extension

1. Build your Firefox extension from its repository.
2. In the extension settings, configure the API endpoint to point to your server:
   ```
   http://your-server-ip:8080/api
   ```
3. Ensure the `SERVICE_SECRET` matches on both client and server sides.

---

## 🔍 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Script permission denied` | Run `chmod +x *.sh` to make scripts executable |
| `Container exits immediately` | Check logs with `docker compose logs app`; verify environment variables |
| `Database connection failed` | Ensure `DB_PATH` is correctly formatted and PostgreSQL is healthy |
| `Permission denied on volume` | Run `sudo chown -R $USER:$USER ./data` for mounted volumes |
| `Port already in use` | Change `NGINX_PORT` or `DB_EXTERNAL_PORT` in `.env` |

### Health Checks

```bash
# API health endpoint
curl http://localhost:8080/health

# Database connectivity
docker compose exec db pg_isready -U $DB_USER

# Container status overview
docker compose ps
```

### Debugging with exec.sh

```bash
# Open interactive shell in app container
./exec.sh app bash

# Inspect environment variables inside container
./exec.sh app env

# Check application logs directly
./exec.sh app tail -f /var/log/app.log
```

---

## 🔐 Security Best Practices

- 🔒 Never expose `SERVICE_SECRET` or database credentials in client-side code
- 🔄 Rotate secrets regularly in production environments
- 🛡️ Use HTTPS in production (configure SSL in NGINX)
- 📝 Keep Docker images and dependencies up to date
- 🔍 Enable logging and monitoring for suspicious activity
- 🚫 Do not commit `.env` or scripts with hardcoded secrets to version control

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📬 Support

- 🐛 Report bugs via [GitHub Issues](https://github.com/your-username/your-repo-name/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/your-username/your-repo-name/discussions)
- 📧 Contact: [your-email@example.com]

---

> **Note**: Replace placeholder values like `your-username`, `your-repo-name`, and links with your actual repository information before publishing.

*Last updated: April 2026*
