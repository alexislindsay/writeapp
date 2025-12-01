import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all saved recipes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ recipes: data || [] });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved recipes' },
      { status: 500 }
    );
  }
}

// POST - Save a new recipe
export async function POST(request: NextRequest) {
  try {
    const recipe = await request.json();

    const { data, error } = await supabase
      .from('saved_recipes')
      .insert({
        title: recipe.title,
        source: recipe.source,
        url: recipe.url,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        notes: recipe.notes || '',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ recipe: data });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a saved recipe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
