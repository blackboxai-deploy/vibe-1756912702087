import { NextResponse } from 'next/server';

// Simulate platform connection status
const platformsStatus = [
  {
    platform: 'TripAdvisor',
    status: 'connected',
    lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reviewCount: 1247,
    apiHealth: 'healthy',
    rateLimit: {
      remaining: 450,
      total: 500,
      resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }
  },
  {
    platform: 'Google Maps',
    status: 'extracting',
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    reviewCount: 892,
    apiHealth: 'healthy',
    rateLimit: {
      remaining: 234,
      total: 300,
      resetTime: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    }
  },
  {
    platform: 'Booking.com',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    reviewCount: 634,
    apiHealth: 'healthy',
    rateLimit: {
      remaining: 180,
      total: 200,
      resetTime: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }
  },
  {
    platform: 'Expedia',
    status: 'error',
    lastSync: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    reviewCount: 423,
    apiHealth: 'degraded',
    error: 'Rate limit exceeded - retrying in 15 minutes',
    rateLimit: {
      remaining: 0,
      total: 100,
      resetTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }
  }
];

export async function GET() {
  try {
    // Simulate real-time status updates
    const currentTime = new Date().toISOString();
    
    const updatedStatus = platformsStatus.map(platform => ({
      ...platform,
      lastChecked: currentTime,
      uptime: Math.random() > 0.1 ? '99.9%' : '98.2%'
    }));

    return NextResponse.json({
      success: true,
      platforms: updatedStatus,
      totalReviews: platformsStatus.reduce((sum, p) => sum + p.reviewCount, 0),
      activeConnections: platformsStatus.filter(p => p.status === 'connected').length,
      timestamp: currentTime
    });
  } catch (error) {
    console.error('Error fetching platform status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { platform, action } = await request.json();
    
    // Simulate platform actions like reconnect, pause, etc.
    switch (action) {
      case 'reconnect':
        return NextResponse.json({
          success: true,
          message: `Reconnecting to ${platform}...`,
          status: 'connecting'
        });
      
      case 'pause':
        return NextResponse.json({
          success: true,
          message: `Pausing extraction from ${platform}`,
          status: 'paused'
        });
      
      case 'resume':
        return NextResponse.json({
          success: true,
          message: `Resuming extraction from ${platform}`,
          status: 'extracting'
        });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error handling platform action:', error);
    return NextResponse.json(
      { error: 'Failed to perform platform action' },
      { status: 500 }
    );
  }
}