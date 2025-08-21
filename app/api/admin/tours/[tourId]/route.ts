import { NextRequest, NextResponse } from 'next/server';
import { tourService } from '@/lib/tour-management/tour-service';

// GET /api/admin/tours/[tourId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    const { tourId } = await params;
    const result = await tourService.getTour(tourId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json({ tour: result.tour });
  } catch (error: any) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}
