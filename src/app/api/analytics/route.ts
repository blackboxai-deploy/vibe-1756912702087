import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data
  const analyticsData = {
    summary: {
      totalReviews: 3196,
      averageRating: 4.1,
      positiveReviews: 2077,
      negativeReviews: 479,
      neutralReviews: 640,
      pendingResponses: 156,
      responseTime: {
        average: 18.5,
        under24h: 78,
        between24_48h: 15,
        over48h: 7
      }
    },
    sentimentDistribution: [
      { name: 'Positivo', value: 65, color: '#10B981', count: 2077 },
      { name: 'Neutral', value: 20, color: '#F59E0B', count: 640 },
      { name: 'Negativo', value: 15, color: '#EF4444', count: 479 }
    ],
    platformPerformance: [
      { platform: 'TripAdvisor', reviews: 1247, rating: 4.2, growth: 8.5 },
      { platform: 'Google Maps', reviews: 892, rating: 4.1, growth: 12.3 },
      { platform: 'Booking.com', reviews: 634, rating: 4.3, growth: -2.1 },
      { platform: 'Expedia', reviews: 423, rating: 3.9, growth: 5.7 }
    ],
    trendData: [
      { date: '2024-01-08', rating: 4.1, reviews: 45, sentiment_score: 0.72 },
      { date: '2024-01-09', rating: 4.2, reviews: 52, sentiment_score: 0.75 },
      { date: '2024-01-10', rating: 4.0, reviews: 38, sentiment_score: 0.68 },
      { date: '2024-01-11', rating: 4.3, reviews: 61, sentiment_score: 0.78 },
      { date: '2024-01-12', rating: 3.9, reviews: 43, sentiment_score: 0.65 },
      { date: '2024-01-13', rating: 4.1, reviews: 55, sentiment_score: 0.71 },
      { date: '2024-01-14', rating: 4.2, reviews: 48, sentiment_score: 0.74 },
      { date: '2024-01-15', rating: 4.0, reviews: 39, sentiment_score: 0.69 }
    ],
    geographicDistribution: [
      { country: 'España', reviews: 735, percentage: 23, avgRating: 4.3 },
      { country: 'Estados Unidos', reviews: 639, percentage: 20, avgRating: 4.0 },
      { country: 'Francia', reviews: 511, percentage: 16, avgRating: 4.2 },
      { country: 'Reino Unido', reviews: 447, percentage: 14, avgRating: 4.1 },
      { country: 'Alemania', reviews: 383, percentage: 12, avgRating: 3.9 },
      { country: 'Italia', reviews: 287, percentage: 9, avgRating: 4.2 },
      { country: 'Otros', reviews: 194, percentage: 6, avgRating: 4.0 }
    ],
    keywordAnalysis: {
      positive: [
        { keyword: 'servicio', mentions: 234, sentiment: 0.89 },
        { keyword: 'ubicación', mentions: 198, sentiment: 0.85 },
        { keyword: 'limpieza', mentions: 167, sentiment: 0.82 },
        { keyword: 'personal', mentions: 156, sentiment: 0.87 },
        { keyword: 'desayuno', mentions: 145, sentiment: 0.83 },
        { keyword: 'instalaciones', mentions: 134, sentiment: 0.86 }
      ],
      negative: [
        { keyword: 'ruido', mentions: 89, sentiment: -0.78 },
        { keyword: 'wifi', mentions: 76, sentiment: -0.65 },
        { keyword: 'aire acondicionado', mentions: 67, sentiment: -0.82 },
        { keyword: 'check-in', mentions: 54, sentiment: -0.71 },
        { keyword: 'parking', mentions: 43, sentiment: -0.69 }
      ]
    },
    alerts: [
      {
        id: '1',
        type: 'critical',
        title: 'Reseña negativa crítica detectada',
        description: 'Nueva reseña de 1 estrella en TripAdvisor requiere respuesta inmediata',
        timestamp: new Date().toISOString(),
        priority: 'high',
        action: 'Responder inmediatamente'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Caída en calificación promedio',
        description: 'La calificación promedio bajó de 4.2 a 3.9 en las últimas 24 horas',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        action: 'Revisar causas'
      },
      {
        id: '3',
        type: 'info',
        title: 'Nuevo keyword trending',
        description: 'La palabra "limpieza" aparece con mayor frecuencia en reseñas recientes',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        action: 'Analizar tendencia'
      }
    ]
  };

  return NextResponse.json({
    success: true,
    data: analyticsData,
    generatedAt: new Date().toISOString()
  });
}