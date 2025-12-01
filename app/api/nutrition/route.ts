import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all food logs (optional date filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query = supabase
      .from('food_logs')
      .select('*')
      .order('logged_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (date) {
      query = query.eq('logged_date', date);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ foodLogs: data || [] });
  } catch (error) {
    console.error('Error fetching food logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food logs' },
      { status: 500 }
    );
  }
}

// POST - Log a new food entry
export async function POST(request: NextRequest) {
  try {
    const foodLog = await request.json();

    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        meal_name: foodLog.mealName,
        meal_type: foodLog.mealType,
        calories: foodLog.calories,
        protein: foodLog.protein,
        carbs: foodLog.carbs,
        fats: foodLog.fats,
        notes: foodLog.notes || '',
        logged_date: foodLog.loggedDate || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ foodLog: data });
  } catch (error) {
    console.error('Error logging food:', error);
    return NextResponse.json(
      { error: 'Failed to log food' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a food log
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Food log ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting food log:', error);
    return NextResponse.json(
      { error: 'Failed to delete food log' },
      { status: 500 }
    );
  }
}
