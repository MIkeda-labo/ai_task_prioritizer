import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the GenAI client with GEMINI_API_KEY as requested for v1.17.0
// We do this outside the function if possible, but let's provide a factory or explicit function
// to ensure it uses the runtime environment variable correctly.
export function getAIClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Server configuration error: GEMINI_API_KEY is not set.');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export type PriorityItem = {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
};

export async function prioritizeUserTasks(profile: string, situation: string, tasks: string[]): Promise<{ results: PriorityItem[] }> {
  const ai = getAIClient();

  const prompt = `
あなたは優秀なAI生産性アシスタントです。必ず日本語で回答してください。

ユーザーのプロフィール: ${profile || '未記入'}
現在の状況: ${situation || '未記入'}

以下のタスク一覧を優先順位の高い順に並べ替えてください：
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

ユーザーのプロフィールと現在の状況を踏まえ、各タスクがなぜ急ぎ・重要なのかを簡潔に説明してください。
"reason"フィールドは必ず日本語で記述してください。
"priority"フィールドは必ず "High"、"Medium"、"Low" のいずれかの英語を使用してください。
`;

  // Define structured response schema
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      results: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING, description: "Task name" },
            priority: { type: Type.STRING, description: "Must be exactly 'High', 'Medium', or 'Low'" },
            reason: { type: Type.STRING, description: "Brief, engaging explanation" }
          },
          required: ["task", "priority", "reason"]
        }
      }
    },
    required: ["results"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const content = response.text;
    if (!content) throw new Error('No response from AI');

    return JSON.parse(content);
  } catch (error: any) {
    console.error('AI provider error:', error);
    throw new Error(error.message || 'Failed to analyze tasks.');
  }
}
