import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Idea {
  id: string;
  title: string;
  description: string;
  marketPotential: string;
}

export interface AudiencePersona {
  id: string;
  name: string;
  demographic: string;
  painPoints: string[];
  goals: string[];
}

export interface Competitor {
  id: string;
  name: string;
  strengths: string[];
  weaknesses: string[];
  differentiation: string;
}

export interface Pitch {
  elevatorPitch: string;
  valueProposition: string;
  keyFeatures: string[];
}

export interface Grant {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibility: string;
  alignment: string;
}

export interface ScoutReport {
  ideas: Idea[];
  selectedIdea?: Idea;
  audience: AudiencePersona[];
  competition: Competitor[];
  pitch?: Pitch;
  grants?: Grant[];
}

const getModel = (apiKey: string, modelName: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ 
    model: modelName, 
    generationConfig: { responseMimeType: 'application/json' } 
  });
};

export const generateIdeas = async (apiKey: string, modelName: string, prompt: string, refinement?: string): Promise<Idea[]> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are an expert startup founder and product strategist.
Given the user's problem space, industry, or concept, brainstorm 3-5 distinct, highly actionable product or business ideas.
Return a JSON array of objects with the following schema:
[{
  "id": "unique-id",
  "title": "Catchy Product Title",
  "description": "Detailed description of the idea and how it works.",
  "marketPotential": "Brief analysis of the market size and potential."
}]`;

  const finalPrompt = refinement 
    ? `Concept: ${prompt}\n\nRefinement instructions: ${refinement}\n\nUpdate the ideas based on these instructions.` 
    : `Concept: ${prompt}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate valid ideas. Please try again.");
  }
};

export const generateAudience = async (apiKey: string, modelName: string, selectedIdea: Idea, refinement?: string): Promise<AudiencePersona[]> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are a user researcher.
Given the selected idea, generate 2-4 target audience personas.
Return a JSON array of objects with the following schema:
[{
  "id": "unique-id",
  "name": "Persona Name (e.g., Enterprise Emma)",
  "demographic": "Age, Role, Income, etc.",
  "painPoints": ["pain point 1", "pain point 2"],
  "goals": ["goal 1", "goal 2"]
}]`;

  const ideaContext = `Idea Title: ${selectedIdea.title}\nDescription: ${selectedIdea.description}`;
  const finalPrompt = refinement
    ? `Idea:\n${ideaContext}\n\nRefinement instructions: ${refinement}\n\nUpdate the audience personas based on these instructions.`
    : `Idea:\n${ideaContext}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate valid audience personas.");
  }
};

export const generateCompetition = async (apiKey: string, modelName: string, selectedIdea: Idea, refinement?: string): Promise<Competitor[]> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are a market analyst.
Given the selected idea, identify 2-4 potential or existing competitors (can be indirect).
Return a JSON array of objects with the following schema:
[{
  "id": "unique-id",
  "name": "Competitor Name",
  "strengths": ["strength 1"],
  "weaknesses": ["weakness 1"],
  "differentiation": "How our idea differentiates from them"
}]`;

  const ideaContext = `Idea Title: ${selectedIdea.title}\nDescription: ${selectedIdea.description}`;
  const finalPrompt = refinement
    ? `Idea:\n${ideaContext}\n\nRefinement instructions: ${refinement}\n\nUpdate the competitors based on these instructions.`
    : `Idea:\n${ideaContext}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate valid competitors.");
  }
};

export const generatePitch = async (apiKey: string, modelName: string, selectedIdea: Idea, audience: AudiencePersona[], competitors: Competitor[], refinement?: string): Promise<Pitch> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are an expert pitch deck copywriter.
Given the idea, audience, and competition, generate a concise pitch and value proposition.
Return a JSON object with the following schema:
{
  "elevatorPitch": "A compelling 2-3 sentence elevator pitch.",
  "valueProposition": "A clear, 1-sentence value proposition.",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"]
}`;

  const context = `Idea Title: ${selectedIdea.title}\nDescription: ${selectedIdea.description}\nTarget Audience: ${audience.map(a => a.name).join(', ')}\nCompetitors: ${competitors.map(c => c.name).join(', ')}`;
  const finalPrompt = refinement
    ? `Context:\n${context}\n\nRefinement instructions: ${refinement}\n\nUpdate the pitch based on these instructions.`
    : `Context:\n${context}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate valid pitch.");
  }
};

export const generateGrants = async (apiKey: string, modelName: string, selectedIdea: Idea, refinement?: string): Promise<Grant[]> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are an expert in UK government funding and startup grants.
Given the selected idea, identify 2-3 potential UK government grants (e.g. Innovate UK, local council grants, specific tech grants) that this idea could align with.
Return a JSON array of objects with the following schema:
[{
  "id": "unique-id",
  "name": "Grant Name",
  "provider": "Grant Provider (e.g., Innovate UK)",
  "amount": "Typical funding amount or range",
  "eligibility": "Brief eligibility criteria",
  "alignment": "How this idea aligns with the grant's goals"
}]`;

  const ideaContext = `Idea Title: ${selectedIdea.title}\nDescription: ${selectedIdea.description}`;
  const finalPrompt = refinement
    ? `Idea:\n${ideaContext}\n\nRefinement instructions: ${refinement}\n\nUpdate the grants based on these instructions.`
    : `Idea:\n${ideaContext}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate valid grants.");
  }
};
