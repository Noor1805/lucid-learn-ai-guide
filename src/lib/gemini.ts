import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.initialize(apiKey);
    }
  }

  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async simplifyText(text: string): Promise<{ summary: string; keyPoints: string[] }> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are an educational AI assistant. Your task is to simplify complex text while preserving important information. 

Return your response in this exact JSON format:
{
  "summary": "A clear, simplified version of the text that's easy to understand",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]
}

Make the summary concise but comprehensive. Extract 3-5 key points as separate items.

Please simplify this text: ${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No response from Gemini');
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          summary: content,
          keyPoints: [
            'Main concept from the original text',
            'Supporting details and evidence',
            'Key terminology and definitions',
            'Practical applications',
            'Important conclusions'
          ]
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to simplify text. Please check your API key and try again.');
    }
  }

  async generateStudyPlan(topics: string[], targetDate: string): Promise<Array<{
    week: number;
    topic: string;
    hours: number;
    tasks: string[];
  }>> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const weeksAvailable = Math.ceil(
        (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
      );

      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
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

Create a realistic study plan that distributes topics evenly across the available weeks.
Each week should have 4-6 specific, actionable tasks.
Hours should be reasonable (5-15 per week depending on topic complexity).

Create a study plan for these topics: ${topics.join(', ')}. 
Target completion date: ${targetDate}. 
Available weeks: ${weeksAvailable}.
Make it realistic and well-structured.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No response from Gemini');
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Fallback plan if JSON parsing fails
        return topics.map((topic, index) => ({
          week: index + 1,
          topic,
          hours: Math.floor(Math.random() * 10) + 5,
          tasks: [
            `Review fundamentals of ${topic}`,
            `Practice exercises and problems`,
            `Complete assignments and projects`,
            `Take practice tests and review`
          ]
        }));
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate study plan. Please check your API key and try again.');
    }
  }

  async getChatResponse(message: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are LearnMate, an intelligent educational AI assistant. Your purpose is to help students learn better by:

- Explaining complex concepts in simple terms
- Providing step-by-step solutions
- Offering study tips and strategies
- Answering academic questions across all subjects
- Being encouraging and supportive

Keep responses clear, educational, and helpful. Use examples when appropriate.

Student question: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get chat response. Please check your API key and try again.');
    }
  }

  async generateQuiz(text: string): Promise<{ title: string; questions: Array<{ question: string; options: string[]; correct: number; explanation?: string }> }> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Create a quiz from this text: "${text}". 

Return JSON in this exact format:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Create 5-10 multiple choice questions that test understanding of the key concepts.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch (parseError) {
        return {
          title: "Quiz: Understanding Key Concepts",
          questions: [
            {
              question: "What is the main topic discussed in this text?",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correct: 0,
              explanation: "This is a sample question."
            }
          ]
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        title: "Quiz: Understanding Key Concepts", 
        questions: [
          {
            question: "What is the main topic discussed in this text?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: 0,
            explanation: "This is a sample question."
          }
        ]
      };
    }
  }

  async generateFlashcards(text: string): Promise<Array<{ front: string; back: string }>> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Create flashcards from this text: "${text}".

Return JSON array in this exact format:
[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Create 5-15 flashcards that help memorize key concepts, terms, and facts.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch (parseError) {
        return [
          { front: "Sample Question", back: "Sample Answer" },
          { front: "Key Term", back: "Definition" }
        ];
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return [
        { front: "Sample Question", back: "Sample Answer" },
        { front: "Key Term", back: "Definition" }
      ];
    }
  }

  async solveProblemStepByStep(problem: string): Promise<{
    problem: string;
    answer: string;
    steps: Array<{ step: number; description: string; explanation: string; formula?: string }>;
    concepts: string[];
    tips: string[];
  }> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Solve this problem step by step: "${problem}"

Return JSON in this exact format:
{
  "problem": "Restated problem",
  "answer": "Final answer",
  "steps": [
    {
      "step": 1,
      "description": "What we're doing in this step",
      "explanation": "Why we're doing this",
      "formula": "Any formula used (optional)"
    }
  ],
  "concepts": ["Concept 1", "Concept 2"],
  "tips": ["Tip 1", "Tip 2"]
}

Provide detailed step-by-step solution with explanations.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch (parseError) {
        return {
          problem: problem,
          answer: "Sample answer",
          steps: [
            {
              step: 1,
              description: "Analyze the problem",
              explanation: "First we need to understand what's being asked"
            }
          ],
          concepts: ["Problem solving"],
          tips: ["Take it step by step"]
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        problem: problem,
        answer: "Unable to solve at this time",
        steps: [],
        concepts: [],
        tips: ["Try breaking the problem into smaller parts"]
      };
    }
  }

  async exploreCareerPaths(concept: string): Promise<{
    career_paths: Array<{
      title: string;
      description: string;
      skills_required: string[];
      salary_range: string;
      growth_outlook: string;
      education_requirements: string;
      related_fields: string[];
    }>;
    industry_trends: string[];
    skill_recommendations: string[];
    certification_suggestions: string[];
  }> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Explore career paths related to: "${concept}"

Return JSON in this exact format:
{
  "career_paths": [
    {
      "title": "Job Title",
      "description": "What this role involves",
      "skills_required": ["Skill 1", "Skill 2"],
      "salary_range": "$XX,000 - $YY,000",
      "growth_outlook": "Positive/Strong/Moderate",
      "education_requirements": "Degree requirements",
      "related_fields": ["Field 1", "Field 2"]
    }
  ],
  "industry_trends": ["Trend 1", "Trend 2"],
  "skill_recommendations": ["Skill 1", "Skill 2"],
  "certification_suggestions": ["Cert 1", "Cert 2"]
}

Provide 3-5 relevant career paths with current market information.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch (parseError) {
        return {
          career_paths: [
            {
              title: `${concept} Specialist`,
              description: `Work with ${concept} technologies and applications`,
              skills_required: [concept, "Problem solving", "Communication"],
              salary_range: "$50,000 - $80,000",
              growth_outlook: "Positive",
              education_requirements: "Bachelor's degree or equivalent experience",
              related_fields: ["Technology", "Engineering"]
            }
          ],
          industry_trends: [`Growing demand for ${concept} expertise`],
          skill_recommendations: [concept, "Critical thinking"],
          certification_suggestions: [`${concept} certification`]
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        career_paths: [],
        industry_trends: [],
        skill_recommendations: [],
        certification_suggestions: []
      };
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();