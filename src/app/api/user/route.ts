import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Make request to your backend API
    const response = await fetch('https://beta.ysn.tv/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: 'Failed to fetch users from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the data as-is from your backend
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in /api/user:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
