'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Types
interface Review {
  id: string;
  platform: 'tripadvisor' | 'google' | 'booking' | 'expedia';
  rating: number;
  title: string;
  content: string;
  author: string;
  date: string;
  country: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  aiResponse?: string;
  responseStatus: 'pending' | 'generated' | 'sent';
}

interface PlatformStatus {
  platform: string;
  status: 'connected' | 'extracting' | 'error' | 'disconnected';
  lastSync: string;
  reviewCount: number;
}

interface FilterOptions {
  platform?: string;
  sentiment?: string;
  rating?: number;
  country?: string;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  action?: string;
}

// Mock Data
const mockReviews: Review[] = [
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

const mockPlatformStatus: PlatformStatus[] = [
  { platform: 'TripAdvisor', status: 'connected', lastSync: '2024-01-15 10:30', reviewCount: 1247 },
  { platform: 'Google Maps', status: 'extracting', lastSync: '2024-01-15 10:25', reviewCount: 892 },
  { platform: 'Booking.com', status: 'connected', lastSync: '2024-01-15 10:28', reviewCount: 634 },
  { platform: 'Expedia', status: 'error', lastSync: '2024-01-15 09:45', reviewCount: 423 }
];

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Reseña negativa crítica',
    description: 'Nueva reseña de 1 estrella en TripAdvisor requiere respuesta inmediata',
    timestamp: '2024-01-15 10:30',
    action: 'Responder ahora'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Caída en calificación promedio',
    description: 'La calificación promedio bajó de 4.2 a 3.9 en las últimas 24 horas',
    timestamp: '2024-01-15 09:15',
    action: 'Ver análisis'
  }
];

// Analytics Data
const sentimentData = [
  { name: 'Positivo', value: 65, color: '#10B981' },
  { name: 'Neutral', value: 20, color: '#F59E0B' },
  { name: 'Negativo', value: 15, color: '#EF4444' }
];

const platformData = [
  { platform: 'TripAdvisor', reviews: 1247, rating: 4.2 },
  { platform: 'Google', reviews: 892, rating: 4.1 },
  { platform: 'Booking', reviews: 634, rating: 4.3 },
  { platform: 'Expedia', reviews: 423, rating: 3.9 }
];

const trendData = [
  { date: '2024-01-08', rating: 4.1, reviews: 12 },
  { date: '2024-01-09', rating: 4.2, reviews: 15 },
  { date: '2024-01-10', rating: 4.0, reviews: 18 },
  { date: '2024-01-11', rating: 4.3, reviews: 14 },
  { date: '2024-01-12', rating: 3.9, reviews: 22 },
  { date: '2024-01-13', rating: 4.1, reviews: 16 },
  { date: '2024-01-14', rating: 4.2, reviews: 19 },
  { date: '2024-01-15', rating: 4.0, reviews: 13 }
];

const countryData = [
  { country: 'España', reviews: 456, percentage: 23 },
  { country: 'Estados Unidos', reviews: 398, percentage: 20 },
  { country: 'Francia', reviews: 312, percentage: 16 },
  { country: 'Reino Unido', reviews: 287, percentage: 14 },
  { country: 'Alemania', reviews: 234, percentage: 12 },
  { country: 'Italia', reviews: 189, percentage: 9 },
  { country: 'Otros', reviews: 124, percentage: 6 }
];

