import { NextRequest, NextResponse } from 'next/server';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    platform: 'tripadvisor',
    rating: 5,
    title: 'Experiencia increíble',
    content: 'El hotel superó todas mis expectativas. El servicio fue excepcional, las habitaciones impecables y la ubicación perfecta. Definitivamente regresaré.',
    author: 'María González',
    date: '2024-01-15',
    country: 'ES',
    sentiment: 'positive',
    keywords: ['servicio', 'habitaciones', 'ubicación', 'excepcional'],
    responseStatus: 'pending'
  },
  {
    id: '2',
    platform: 'google',
    rating: 2,
    title: 'Decepcionante',
    content: 'El check-in fue muy lento, la habitación no estaba limpia y el aire acondicionado no funcionaba. El personal no fue muy servicial.',
    author: 'John Smith',
    date: '2024-01-14',
    country: 'US',
    sentiment: 'negative',
    keywords: ['check-in', 'limpieza', 'aire acondicionado', 'personal'],
    responseStatus: 'generated',
    aiResponse: 'Estimado John, lamentamos profundamente que su experiencia no haya cumplido con sus expectativas. Hemos tomado nota de los problemas mencionados y estamos trabajando para mejorar nuestros procesos de limpieza y mantenimiento.'
  },
  {
    id: '3',
    platform: 'booking',
    rating: 4,
    title: 'Buena estadía',
    content: 'En general fue una buena experiencia. El desayuno era variado y delicioso. Solo mejoraría el wifi que era un poco lento.',
    author: 'Pierre Dubois',
    date: '2024-01-13',
    country: 'FR',
    sentiment: 'positive',
    keywords: ['desayuno', 'wifi', 'experiencia'],
    responseStatus: 'sent'
  },
  {
    id: '4',
    platform: 'expedia',
    rating: 1,
    title: 'Terrible experiencia',
    content: 'Reservé una suite y me dieron una habitación estándar. El ruido era insoportable y no pudimos dormir. No recomiendo este lugar.',
    author: 'Anna Mueller',
    date: '2024-01-12',
    country: 'DE',
    sentiment: 'negative',
    keywords: ['suite', 'habitación', 'ruido', 'dormir'],
    responseStatus: 'pending'
  },
  {
    id: '5',
    platform: 'tripadvisor',
    rating: 5,
    title: 'Perfecto para familias',
    content: 'Excelente hotel para viajar con niños. Las instalaciones son fantásticas y el personal muy amable. La piscina y el área de juegos fueron un éxito.',
    author: 'Sarah Johnson',
    date: '2024-01-11',
    country: 'UK',
    sentiment: 'positive',
    keywords: ['familias', 'niños', 'piscina', 'personal'],
    responseStatus: 'generated',
    aiResponse: 'Querida Sarah, nos alegra enormemente saber que disfrutaron de su estadía familiar. Es maravilloso que nuestras instalaciones para niños hayan sido de su agrado. Esperamos recibirlos nuevamente en futuras vacaciones familiares.'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const sentiment = searchParams.get('sentiment');
  const rating = searchParams.get('rating');
  const country = searchParams.get('country');

  let filteredReviews = mockReviews;

  // Apply filters
  if (platform && platform !== 'all') {
    filteredReviews = filteredReviews.filter(review => review.platform === platform);
  }
  if (sentiment && sentiment !== 'all') {
    filteredReviews = filteredReviews.filter(review => review.sentiment === sentiment);
  }
  if (rating && rating !== 'all') {
    filteredReviews = filteredReviews.filter(review => review.rating === parseInt(rating));
  }
  if (country && country !== 'all') {
    filteredReviews = filteredReviews.filter(review => review.country === country);
  }

  return NextResponse.json({
    reviews: filteredReviews,
    total: filteredReviews.length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const newReview = await request.json();
    
    // In a real implementation, this would save to database
    const reviewWithId = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      responseStatus: 'pending'
    };

    return NextResponse.json({
      success: true,
      review: reviewWithId,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}