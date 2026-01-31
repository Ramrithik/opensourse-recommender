require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No API Key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // List all available models
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // Dummy init to access manager if needed, but actually we use the manager directly via fetch usually, but SDK has listModels.
    
    // Actually, the SDK doesn't expose listModels easily on the main class in older versions, 
    // but let's try a simple fallback that usually works: gemini-1.0-pro
    console.log("Checking specific models...");
    
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Test");
        console.log(`✅ SUCCESS! Model '${modelName}' is working.`);
        return; // Stop at the first working one
      } catch (error) {
        console.log(`❌ Model '${modelName}' failed: ${error.message.split('[')[0]}`);
      }
    }
    
    console.log("😭 All models failed. Check your API Key permissions or Region.");

  } catch (error) {
    console.error("Error:", error);
  }
}

checkModels();