export default function TourismDashboard() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter reviews based on current filters
  useEffect(() => {
    let filtered = reviews;

    if (filters.platform) {
      filtered = filtered.filter(review => review.platform === filters.platform);
    }
    if (filters.sentiment) {
      filtered = filtered.filter(review => review.sentiment === filters.sentiment);
    }
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === filters.rating);
    }
    if (filters.country) {
      filtered = filtered.filter(review => review.country === filters.country);
    }

    setFilteredReviews(filtered);
  }, [reviews, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const generateAIResponse = async (review: Review) => {
    setIsGeneratingResponse(true);
    
    setTimeout(() => {
      const responses = {
        positive: `Estimado/a ${review.author}, nos alegra enormemente saber que disfrutó de su estadía. Sus comentarios positivos son muy valiosos para nuestro equipo. Esperamos tener el placer de recibirle nuevamente en el futuro.`,
        negative: `Estimado/a ${review.author}, lamentamos profundamente que su experiencia no haya cumplido con sus expectativas. Hemos tomado nota de sus comentarios y estamos trabajando para mejorar los aspectos mencionados. Nos gustaría invitarle a una futura estadía para demostrarle las mejoras implementadas.`,
        neutral: `Estimado/a ${review.author}, agradecemos sus comentarios sobre su estadía. Su feedback es muy valioso para nosotros y nos ayuda a mejorar continuamente nuestros servicios.`
      };

      const updatedReviews = reviews.map(r => 
        r.id === review.id 
          ? { ...r, aiResponse: responses[review.sentiment], responseStatus: 'generated' as const }
          : r
      );
      
      setReviews(updatedReviews);
      setIsGeneratingResponse(false);
    }, 2000);
  };

  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'extracting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'extracting': return 'Extrayendo';
      case 'error': return 'Error';
      default: return 'Desconectado';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tripadvisor': return '🦉';
      case 'google': return '🗺️';
      case 'booking': return '🏨';
      case 'expedia': return '✈️';
      default: return '📱';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const totalReviews = filteredReviews.length;
  const averageRating = filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;
  const positiveReviews = filteredReviews.filter(r => r.sentiment === 'positive').length;
  const negativeReviews = filteredReviews.filter(r => r.sentiment === 'negative').length;
  const pendingResponses = filteredReviews.filter(r => r.responseStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tourism Review Management Platform
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión inteligente de reseñas con IA avanzada
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={refreshData}
              disabled={refreshing}
            >
              {refreshing ? '⟳' : '↻'} Actualizar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
              ↓ Exportar
            </button>
          </div>
        </div>

        {/* Platform Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🌐 Estado de Plataformas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mockPlatformStatus.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(platform.status)}`} />
                  <div>
                    <p className="font-medium">{platform.platform}</p>
                    <p className="text-sm text-gray-500">{getStatusText(platform.status)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{platform.reviewCount}</p>
                  <p className="text-xs text-gray-500">{platform.lastSync}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reseñas</p>
                <p className="text-2xl font-bold">{totalReviews}</p>
              </div>
              <div className="text-3xl text-blue-600">💬</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <div className="text-3xl text-yellow-500">⭐</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positivas</p>
                <p className="text-2xl font-bold text-green-600">{positiveReviews}</p>
              </div>
              <div className="text-3xl text-green-600">📈</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Negativas</p>
                <p className="text-2xl font-bold text-red-600">{negativeReviews}</p>
              </div>
              <div className="text-3xl text-red-600">📉</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingResponses}</p>
              </div>
              <div className="text-3xl text-orange-600">⏰</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {mockAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚠️ Alertas Inteligentes
            </h2>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 p-4 rounded ${
                  alert.type === 'critical' ? 'border-l-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
                    {alert.action && (
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        {alert.action}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'reviews', label: 'Reseñas' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'responses', label: 'Respuestas IA' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sentiment Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Distribución de Sentimientos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      {sentimentData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform Performance */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Rendimiento por Plataforma</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="platform" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reviews" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Trend Analysis */}
                  <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Tendencia de Calificaciones</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="rating" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={{ fill: '#10B981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">🔍 Filtros Avanzados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.platform || 'all'} 
                      onChange={(e) => handleFilterChange('platform', e.target.value)}
                    >
                      <option value="all">Todas las plataformas</option>
                      <option value="tripadvisor">TripAdvisor</option>
                      <option value="google">Google</option>
                      <option value="booking">Booking</option>
                      <option value="expedia">Expedia</option>
                    </select>

                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.sentiment || 'all'} 
                      onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                    >
                      <option value="all">Todos los sentimientos</option>
                      <option value="positive">Positivo</option>
                      <option value="negative">Negativo</option>
                      <option value="neutral">Neutral</option>
                    </select>

                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.rating?.toString() || 'all'} 
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                    >
                      <option value="all">Todas las calificaciones</option>
                      <option value="5">5 estrellas</option>
                      <option value="4">4 estrellas</option>
                      <option value="3">3 estrellas</option>
                      <option value="2">2 estrellas</option>
                      <option value="1">1 estrella</option>
                    </select>

                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.country || 'all'} 
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                    >
                      <option value="all">Todos los países</option>
                      <option value="ES">España</option>
                      <option value="US">Estados Unidos</option>
                      <option value="FR">Francia</option>
                      <option value="UK">Reino Unido</option>
                      <option value="DE">Alemania</option>
                    </select>

                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={clearFilters}
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getPlatformIcon(review.platform)}</span>
                          <div>
                            <h3 className="font-semibold">{review.title}</h3>
                            <p className="text-sm text-gray-600">
                              {review.author} • {review.date} • {review.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm ${getSentimentColor(review.sentiment)}`}>
                            {getSentimentIcon(review.sentiment)} {review.sentiment}
                          </span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{review.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 rounded text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            review.responseStatus === 'sent' ? 'bg-green-100 text-green-800' :
                            review.responseStatus === 'generated' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {review.responseStatus === 'sent' ? 'Enviada' :
                             review.responseStatus === 'generated' ? 'Generada' : 'Pendiente'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {review.responseStatus === 'pending' && (
                            <button 
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                              onClick={() => generateAIResponse(review)}
                              disabled={isGeneratingResponse}
                            >
                              💬 Generar Respuesta
                            </button>
                          )}
                          
                          {review.responseStatus === 'generated' && (
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                              📤 Enviar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Geographic Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      🗺️ Distribución Geográfica
                    </h3>
                    <div className="space-y-3">
                      {countryData.map((country) => (
                        <div key={country.country} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{country.country}</span>
                          <div className="flex items-center gap-3 flex-1 mx-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${country.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">
                              {country.percentage}%
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 w-16 text-right">
                            {country.reviews}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Time Analytics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      ⏰ Tiempo de Respuesta
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-100 rounded">
                        <span className="text-sm font-medium">Respuestas &lt; 24h</span>
                        <span className="text-lg font-bold text-green-600">78%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-100 rounded">
                        <span className="text-sm font-medium">Respuestas 24-48h</span>
                        <span className="text-lg font-bold text-yellow-600">15%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-100 rounded">
                        <span className="text-sm font-medium">Respuestas &gt; 48h</span>
                        <span className="text-lg font-bold text-red-600">7%</span>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tiempo promedio</span>
                        <span className="text-lg font-bold">18.5 horas</span>
                      </div>
                    </div>
                  </div>

                  {/* Keyword Analysis */}
                  <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Análisis de Keywords</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-green-600 mb-3">Keywords Positivas</h4>
                        <div className="space-y-2">
                          {['servicio', 'ubicación', 'limpieza', 'personal', 'desayuno'].map((keyword) => (
                            <div key={keyword} className="flex justify-between items-center">
                              <span className="text-sm">{keyword}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">
                                {Math.floor(Math.random() * 50) + 20}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-3">Keywords Negativas</h4>
                        <div className="space-y-2">
                          {['ruido', 'limpieza', 'wifi', 'aire acondicionado', 'check-in'].map((keyword) => (
                            <div key={keyword} className="flex justify-between items-center">
                              <span className="text-sm">{keyword}</span>
                              <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm">
                                {Math.floor(Math.random() * 30) + 5}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'responses' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Gestión de Respuestas con IA</h3>
                  <div className="space-y-4">
                    {reviews.filter(r => r.responseStatus !== 'sent').map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{review.title}</h4>
                            <p className="text-sm text-gray-600">
                              {review.author} • {review.platform} • {renderStars(review.rating)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${getSentimentColor(review.sentiment)}`}>
                            {review.sentiment}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{review.content}</p>
                        
                        {review.aiResponse ? (
                          <div className="bg-blue-50 p-3 rounded mb-3">
                            <label className="text-sm font-medium text-blue-800">Respuesta Generada por IA:</label>
                            <p className="text-sm text-blue-700 mt-1">{review.aiResponse}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3 rounded mb-3">
                            <p className="text-sm text-gray-600">No hay respuesta generada aún</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {review.responseStatus === 'pending' && (
                            <button 
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                              onClick={() => generateAIResponse(review)}
                              disabled={isGeneratingResponse}
                            >
                              {isGeneratingResponse ? (
                                <>⟳ Generando...</>
                              ) : (
                                <>💬 Generar Respuesta IA</>
                              )}
                            </button>
                          )}
                          
                          {review.responseStatus === 'generated' && (
                            <>
                              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                📤 Enviar Respuesta
                              </button>
                              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                ✏️ Editar
                              </button>
                              <button 
                                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                onClick={() => generateAIResponse(review)}
                              >
                                🔄 Regenerar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}