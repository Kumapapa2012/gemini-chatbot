// server/check-models.js として作成し、node check-models.js で実行
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const models = await genAI.listModels();
console.log(models);