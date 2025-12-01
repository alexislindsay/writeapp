import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all workouts (optional date filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query = supabase
      .from('workouts')
      .select('*')
      .order('logged_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (date) {
      query = query.eq('logged_date', date);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ workouts: data || [] });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST - Log a new workout
export async function POST(request: NextRequest) {
  try {
    const workout = await request.json();

    const { data, error } = await supabase
      .from('workouts')
      .insert({
        workout_type: workout.workoutType,
        duration: workout.duration,
        intensity: workout.intensity,
        calories_burned: workout.caloriesBurned,
        notes: workout.notes || '',
        logged_date: workout.loggedDate || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ workout: data });
  } catch (error) {
    console.error('Error logging workout:', error);
    return NextResponse.json(
      { error: 'Failed to log workout' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a workout
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}
