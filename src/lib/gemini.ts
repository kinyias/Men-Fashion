import {
  pantsSizeChart,
  topSizeChart,
} from '@/components/products/detail/SizeGuide';
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
export const getGemini2Model = () => {
  genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  if (!genAI) {
    throw new Error('Gemini API not initialized. Call initializeGemini first.');
  }
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
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
      stream: (async function* () {
        yield text;
      })(),
      error: 'Failed to process text. Please try again.',
    };
  }
};

export interface SizeAnalysisResult {
  tops: {
    recommendedSize: string;
    explanation: string;
    fitType: string;
  };
  pants: {
    recommendedSize: string;
    explanation: string;
    fitType: string;
  };
}

export const analyzeSizeWithGemini = async (
  height: number,
  weight: number,
  bodyType: string
): Promise<SizeAnalysisResult> => {
  try {
    const model = getGemini2Model();
    const prompt = `Phân tích và đề xuất kích cỡ quần áo dựa trên các thông số sau:
Chiều cao: ${height} cm
Cân nặng: ${weight} kg
Kiểu thân hình: ${bodyType}

Và đây là bảng kích thước của áo:
${topSizeChart}
Và đây là bảng kích thước của quần:
${pantsSizeChart}

Hãy trả về kết quả theo định dạng JSON với các trường:
{
  "tops": {
    "recommendedSize": "kích cỡ đề xuất cho áo (XS, S, M, L, XL, XXL)",
    "explanation": "giải thích chi tiết lý do chọn kích cỡ áo",
    "fitType": "kiểu fit phù hợp cho áo (bó sát, tiêu chuẩn, rộng)"
  },
  "pants": {
    "recommendedSize": "kích cỡ đề xuất cho quần (28-43)",
    "explanation": "giải thích chi tiết lý do chọn kích cỡ quần",
    "fitType": "kiểu fit phù hợp cho quần (bó sát, tiêu chuẩn, rộng)"
  }
}
Chỉ trả về JSON, không thêm text khác.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned) as SizeAnalysisResult;
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Failed to analyze size recommendation');
    }
  } catch (error) {
    console.error('Error analyzing size:', error);
    throw new Error('Failed to analyze size. Please try again.');
  }
};
export interface RatingCheckResponse {
  isAppropriate: boolean;
  message: string;
}
export const checkRatingWithGemini = async (text: string): Promise<RatingCheckResponse> => {
  try {
    const model = getGemini2Model();
    const prompt = `Hãy kiểm tra đoạn văn sau đây có phù hợp với thuần phong mỹ tục của Việt Nam và không chứa nội dung tục tĩu, phản cảm hay vi phạm đạo đức hay văn hóa không. Nếu phù hợp, trả về kết quả:
    { "isAppropriate": true, "message": lý do phù hợp }
     Nếu không phù hợp, trả về:
     { "isAppropriate": false, "message": lý do không phù hợp cụ thể từ ngữ nào }
      Đây là đoạn văn cần kiểm tra:
      """${text}"""
    Chỉ trả về JSON, không thêm text khác.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = await response.text();
    const cleaned = textResponse.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as RatingCheckResponse;
  } catch (error) {
    console.error('Error checking rating with Gemini:', error);
    throw new Error('Failed to check rating. Please try again.');
  }
};
