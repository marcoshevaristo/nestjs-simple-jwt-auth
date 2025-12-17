# Database Migrations Guide

## Overview
This project uses `node-pg-migrate` to manage PostgreSQL database migrations with Docker support.

## Migration Commands

### Development (Local)
```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Create a new migration
npm run migrate:create migration-name

# Run migrations using script (includes env loading)
npm run docker:migrate
```

### Docker Environment
```bash
# Start with development environment (includes migrations)
npm run start:docker:dev

# Start with production environment (includes migrations)
npm run start:docker:prod

# View application logs
npm run docker:logs

# Rebuild containers
npm run docker:build

# Stop all containers
npm run docker:down
```

## How It Works

### Container Startup Process
1. **Database Health Check**: PostgreSQL container starts and runs health checks
2. **Migration Execution**: App container waits for DB health check, then runs migrations
3. **Application Start**: After successful migrations, the NestJS app starts

### Migration Configuration
- **Config File**: `migrate.config.js`
- **Migrations Directory**: `migrations/`
- **Migration Table**: `pgmigrations`

### Environment Variables Required
```env
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_NAME=database_name
```

## Creating New Migrations

```bash
# Create a new migration file
npm run migrate:create add-users-table

# Edit the generated file in migrations/ directory
# Run the migration
npm run migrate:up
```

## Troubleshooting

### Migration Fails
- Check database connectivity
- Verify DATABASE_URL format
- Review migration syntax
- Check container logs: `docker compose logs app-dev`

### Database Connection Issues
- Ensure PostgreSQL container is running
- Verify environment variables
- Check network connectivity between containers

### Migration Rollback
```bash
# Rollback last migration
npm run migrate:down

# For specific rollbacks, use node-pg-migrate directly
npx node-pg-migrate down 2  # Rollback last 2 migrations
```