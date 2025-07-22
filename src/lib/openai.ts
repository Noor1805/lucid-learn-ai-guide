import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.initialize(apiKey);
    }
  }

  initialize(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Only for demo - use backend in production
    });
  }

  async simplifyText(text: string): Promise<{ summary: string; keyPoints: string[] }> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an educational AI assistant. Your task is to simplify complex text while preserving important information. 
            
            Return your response in this exact JSON format:
            {
              "summary": "A clear, simplified version of the text that's easy to understand",
              "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]
            }
            
            Make the summary concise but comprehensive. Extract 3-5 key points as separate items.`
          },
          {
            role: 'user',
            content: `Please simplify this text: ${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
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
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to simplify text. Please check your API key and try again.');
    }
  }

  async generateStudyPlan(topics: string[], targetDate: string): Promise<Array<{
    week: number;
    topic: string;
    hours: number;
    tasks: string[];
  }>> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    try {
      const weeksAvailable = Math.ceil(
        (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
      );

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an educational AI that creates personalized study plans. 
            
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
            Hours should be reasonable (5-15 per week depending on topic complexity).`
          },
          {
            role: 'user',
            content: `Create a study plan for these topics: ${topics.join(', ')}. 
            Target completion date: ${targetDate}. 
            Available weeks: ${weeksAvailable}.
            Make it realistic and well-structured.`
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
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
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate study plan. Please check your API key and try again.');
    }
  }

  async getChatResponse(message: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are LearnMate, an intelligent educational AI assistant. Your purpose is to help students learn better by:
            
            - Explaining complex concepts in simple terms
            - Providing step-by-step solutions
            - Offering study tips and strategies
            - Answering academic questions across all subjects
            - Being encouraging and supportive
            
            Keep responses clear, educational, and helpful. Use examples when appropriate.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get chat response. Please check your API key and try again.');
    }
  }
}

// Singleton instance
export const openAIService = new OpenAIService();