import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  constructor() {
    // Using integrated API key
    this.genAI = new GoogleGenerativeAI("AIzaSyC-w7q5zyDBhRg7mI5nFHCVLx2nY8FvKkI");
  }

  async simplifyText(text) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an educational AI assistant. Your task is to simplify complex text while preserving important information.

Return your response in this exact JSON format:
{
  "summary": "A clear, simplified version of the text that's easy to understand",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]
}

Make the summary concise but comprehensive. Extract 3-5 key points as separate items.

Please simplify this text: ${text}`;

      const result = await model.generateContent(prompt);
      const content = await result.response.text();

      if (!content) throw new Error("No response from Gemini");

      try {
        const cleaned = content.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
      } catch (e) {
        return {
          summary: content,
          keyPoints: [
            "Main concept from the original text",
            "Supporting details and evidence",
            "Key terminology and definitions",
            "Practical applications",
            "Important conclusions",
          ],
        };
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to simplify text. Please check your API key and try again.");
    }
  }

  async generateStudyPlan(topics, targetDate) {
    try {
      const weeksAvailable = Math.ceil(
        (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
      );

      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an educational AI that creates personalized study plans.

Return your response as a JSON array with this exact format:
[
  {
    "week": 1,
    "topic": "Topic name",
    "hours": 8,
    "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"]
  }
]

Create a realistic study plan for these topics: ${topics.join(", ")}.
Target completion date: ${targetDate}.
Available weeks: ${weeksAvailable}.
Make it realistic and well-structured.`;

      const result = await model.generateContent(prompt);
      const content = await result.response.text();

      try {
        return JSON.parse(content);
      } catch (e) {
        return topics.map((topic, i) => ({
          week: i + 1,
          topic,
          hours: Math.floor(Math.random() * 10) + 5,
          tasks: [
            `Review fundamentals of ${topic}`,
            "Practice exercises and problems",
            "Complete assignments and projects",
            "Take practice tests and review",
          ],
        }));
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate study plan. Please check your API key and try again.");
    }
  }

  async getChatResponse(message) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are LearnMate, an intelligent educational AI assistant.
Student question: ${message}`;

      const result = await model.generateContent(prompt);
      return (await result.response.text()) || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get chat response. Please check your API key and try again.");
    }
  }

  async generateQuiz(text) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a quiz from this text: "${text}". 
Return JSON in this format:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation"
    }
  ]
}`;

      const content = await (await model.generateContent(prompt)).response.text();

      try {
        return JSON.parse(content);
      } catch (e) {
        return {
          title: "Quiz: Understanding Key Concepts",
          questions: [{
            question: "What is the main topic discussed?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: 0,
            explanation: "Sample question.",
          }],
        };
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        title: "Quiz: Understanding Key Concepts",
        questions: [{
          question: "What is the main topic discussed?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "Sample question.",
        }],
      };
    }
  }

  async generateFlashcards(text) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are a study assistant. Read the text and generate helpful flashcards.

Text: "${text}"

Return ONLY a JSON array:
[
  {"front": "Question or term", "back": "Answer"}
]
`;

      const content = await (await model.generateContent(prompt)).response.text();

      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.every(card => card.front && card.back)) {
          return parsed;
        } else throw new Error("Invalid flashcard format");
      } catch (e) {
        return [
          { front: "What is a flashcard?", back: "A tool to memorize information." },
          { front: "Sample Term", back: "Sample Definition" },
        ];
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return [
        { front: "What is a flashcard?", back: "A tool to memorize information." },
        { front: "Sample Term", back: "Sample Definition" },
      ];
    }
  }

  async solveProblemStepByStep(problem) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Solve this problem step by step: "${problem}"
Return JSON in this format:
{
  "problem": "Restated problem",
  "answer": "Final answer",
  "steps": [{"step": 1, "description": "...", "explanation": "...", "formula": "..."}],
  "concepts": ["Concept 1"],
  "tips": ["Tip 1"]
}`;

      const content = await (await model.generateContent(prompt)).response.text();

      try {
        return JSON.parse(content);
      } catch (e) {
        return {
          problem,
          answer: "Sample answer",
          steps: [{ step: 1, description: "Analyze problem", explanation: "Understand what's being asked" }],
          concepts: ["Problem solving"],
          tips: ["Take it step by step"],
        };
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        problem,
        answer: "Unable to solve at this time",
        steps: [],
        concepts: [],
        tips: ["Try breaking it into parts"],
      };
    }
  }

  async exploreCareerPaths(concept) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Explore career paths related to: "${concept}"
Return JSON:
{
  "career_paths": [{"title": "...", "description": "...", "skills_required": [...], "salary_range": "...", "growth_outlook": "...", "education_requirements": "...", "related_fields": [...]}],
  "industry_trends": ["..."],
  "skill_recommendations": ["..."],
  "certification_suggestions": ["..."]
}`;

      const content = await (await model.generateContent(prompt)).response.text();

      try {
        return JSON.parse(content);
      } catch (e) {
        return {
          career_paths: [{
            title: `${concept} Specialist`,
            description: `Work with ${concept} technologies`,
            skills_required: [concept, "Problem solving", "Communication"],
            salary_range: "$50,000 - $80,000",
            growth_outlook: "Positive",
            education_requirements: "Bachelor's degree",
            related_fields: ["Technology", "Engineering"],
          }],
          industry_trends: [`Growing demand for ${concept}`],
          skill_recommendations: [concept, "Critical thinking"],
          certification_suggestions: [`${concept} certification`],
        };
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        career_paths: [],
        industry_trends: [],
        skill_recommendations: [],
        certification_suggestions: [],
      };
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();
