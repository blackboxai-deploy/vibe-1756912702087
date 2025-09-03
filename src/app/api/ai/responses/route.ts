import { NextRequest, NextResponse } from 'next/server';

interface ReviewData {
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  author: string;
  rating: number;
  platform: string;
}

export async function POST(request: NextRequest) {
  try {
    const { reviewData } = await request.json() as { reviewData: ReviewData };
    
    // Simulate AI response generation using our custom endpoint
    const aiResponse = await generateAIResponse(reviewData);
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(reviewData: ReviewData): Promise<string> {
  const { content, sentiment, author, rating, platform } = reviewData;
  
  // Prepare the prompt for AI
  const systemPrompt = `Eres un asistente experto en gestión hotelera y atención al cliente. Tu tarea es generar respuestas profesionales, empáticas y personalizadas a reseñas de hoteles.

Instrucciones:
1. Responde siempre en español
2. Usa un tono profesional pero cálido
3. Personaliza la respuesta con el nombre del autor
4. Adapta el tono según el sentimiento de la reseña
5. Para reseñas positivas: agradece y invita a regresar
6. Para reseñas negativas: disculpate, reconoce el problema y ofrece soluciones
7. Para reseñas neutrales: agradece el feedback y menciona mejoras continuas
8. Máximo 150 palabras
9. Incluye una llamada a la acción apropiada`;

  const userPrompt = `Reseña de ${author} en ${platform}:
Calificación: ${rating}/5 estrellas
Sentimiento: ${sentiment}
Contenido: "${content}"

Genera una respuesta profesional y personalizada.`;

  try {
    // Use our custom endpoint configuration
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SVj8nQl37pbK92',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('AI generation error:', error);
    
    // Fallback responses
    const fallbackResponses = {
      positive: `Estimado/a ${author}, nos alegra enormemente saber que disfrutó de su estadía en nuestro hotel. Sus comentarios positivos son muy valiosos para todo nuestro equipo y nos motivan a seguir brindando un servicio excepcional. Esperamos tener el placer de recibirle nuevamente en el futuro y superar una vez más sus expectativas. ¡Gracias por elegirnos!`,
      negative: `Estimado/a ${author}, lamentamos profundamente que su experiencia no haya cumplido con sus expectativas. Hemos tomado nota de todos los puntos que menciona y ya estamos trabajando activamente para mejorar los aspectos señalados. Su feedback es invaluable para nosotros. Como muestra de nuestro compromiso, nos gustaría invitarle a una futura estadía para demostrarle las mejoras implementadas. Por favor, póngase en contacto con nuestro equipo de atención al cliente.`,
      neutral: `Estimado/a ${author}, agradecemos sinceramente sus comentarios sobre su estadía con nosotros. Su feedback constructivo es muy valioso y nos ayuda a identificar áreas de mejora. Tomaremos en cuenta todas sus sugerencias para seguir evolucionando y brindar experiencias cada vez mejores a nuestros huéspedes. Esperamos poder demostrarle nuestras mejoras en una próxima visita.`
    };
    
    return fallbackResponses[sentiment];
  }
}