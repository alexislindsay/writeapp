-- Health & Wellness Hub Database Schema
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

-- ============================================================================
-- NUTRITION TRACKING TABLES
-- ============================================================================

-- Create food_logs table
CREATE TABLE food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL,
  meal_type TEXT, -- breakfast, lunch, dinner, snack
  calories INTEGER NOT NULL,
  protein DECIMAL(10, 2),
  carbs DECIMAL(10, 2),
  fats DECIMAL(10, 2),
  notes TEXT,
  logged_date DATE DEFAULT CURRENT_DATE
);

-- Create index on user_id for faster queries
CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);

-- Create index on logged_date for filtering by date
CREATE INDEX idx_food_logs_date ON food_logs(logged_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own food logs (or all if not authenticated)
CREATE POLICY "Users can view their own food logs" ON food_logs
  FOR SELECT
  USING (
    user_id IS NULL OR
    user_id = auth.uid()
  );

-- Policy: Users can insert their own food logs
CREATE POLICY "Users can insert their own food logs" ON food_logs
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR
    user_id = auth.uid()
  );

-- Policy: Users can update their own food logs
CREATE POLICY "Users can update their own food logs" ON food_logs
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own food logs
CREATE POLICY "Users can delete their own food logs" ON food_logs
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- WORKOUT TRACKING TABLES
-- ============================================================================

-- Create workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  intensity TEXT NOT NULL, -- low, medium, high
  calories_burned INTEGER,
  notes TEXT,
  logged_date DATE DEFAULT CURRENT_DATE
);

-- Create index on user_id for faster queries
CREATE INDEX idx_workouts_user_id ON workouts(user_id);

-- Create index on logged_date for filtering by date
CREATE INDEX idx_workouts_date ON workouts(logged_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own workouts (or all if not authenticated)
CREATE POLICY "Users can view their own workouts" ON workouts
  FOR SELECT
  USING (
    user_id IS NULL OR
    user_id = auth.uid()
  );

-- Policy: Users can insert their own workouts
CREATE POLICY "Users can insert their own workouts" ON workouts
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR
    user_id = auth.uid()
  );

-- Policy: Users can update their own workouts
CREATE POLICY "Users can update their own workouts" ON workouts
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own workouts
CREATE POLICY "Users can delete their own workouts" ON workouts
  FOR DELETE
  USING (user_id = auth.uid());
