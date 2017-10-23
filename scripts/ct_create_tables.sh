#!/bin/bash
echo "Creating tables"

cd ../sql
psql -U major < create_tables.sql

echo "Done!"