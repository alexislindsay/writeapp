-- Recipe Finder Database Schema
-- Run this in your Supabase SQL Editor to create the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create saved_recipes table
CREATE TABLE saved_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  prep_time TEXT,
  cook_time TEXT,
  servings TEXT,
  notes TEXT
);

-- Create index on user_id for faster queries
CREATE INDEX idx_saved_recipes_user_id ON saved_recipes(user_id);

-- Create index on created_at for sorting
CREATE INDEX idx_saved_recipes_created_at ON saved_recipes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own recipes (or all if not authenticated)
CREATE POLICY "Users can view their own recipes" ON saved_recipes
  FOR SELECT
  USING (
    user_id IS NULL OR
    user_id = auth.uid()
  );

-- Policy: Users can insert their own recipes
CREATE POLICY "Users can insert their own recipes" ON saved_recipes
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR
    user_id = auth.uid()
  );

-- Policy: Users can update their own recipes
CREATE POLICY "Users can update their own recipes" ON saved_recipes
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own recipes
CREATE POLICY "Users can delete their own recipes" ON saved_recipes
  FOR DELETE
  USING (user_id = auth.uid());
