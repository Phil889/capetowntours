import { NextRequest, NextResponse } from 'next/server';
import { tourService } from '@/lib/tour-management/tour-service';

// GET - List all templates
export async function GET(req: NextRequest) {
  try {
    const result = await tourService.listTemplates();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      templates: result.templates,
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create template from existing tour
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, tourId } = body;
    
    if (!name || !tourId) {
      return NextResponse.json(
        { error: 'Template name and tour ID are required' },
        { status: 400 }
      );
    }

    const result = await tourService.createTemplate(name, tourId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { template: result.template },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// PUT - Create tour from template
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, overrides } = body;
    
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const result = await tourService.createFromTemplate(templateId, overrides || {});

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { tour: result.tour },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating tour from template:', error);
    return NextResponse.json(
      { error: 'Failed to create tour from template' },
      { status: 500 }
    );
  }
}
