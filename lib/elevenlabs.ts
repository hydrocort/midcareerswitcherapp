import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Default voice (Sarah)

export async function textToSpeech(text: string): Promise<Buffer> {
  const audio = await elevenlabs.generate({
    voice: VOICE_ID,
    text: text,
    model_id: 'eleven_monolingual_v1',
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audio) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

