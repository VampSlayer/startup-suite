import { GoogleGenerativeAI } from '@google/generative-ai';

export interface UserStory {
  id: string;
  title: string;
  description: string;
}

export interface Task {
  id: string;
  storyId?: string;
  title: string;
  description: string;
}

export interface AcceptanceCriteria {
  id: string;
  storyId?: string;
  description: string;
}

export interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expectedResult: string;
}

export interface FeatureBreakdown {
  userStories: UserStory[];
  tasks: Task[];
  acceptanceCriteria: AcceptanceCriteria[];
  testCases: TestCase[];
}

const getModel = (apiKey: string, modelName: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' }
  });
};

export const generateUserStories = async (apiKey: string, model: string, featureIdea: string, refinement?: string): Promise<UserStory[]> => {
  const prompt = `You are an expert product manager. Break down the following feature idea into a list of User Stories.
${refinement ? `\nUSER'S ADDITIONAL INSTRUCTIONS:\n"${refinement}"\nPlease strictly follow these instructions when generating the stories.\n` : ''}
Feature Idea: "${featureIdea}"

Please return ONLY a valid JSON object matching the exact structure below. 
Use unique short IDs (e.g., US-1, US-2).
{
  "userStories": [
    { "id": "US-1", "title": "As a user...", "description": "So that..." }
  ]
}`;
  const response = await getModel(apiKey, model).generateContent(prompt);
  const text = (await response.response).text();
  return JSON.parse(text).userStories;
};

export const generateTasks = async (apiKey: string, model: string, stories: UserStory[], refinement?: string): Promise<Task[]> => {
  const prompt = `You are an expert engineering manager. Based on these User Stories, generate a list of engineering tasks needed to implement them.
${refinement ? `\nUSER'S ADDITIONAL INSTRUCTIONS:\n"${refinement}"\nPlease strictly follow these instructions when generating the tasks.\n` : ''}
Stories:
${JSON.stringify(stories, null, 2)}

Please return ONLY a valid JSON object matching the exact structure below. 
Use unique short IDs (e.g., T-1, T-2).
{
  "tasks": [
    { "id": "T-1", "storyId": "US-1", "title": "Implement API", "description": "..." }
  ]
}`;
  const response = await getModel(apiKey, model).generateContent(prompt);
  const text = (await response.response).text();
  return JSON.parse(text).tasks;
};

export const generateAcceptanceCriteria = async (apiKey: string, model: string, stories: UserStory[], refinement?: string): Promise<AcceptanceCriteria[]> => {
  const prompt = `You are an expert product manager. Based on these User Stories, generate the Acceptance Criteria for each.
${refinement ? `\nUSER'S ADDITIONAL INSTRUCTIONS:\n"${refinement}"\nPlease strictly follow these instructions when generating the criteria.\n` : ''}
Stories:
${JSON.stringify(stories, null, 2)}

Please return ONLY a valid JSON object matching the exact structure below. 
Use unique short IDs (e.g., AC-1, AC-2).
{
  "acceptanceCriteria": [
    { "id": "AC-1", "storyId": "US-1", "description": "The API should return 200 OK" }
  ]
}`;
  const response = await getModel(apiKey, model).generateContent(prompt);
  const text = (await response.response).text();
  return JSON.parse(text).acceptanceCriteria;
};

export const generateTestCases = async (apiKey: string, model: string, stories: UserStory[], acs: AcceptanceCriteria[], refinement?: string): Promise<TestCase[]> => {
  const prompt = `You are an expert QA engineer. Based on these User Stories and Acceptance Criteria, generate specific Test Cases.
${refinement ? `\nUSER'S ADDITIONAL INSTRUCTIONS:\n"${refinement}"\nPlease strictly follow these instructions when generating the test cases.\n` : ''}
Stories:
${JSON.stringify(stories, null, 2)}

Acceptance Criteria:
${JSON.stringify(acs, null, 2)}

Please return ONLY a valid JSON object matching the exact structure below. 
Use unique short IDs (e.g., TC-1, TC-2).
{
  "testCases": [
    { "id": "TC-1", "title": "Test successful login", "steps": ["Enter valid credentials", "Click login"], "expectedResult": "User is redirected to dashboard" }
  ]
}`;
  const response = await getModel(apiKey, model).generateContent(prompt);
  const text = (await response.response).text();
  return JSON.parse(text).testCases;
};
