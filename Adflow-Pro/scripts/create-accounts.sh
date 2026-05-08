#!/bin/bash
# Create Test Accounts Script
# Make sure dev server is running on localhost:3001

echo "🚀 Creating test accounts..."
echo ""

# Client Account
echo "Creating Client account..."
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Client","email":"client@adflow.test","password":"Client123!"}'
echo ""
echo ""

sleep 2

# Moderator Account
echo "Creating Moderator account..."
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Moderator","email":"moderator@adflow.test","password":"Moderator123!"}'
echo ""
echo ""

sleep 2

# Admin Account
echo "Creating Admin account..."
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Admin","email":"admin@adflow.test","password":"Admin123!"}'
echo ""
echo ""

sleep 2

# Super Admin Account
echo "Creating Super Admin account..."
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Super Admin","email":"superadmin@adflow.test","password":"SuperAdmin123!"}'
echo ""
echo ""

echo "✅ Done! Now run the SQL script in Supabase to update roles."
echo "SQL file: scripts/seed-test-users.sql"
