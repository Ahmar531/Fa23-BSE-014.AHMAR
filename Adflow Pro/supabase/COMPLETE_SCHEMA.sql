-- ============================================================
-- AdFlow Pro - Complete Database Schema
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enums
CREATE TYPE user_role AS ENUM ('client', 'moderator', 'admin', 'super_admin');
CREATE TYPE ad_status AS ENUM ('draft','submitted','under_review','payment_pending','payment_submitted','payment_verified','scheduled','published','expired','archived');
CREATE TYPE payment_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');
CREATE TYPE media_source_type AS ENUM ('github_raw', 'direct_image', 'youtube', 'other');
CREATE TYPE media_validation_status AS ENUM ('pending', 'valid', 'invalid');
CREATE TYPE notification_type AS ENUM ('status_change','payment_required','payment_verified','payment_rejected','ad_expiring_soon','ad_expired','moderation_note','system');
CREATE TYPE package_tier AS ENUM ('basic', 'standard', 'premium');

-- Create tables (see 001_initial_schema.sql for complete schema)
-- This file is a reference - use 001_initial_schema.sql for actual migration

-- After running 001_initial_schema.sql, run this fix:
CREATE POLICY "users_insert_on_signup" ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Verify setup
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
