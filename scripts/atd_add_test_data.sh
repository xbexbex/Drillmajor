#!/bin/bash
echo "Adding testdata.."

cd ../sql
psql -U major < add_test_data.sql

echo "Done!"