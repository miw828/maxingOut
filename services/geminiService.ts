
import { GoogleGenAI, Type } from "@google/genai";
import type { Profile } from '../types';
import { MOCK_CLUBS } from '../constants';

// NOTE: The API key is sourced from `process.env.API_KEY`, which is assumed to be configured in the environment.
// Do not add any UI or code to manage this key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getClubRecommendations = async (profile: Profile) => {
  const model = "gemini-2.5-flash";
  
  const clubList = MOCK_CLUBS.map(club => `- ${club.name}: ${club.description}`).join('\n');

  const prompt = `
    You are a helpful student advisor for Lehigh University. Based on the following student profile and a list of available clubs, recommend the top 3 clubs that would be a great fit for the student. Provide a brief, one-sentence explanation for each recommendation.

    Student Profile:
    - Hobbies: ${profile.hobbies}
    - Enjoys: ${profile.enjoys}
    - Major: ${profile.major}
    - Minor: ${profile.minor || 'N/A'}
    - Semester Goals: ${profile.goals}

    Available Clubs:
    ${clubList}

    Only recommend clubs from the provided list.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              clubName: {
                type: Type.STRING,
                description: "The name of the recommended club.",
              },
              reason: {
                type: Type.STRING,
                description: "A brief, one-sentence reason for the recommendation.",
              },
            },
            required: ["clubName", "reason"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received empty response from API");
    }
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error getting club recommendations:", error);
    // Fallback in case of API error
    return [
      { clubName: "Outdoor Club", reason: "A great way to de-stress and explore the local area." },
      { clubName: "Coding Community", reason: "Perfect for honing your technical skills outside of class." },
      { clubName: "The Brown and White", reason: "An excellent opportunity to improve your writing and get involved in campus news." },
    ];
  }
};
