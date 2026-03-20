import { GoogleGenerativeAI } from "@google/generative-ai";

// WARNING: It is highly recommended to use environment variables for your API key
// and to run this logic on a server, not in the browser, to avoid exposing your key.
const apiKey = "AIzaSyBl_9U31vnkHBXE6PIgPAI524Ked8hh_To"; // The key from your error log
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;