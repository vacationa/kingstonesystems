import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Validation schema
const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general', 'improvement'], {
    required_error: 'Feedback type is required',
    invalid_type_error: 'Invalid feedback type',
  }),
  details: z.string()
    .min(5, 'Please provide at least 5 characters describing your feedback')
    .max(1000, 'Feedback details too long (max 1000 characters)')
    .trim(),
  screenshot_url: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);

    // Insert feedback into database
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        user_email: user.email,
        type: validatedData.type,
        details: validatedData.details,
        screenshot_url: validatedData.screenshot_url || null,
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to save feedback',
        details: error.message
      }, { status: 500 });
    }

    // Log feedback submission for admin tracking
    console.log(`📝 Feedback submitted:`, {
      id: data.id,
      type: validatedData.type,
      user_email: user.email,
      timestamp: data.created_at
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: data.id,
        created_at: data.created_at,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Optional: GET endpoint to retrieve feedback (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Only allow specific admin users to view all feedback
    const adminEmails = ['hangal@usc.edu']; // Add your admin emails here
    
    let query = supabase
      .from('feedback')
      .select('id, type, details, user_email, created_at, screenshot_url')
      .order('created_at', { ascending: false });

    // If not admin, only show user's own feedback
    if (!adminEmails.includes(user.email || '')) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve feedback'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });
    
  } catch (error) {
    console.error('Feedback retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
