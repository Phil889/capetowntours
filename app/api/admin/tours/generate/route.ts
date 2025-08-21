import { NextRequest, NextResponse } from 'next/server';
import { tourService } from '@/lib/tour-management/tour-service';
import { AIGenerationRequest } from '@/types/tour-management';

// POST - Generate content with AI
export async function POST(req: NextRequest) {
  try {
    const body: AIGenerationRequest = await req.json();
    
    // Validate request
    if (!body.type) {
      return NextResponse.json(
        { error: 'Generation type is required' },
        { status: 400 }
      );
    }

    if (!body.input || (!body.input.title && body.type === 'full_tour')) {
      return NextResponse.json(
        { error: 'Tour title is required for full tour generation' },
        { status: 400 }
      );
    }

    const result = await tourService.generateWithAI(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      logId: result.logId,
      tokensUsed: result.tokensUsed,
    });
  } catch (error: any) {
    console.error('Error generating content with AI:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
