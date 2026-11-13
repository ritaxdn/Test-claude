#!/usr/bin/env bash
# Runs the MESH SQL test-suite against a throwaway local Postgres database.
# Usage: PGHOST=... PGUSER=... bash supabase/tests/run.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB="mesh_test_$$"
createdb "$DB"
trap 'dropdb --if-exists "$DB" >/dev/null 2>&1; psql -d postgres -qc "drop role if exists anon, authenticated, service_role" >/dev/null 2>&1 || true' EXIT
psql -d postgres -qc "drop role if exists anon, authenticated, service_role" >/dev/null 2>&1 || true
P="psql -X -v ON_ERROR_STOP=1 -q -t -o /dev/null -d $DB"
$P -f tests/auth_stub.sql
for f in migrations/*.sql; do $P -f "$f"; done
$P -f seed.sql
$P -f tests/rls.test.sql
echo "All MESH database tests passed."
