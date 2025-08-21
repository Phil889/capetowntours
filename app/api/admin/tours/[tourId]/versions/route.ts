import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/admin/tours/[tourId]/versions - Get version history
export async function GET(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
  try {
    const { tourId } = params;

    // Get all versions for this tour
    const { data: versions, error } = await supabase
      .from('tour_versions')
      .select('*')
      .eq('tour_id', tourId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error('Error fetching versions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch version history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error in GET /api/admin/tours/[tourId]/versions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tours/[tourId]/versions/restore - Restore a specific version
export async function POST(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
  try {
    const { tourId } = params;
    const body = await request.json();
    const { versionNumber } = body;

    if (!versionNumber) {
      return NextResponse.json(
        { error: 'Version number is required' },
        { status: 400 }
      );
    }

    // Call the restore function
    const { data, error } = await supabase
      .rpc('restore_tour_version', {
        p_tour_id: tourId,
        p_version_number: versionNumber
      });

    if (error) {
      console.error('Error restoring version:', error);
      return NextResponse.json(
        { error: 'Failed to restore version' },
        { status: 500 }
      );
    }

    // Get the updated tour
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', tourId)
      .single();

    if (tourError) {
      console.error('Error fetching restored tour:', tourError);
      return NextResponse.json(
        { error: 'Version restored but failed to fetch updated tour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully restored to version ${versionNumber}`,
      tour 
    });
  } catch (error) {
    console.error('Error in POST /api/admin/tours/[tourId]/versions/restore:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tours/[tourId]/versions/cleanup - Cleanup old versions
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
  try {
    // Clean up old versions (keep last 10)
    const { data, error } = await supabase
      .rpc('cleanup_old_versions');

    if (error) {
      console.error('Error cleaning up versions:', error);
      return NextResponse.json(
        { error: 'Failed to cleanup versions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${data} old versions` 
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/tours/[tourId]/versions/cleanup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
