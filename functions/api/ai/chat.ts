import { handleGlsAiChat, type AiChatRequestBody } from '../../../shared/glsAiHandler.ts';

interface CloudflarePagesContext {
  request: Request;
  env: {
    GEMINI_API_KEY?: string;
  };
}

export async function onRequestPost(context: CloudflarePagesContext): Promise<Response> {
  try {
    const body = (await context.request.json().catch(() => ({}))) as AiChatRequestBody;
    const { status, payload } = await handleGlsAiChat(context.env?.GEMINI_API_KEY, body);
    return new Response(JSON.stringify(payload), {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno no serviço de IA.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
