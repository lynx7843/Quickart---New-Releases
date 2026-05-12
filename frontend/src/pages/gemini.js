import { GoogleGenerativeAI } from "@google/generative-ai";

// WARNING: It is highly recommended to use environment variables for your API key
// and to run this logic on a server, not in the browser, to avoid exposing your key.
const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;