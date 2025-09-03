import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tourism Review Management Platform | Gestión Inteligente de Reseñas',
  description: 'Plataforma avanzada de gestión de reseñas turísticas con IA, análisis de sentimientos, respuestas automatizadas y analytics en tiempo real',
  keywords: ['tourism', 'reviews', 'management', 'AI', 'analytics', 'sentiment analysis', 'turismo', 'reseñas', 'hoteles'],
  authors: [{ name: 'Tourism Review Platform' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}