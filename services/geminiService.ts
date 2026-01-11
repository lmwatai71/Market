import { GoogleGenAI, ChatSession, Type, FunctionDeclaration } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { sendVerificationCode, verifyVerificationCode } from "./verificationService";

let chatSession: ChatSession | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'mock-key' });
};

// Tool Definitions
const verificationTools: FunctionDeclaration[] = [
  {
    name: "send_verification_code",
    description: "Sends a 6-digit verification code to the provided phone number via SMS.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        phoneNumber: { type: Type.STRING, description: "The user's phone number." }
      },
      required: ["phoneNumber"]
    }
  },
  {
    name: "verify_verification_code",
    description: "Verifies the 6-digit code entered by the user.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        phoneNumber: { type: Type.STRING, description: "The user's phone number." },
        code: { type: Type.STRING, description: "The 6-digit code entered by the user." }
      },
      required: ["phoneNumber", "code"]
    }
  }
];

export const initializeChat = async (): Promise<ChatSession> => {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      tools: [{ functionDeclarations: verificationTools }]
    },
  });
  chatSession = chat;
  return chat;
};

export const sendMessageToGemini = async (message: string, image?: { data: string, mimeType: string }): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    return "Error: Could not initialize AI session.";
  }

  try {
    let response;
    
    // Initial Request
    if (image) {
      const parts = [
        { text: message || " " },
        {
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        }
      ];
      response = await chatSession.sendMessage({ message: parts as any });
    } else {
      response = await chatSession.sendMessage({ message });
    }

    // Function Calling Loop
    // We loop while the model wants to call functions
    let maxTurns = 5;
    while (response.functionCalls && response.functionCalls.length > 0 && maxTurns > 0) {
      maxTurns--;
      const functionCalls = response.functionCalls;
      const functionResponses = [];

      for (const call of functionCalls) {
        let result: any = { error: "Unknown function" };
        
        try {
          if (call.name === "send_verification_code") {
             const args = call.args as any;
             const status = await sendVerificationCode(args.phoneNumber);
             result = { status };
          } else if (call.name === "verify_verification_code") {
             const args = call.args as any;
             const isValid = await verifyVerificationCode(args.phoneNumber, args.code);
             result = { valid: isValid, message: isValid ? "Verification successful." : "Invalid code." };
          }
        } catch (e) {
          result = { error: "Function execution failed" };
        }

        functionResponses.push({
          id: call.id,
          name: call.name,
          response: { result }
        });
      }

      // Send function results back to the model
      response = await chatSession.sendMessage(functionResponses);
    }

    return response.text || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the network right now. Please try again later.";
  }
};

export const extractJsonFromResponse = (text: string): any | null => {
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonBlockRegex);
  
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON from AI response", e);
      return null;
    }
  }
  return null;
};