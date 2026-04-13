# E-commerce Platform

A full-stack e-commerce platform built with React, Node.js/Express, PostgreSQL, and Redis, containerized with Docker and deployable to AWS.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Environment Variables](#environment-variables)
- [Deployment to AWS EC2](#deployment-to-aws-ec2)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [Planned: EKS Migration with Terraform](#planned-eks-migration-with-terraform)

## Tech Stack

**Frontend**
- React 18 (client-side SPA)
- React Router for routing
- Context API for state management
- Tailwind CSS for styling

**Backend**
- Node.js + Express
- PostgreSQL (via Knex query builder)
- Redis for caching and sessions
- JWT authentication
- Stripe for payments
- AWS S3 for file uploads
- Nodemailer for transactional emails

**Infrastructure**
- Docker & Docker Compose
- Nginx as reverse proxy
- Prometheus + Grafana for monitoring
- GitHub Actions for CI/CD

## Project Structure

```
E-commerce-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   └── utils/          # Helper functions
│   └── Dockerfile
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Auth, rate limiting, etc.
│   │   ├── services/       # Business logic
│   │   ├── validators/     # Request validation
│   │   ├── config/         # Database, Redis, S3 config
│   │   └── jobs/           # Background jobs
│   ├── tests/              # Unit + integration tests
│   └── Dockerfile
├── database/
│   ├── migrations/         # SQL schema migrations
│   └── seeds/              # Seed data
├── docker/
│   └── nginx/              # Nginx reverse proxy config
├── monitoring/
│   ├── prometheus/         # Prometheus config
│   └── grafana/            # Grafana dashboards & provisioning
├── scripts/                # Deployment and utility scripts
├── .github/workflows/      # GitHub Actions CI/CD
└── docker-compose.yml
```

## Features

**Storefront**
- Product browsing with filters, search, and pagination
- Product detail pages with reviews and ratings
- Shopping cart with persistence
- Checkout flow with Stripe payment integration
- User authentication (register, login, password reset)
- Order history and tracking
- User profile management

**Admin Panel**
- Dashboard with sales metrics and charts
- Product management (CRUD)
- Order management
- User management
- Recent orders view

**Backend Services**
- RESTful API with JWT auth
- Redis caching for hot endpoints
- Rate limiting
- File uploads to S3
- Email notifications
- Prometheus metrics endpoint
- Health checks

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development (without Docker)

```bash
# Clone the repo
git clone https://github.com/Kenny-Cloud356/E-commerce-platform.git
cd E-commerce-platform

# Install all dependencies (root, client, server)
npm run install:all

# Set up environment variables (see below)
cp .env.example .env

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start client and server together
npm run dev
```

The client runs on [http://localhost:3000](http://localhost:3000) and the server on [http://localhost:5000](http://localhost:5000).

## Running with Docker

The easiest way to run the entire stack is with Docker Compose:

```bash
# Create your .env file first (see Environment Variables section)
docker compose up --build -d
```

This starts 7 containers:

| Service | Port | Purpose |
|---------|------|---------|
| nginx | 80, 443 | Reverse proxy |
| client | 3000 | React frontend |
| server | 5000 | Node.js API |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Cache & session store |
| prometheus | 9090 | Metrics collection |
| grafana | 3001 | Monitoring dashboards |

**Useful commands:**
```bash
docker compose ps                # Check container status
docker compose logs -f           # Tail all logs
docker compose logs -f server    # Tail a specific service
docker compose restart server    # Restart a service
docker compose down              # Stop everything
docker compose down -v           # Stop and remove volumes (wipes DB)
```

## Environment Variables

Create a `.env` file at the project root with:

```env
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Secrets (change these!)
JWT_SECRET=change-me-to-a-random-secret-key
JWT_REFRESH_SECRET=change-me-to-another-random-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS S3 (for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@store.com

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
```

See [.env.example](.env.example) for a template.

## Deployment to AWS EC2

The project is currently deployed to an AWS EC2 Ubuntu instance using Docker Compose.

### Setup Steps

1. **Launch an EC2 instance** (Ubuntu 22.04 LTS recommended, t3.medium or larger)
2. **Open security group ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (Grafana)
3. **Connect** via EC2 Instance Connect or SSH
4. **Install Docker**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER && newgrp docker
   sudo systemctl enable --now docker
   ```
5. **Clone the repo**:
   ```bash
   git clone https://github.com/Kenny-Cloud356/E-commerce-platform.git
   cd E-commerce-platform
   ```
6. **Create your `.env` file** (see Environment Variables section)
7. **Start the stack**:
   ```bash
   docker compose up --build -d
   ```
8. **Access** at `http://<your-ec2-public-ip>`

## CI/CD Pipeline

GitHub Actions workflows live in [.github/workflows/](.github/workflows/):

### [ci.yml](.github/workflows/ci.yml) — CI Pipeline
Runs on every push to `main`/`develop` and on pull requests:
- **Server tests**: linting, unit tests, and integration tests against live Postgres and Redis service containers
- **Client tests**: Jest tests and production build verification
- **Docker build validation**: builds both Docker images on pushes to `main`

### [deploy.yml](.github/workflows/deploy.yml) — Deploy to AWS
Triggers automatically after CI passes on `main`:
- Builds and pushes Docker images to Amazon ECR
- SSHs into the EC2 instance and runs `docker compose pull && up -d`
- Runs database migrations
- Performs a post-deploy health check

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`

## Monitoring

The stack includes built-in observability:

- **Prometheus** scrapes metrics from the server's `/metrics` endpoint
- **Grafana** dashboards visualize API latency, request rate, error rate, and more
- Access Grafana at `http://<your-host>:3001` (default login: `admin`/`admin`)

The API exposes Prometheus-compatible metrics via the `prom-client` library.

## Planned: EKS Migration with Terraform

A future upgrade path will migrate this stack from single-EC2 Docker Compose to a production-grade AWS setup using Terraform and EKS.

### Planned Infrastructure (Terraform)

- **VPC** with public/private subnets across 2 availability zones, NAT gateway, IGW
- **EKS cluster** with managed node groups (auto-scaling EC2 worker nodes)
- **ECR** for container image registries
- **RDS PostgreSQL** (managed, with automated backups) replacing the Docker postgres container
- **ElastiCache Redis** (managed) replacing the Docker redis container
- **Application Load Balancer** via Kubernetes Ingress

### Planned Autoscaling

- **Horizontal Pod Autoscaler (HPA)**: scales server/client pods based on CPU and memory thresholds
- **Cluster Autoscaler**: scales EC2 worker nodes up/down to match pod demand

### Benefits vs. Current Setup

| Current (Docker Compose on EC2) | Planned (EKS) |
|---|---|
| Single point of failure | Multi-AZ high availability |
| Postgres in a container (data loss risk) | Managed RDS with automated backups |
| Manual scaling (resize EC2) | Auto-scaling at pod and node level |
| Manual deploys | GitOps-style zero-downtime rolling updates |

## License

Private project.
