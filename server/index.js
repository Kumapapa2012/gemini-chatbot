import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/api/chat', async (req, res) => {
  const prompt = req.query.prompt;

  // SSEのヘッダー設定
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

// server/index.js の generateContent 部分
try {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-pro-preview", // モデル名を更新
  });

  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    // 思考プロセスを有効にするための設定（最新SDKの仕様）
    generationConfig: {
      thinkingConfig: {
        includeThoughts: true,
        thinkingLevel: "high" // または "medium", "low"
      }
    }
  });

  for await (const chunk of result.stream) {
    // 思考パートが含まれているかチェック
    // 注：SDKのバージョンにより parts[0].thought のような形式になる場合があります
    const thoughtPart = chunk.candidates[0]?.content?.parts?.find(p => p.thought === true);
    const textPart = chunk.candidates[0]?.content?.parts?.find(p => !p.thought);

    if (thoughtPart) {
      res.write(`event: thinking\ndata: ${JSON.stringify({ content: thoughtPart.text })}\n\n`);
    }
    
    if (textPart) {
      res.write(`event: answer\ndata: ${JSON.stringify({ content: textPart.text })}\n\n`);
    }
  }
} catch (error) {
  // 404エラーが出る場合は、再度 ListModels で利用可能なモデル名を確認してください
  console.error("API Error:", error);
} finally {
    res.end();
  }
});

app.listen(3001, () => console.log('Server started on http://localhost:3001'));