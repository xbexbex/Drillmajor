#!/bin/bash
echo "Dropping tables..."

cd ../sql
psql -U major < drop_tables.sql

echo "Valmis!"