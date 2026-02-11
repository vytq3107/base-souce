#!/bin/bash
NAME=$1
if [ -z "$NAME" ]; then
  echo "Error: Please provide a migration name. Example: pnpm migration:generate AddSoftDelete"
  exit 1
fi
npm run typeorm -- migration:generate -d libs/database/type-orm/src/lib/datasource/datasource.ts "libs/database/type-orm/src/lib/migrations/$NAME"
