import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
// In production, this should be stored in environment variables
let genAI: GoogleGenerativeAI;

export const getGeminiModel = () => {
  genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  if (!genAI) {
    throw new Error('Gemini API not initialized. Call initializeGemini first.');
  }
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 2048,
    },
  });
};

export interface GeminiStreamResponse {
  stream: AsyncGenerator<string>;
  error?: string;
}

export enum AICommand {
    ImproveWriting = 'Cải thiện văn bản',
    Emojify = 'Thêm emoji',
    MakeShorter = 'Rút gọn',
    MakeLonger = 'Mở rộng',
    MakeSEO = 'Chuẩn SEO',
  }
  
  const PROMPTS = {
    [AICommand.ImproveWriting]:
      'Cải thiện đoạn văn sau bằng cách sửa ngữ pháp, tăng độ rõ ràng và chuyên nghiệp:',
    [AICommand.Emojify]:
      'Thêm các emoji phù hợp vào đoạn văn sau để tăng tính hấp dẫn:',
    [AICommand.MakeShorter]:
      'Rút gọn đoạn văn sau một cách ngắn gọn và súc tích mà vẫn giữ được thông tin chính:',
    [AICommand.MakeLonger]:
      'Mở rộng đoạn văn sau bằng cách thêm chi tiết, ví dụ hoặc giải thích phù hợp:',
    [AICommand.MakeSEO]:
      'Viết bài chuẩn SEO cho website TKhang bán thời trang nam:',
  };
  

export const processTextWithGeminiStream = async (
  text: string,
  command: AICommand
): Promise<GeminiStreamResponse> => {
  if (!text.trim()) {
    return {
      stream: (async function* () {
        yield '';
      })(),
      error: 'Please provide text to process',
    };
  }

  try {
    const model = getGeminiModel();
    const prompt = `${PROMPTS[command]}\n\n"""${text}"""\n\nOnly return the processed text without any additional explanations or comments.`;

    const result = await model.generateContentStream(prompt);
    
    const stream = (async function* () {
      let fullResponse = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        yield fullResponse;
      }
    })();

    return { stream };
  } catch (error) {
    console.error('Error processing text with Gemini:', error);
    return {
      stream: (async function* () { yield text; })(),
      error: 'Failed to process text. Please try again.',
    };
  }
};
