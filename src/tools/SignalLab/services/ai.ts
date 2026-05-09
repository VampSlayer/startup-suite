import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LandingPage {
  heroHeadline: string;
  heroSubheadline: string;
  features: { title: string; description: string }[];
  waitlistCta: string;
}

export interface AdVariation {
  headline: string;
  primaryText: string;
}

export interface AdCampaign {
  platform: string;
  variations: AdVariation[];
  estimatedCpc: string;
  estimatedCtr: string;
}

export interface InterviewTurn {
  speaker: 'Interviewer' | 'Customer';
  text: string;
}

export interface Interview {
  id: string;
  personaName: string;
  demographic: string;
  transcript: InterviewTurn[];
  keyTakeaways: string[];
}

export interface ValidationScore {
  overallScore: number;
  problemSeverityScore: number;
  marketDemandScore: number;
  easeOfReachScore: number;
  recommendation: string;
}

export interface SignalReport {
  concept: string;
  landingPage?: LandingPage;
  adCampaign?: AdCampaign;
  interviews: Interview[];
  validationScore?: ValidationScore;
}

const getModel = (apiKey: string, modelName: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ 
    model: modelName, 
    generationConfig: { responseMimeType: 'application/json' } 
  });
};

export const generateLandingPage = async (apiKey: string, modelName: string, concept: string, refinement?: string): Promise<LandingPage> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are an expert growth marketer and copywriter.
Given the user's startup concept, generate copy for a fake-door test landing page to collect waitlist emails.
Return a JSON object with the following schema:
{
  "heroHeadline": "Catchy H1",
  "heroSubheadline": "Descriptive H2",
  "features": [
    { "title": "Feature 1", "description": "Detail 1" },
    { "title": "Feature 2", "description": "Detail 2" },
    { "title": "Feature 3", "description": "Detail 3" }
  ],
  "waitlistCta": "Call to action text for the email input"
}`;

  const finalPrompt = refinement 
    ? `Concept: ${concept}\n\nRefinement instructions: ${refinement}\n\nUpdate the landing page copy based on these instructions.` 
    : `Concept: ${concept}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate landing page copy.");
  }
};

export const generateAdCampaign = async (apiKey: string, modelName: string, concept: string, landingPage: LandingPage, refinement?: string): Promise<AdCampaign> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are a performance marketing expert.
Given a startup concept and landing page copy, generate a mock ad campaign (e.g., Facebook or LinkedIn) to drive traffic.
Include estimated Cost Per Click (CPC) and Click-Through Rate (CTR) based on typical industry benchmarks for this niche.
Return a JSON object with the following schema:
{
  "platform": "e.g., Facebook, LinkedIn, Google Ads",
  "variations": [
    { "headline": "Ad 1 Headline", "primaryText": "Ad 1 copy" },
    { "headline": "Ad 2 Headline", "primaryText": "Ad 2 copy" }
  ],
  "estimatedCpc": "$X.XX",
  "estimatedCtr": "X.X%"
}`;

  const context = `Concept: ${concept}\nLanding Page Hero: ${landingPage.heroHeadline} - ${landingPage.heroSubheadline}`;
  const finalPrompt = refinement 
    ? `Context:\n${context}\n\nRefinement instructions: ${refinement}\n\nUpdate the ad campaign based on these instructions.` 
    : `Context:\n${context}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate ad campaign.");
  }
};

export const generateInterviews = async (apiKey: string, modelName: string, concept: string, refinement?: string): Promise<Interview[]> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are a user researcher conducting validation interviews (like The Mom Test).
Given the startup concept, simulate 2 distinct customer interviews.
For each interview, create a persona and a realistic transcript discussing their current workflows, pain points, and reaction to the concept.
Return a JSON array of objects with the following schema:
[{
  "id": "unique-id",
  "personaName": "Name",
  "demographic": "Role, Industry",
  "transcript": [
    { "speaker": "Interviewer", "text": "Question..." },
    { "speaker": "Customer", "text": "Answer..." }
  ],
  "keyTakeaways": ["takeaway 1", "takeaway 2"]
}]`;

  const finalPrompt = refinement 
    ? `Concept: ${concept}\n\nRefinement instructions: ${refinement}\n\nUpdate the interviews based on these instructions.` 
    : `Concept: ${concept}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate interviews.");
  }
};

export const generateValidationScore = async (apiKey: string, modelName: string, concept: string, adCampaign: AdCampaign, interviews: Interview[], refinement?: string): Promise<ValidationScore> => {
  const model = getModel(apiKey, modelName);
  const sysPrompt = `You are an expert startup advisor and data analyst.
Given the concept, ad campaign metrics, and customer interview takeaways, calculate a final validation score indicating if this idea has real demand.
Scores should be out of 100.
Return a JSON object with the following schema:
{
  "overallScore": 85,
  "problemSeverityScore": 90,
  "marketDemandScore": 80,
  "easeOfReachScore": 85,
  "recommendation": "A short, actionable paragraph on whether to proceed, pivot, or drop the idea based on the simulated signals."
}`;

  const context = `Concept: ${concept}
Ads: CPC ${adCampaign.estimatedCpc}, CTR ${adCampaign.estimatedCtr}
Interview 1 Takeaways: ${interviews[0]?.keyTakeaways.join(', ')}
Interview 2 Takeaways: ${interviews[1]?.keyTakeaways.join(', ')}`;

  const finalPrompt = refinement 
    ? `Context:\n${context}\n\nRefinement instructions: ${refinement}\n\nUpdate the score based on these instructions.` 
    : `Context:\n${context}`;

  const result = await model.generateContent([sysPrompt, finalPrompt]);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate validation score.");
  }
};
