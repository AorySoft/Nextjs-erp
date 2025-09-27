// This API route is no longer needed since we're using direct API calls
// The fetchEntities function in auth.ts handles entity fetching directly
// This file can be removed or kept for backward compatibility

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      message: 'This API route is deprecated. Use fetchEntities() function from auth.ts instead.',
      error: 'Use direct API calls instead of this route'
    },
    { status: 410 } // Gone
  );
}
