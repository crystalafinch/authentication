import OpenAI from 'openai';
import SLACK_MESSAGES from '@/consts/slack-messages';

export interface AnalyzedSlackMessages {
  sentiment?: string;
  confidence?: string;
}

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeSlackMessages(): Promise<AnalyzedSlackMessages> {
  const sys =
    'You take the JSON object of Slack messages and analyze user sentiment of the product. Be concise and uncertain when needed.';
  const user = `Slack messages: ${JSON.stringify(
    SLACK_MESSAGES
  )}\n\nReturn a paragraph describing your findings and JSON with keys: sentiment, confidence. If unsure, return an empty object.`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: user },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  try {
    const parsed = JSON.parse(res?.choices[0]?.message?.content || '{}');
    return parsed;
  } catch {
    return {};
  }
}
