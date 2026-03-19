const { OpenAI } = require("openai");

// Initialize OpenAI client
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

/**
 * Fallback response system for common student queries.
 * Works even if the AI model is loading or the network is down.
 */
function getFallbackResponse(message) {
  const msg = message.toLowerCase().trim();

  // Basic Greetings
  if (msg.includes("hi") || msg.includes("hello")) {
    return "Hello 👋! I'm your AI study buddy. How can I help you with your learning today?";
  }

  // Course & Content Queries
  if (msg.includes("what is this course about") || (msg.includes("about") && msg.includes("course"))) {
    return "This course covers important topics with simple explanations, real-world examples, and hands-on learning to help you master the subject!";
  }

  if (msg.includes("course") || msg.includes("program")) {
    return "This course will help you understand concepts step-by-step with practical examples and clear 1:1 guidance.";
  }

  if (msg.includes("lesson")) {
    return `This lesson explains key concepts in a simple way. If you're stuck, try breaking it into smaller parts or re-watching the specific section 👍`;
  }

  // Study Help
  if (msg.includes("help") || msg.includes("困") || msg.includes("assist")) {
    return "Sure 😊 You can ask me about specific lessons, complex concepts, or anything you don't fully understand yet!";
  }

  if (msg.includes("difficult") || msg.includes("hard") || msg.includes("stuck")) {
    return "No worries at all 😄 Learning takes time! Try revising the lesson step-by-step, and I can help simplify any part for you!";
  }

  if (msg.includes("exam") || msg.includes("test") || msg.includes("quiz")) {
    return "The best way to prepare is to focus on understanding core concepts rather than just memorizing. Practice questions will help a lot 💯";
  }

  // Pleasantries & Closing
  if (msg.includes("thank") || msg.includes("thx") || msg.includes("appreciate")) {
    return "You're very welcome 🙌 Happy learning, and don't hesitate to ask more!";
  }

  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see ya")) {
    return "Goodbye 👋 Keep learning and stay consistent with your study schedule!";
  }

  return null;
}

/**
 * AI Chat Controller with Smart Fallback
 */
const chat = async (req, res) => {
  try {
    const { message, lessonTitle } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // 1. Check for Instant Fallback Response
    const fallback = getFallbackResponse(message);
    if (fallback) {
      console.log(`[AI-CHAT] Returning instant fallback for: "${message}"`);
      return res.json({ reply: fallback });
    }

    // 2. No fallback? Try real AI (DeepSeek-R1)
    console.log(`[AI-CHAT] Calling AI for: "${message}" (Lesson: ${lessonTitle || 'General'})`);
    
    try {
      const completion = await client.chat.completions.create({
        model: "deepseek-ai/DeepSeek-R1:novita",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI tutor for students. Explain concepts simply, step-by-step, and with examples."
          },
          {
            role: "user",
            content: `Lesson: ${lessonTitle || "General"}\nQuestion: ${message}`
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const aiReply = completion.choices[0].message.content;
      console.log("[AI-CHAT] AI success.");
      return res.json({ reply: aiReply.trim() });

    } catch (aiError) {
      console.error("[AI-CHAT] AI Invocation failed:", aiError.message);
      
      // Secondary Fallback if AI is loading (503) or failing
      if (aiError.status === 503 || aiError.message?.includes("loading")) {
        return res.status(503).json({ 
          reply: "I'm currently waking up... 🤖 Give me a few seconds and I'll be ready to answer that complex question!" 
        });
      }

      return res.json({
        reply: "I'm having a little trouble connecting to my brain 🤖 but I can still answer basic questions if you keep it simple!"
      });
    }

  } catch (error) {
    console.error("CRITICAL AI ERROR:", error);
    return res.status(500).json({
      reply: "Oops! Something went wrong behind the scenes. Please try again in a moment."
    });
  }
};

module.exports = { chat };
