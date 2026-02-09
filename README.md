# Support Center

A comprehensive support center application built with NestJS, NX monorepo, and event-driven microservices architecture.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Kafka
- Redis
- Socket.IO
- Telegram Bot API
- i18n

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm
- Docker & Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL, Kafka, Redis)
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
pnpm migration:run

# Seed database
pnpm seed

# Start API Gateway
pnpm nx serve api-gateway

# Start Worker (in another terminal)
pnpm nx serve worker
```

## Project Structure

```
support-center/
├── apps/
│   ├── api-gateway/       # REST API & WebSocket Gateway
│   └── worker/            # Background job processor
├── libs/
│   ├── core/             # Core libraries (guards, pipes, decorators, etc.)
│   ├── data-access/      # Data access layer
│   ├── database/         # Database entities, migrations, seeds
│   ├── features/         # Business logic
│   ├── infra/            # Infrastructure (Kafka, Redis, Socket.IO, etc.)
│   ├── integration/      # CQRS integration
│   └── shared/           # Shared utilities
```

## License

MIT
