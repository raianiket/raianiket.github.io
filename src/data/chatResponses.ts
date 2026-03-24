import data from "./responses.json";

export interface ResponseEntry {
  text: string;
  suggestions: string[];
  topic?: string;
  expandedText?: string;
}

export const RESPONSES: { pattern: RegExp; response: ResponseEntry }[] =
  data.responses.map((r) => ({
    pattern: new RegExp(r.pattern),
    response: {
      text: r.text,
      suggestions: r.suggestions,
      topic: r.topic,
      expandedText: r.expandedText,
    },
  }));

export const FOLLOW_UPS: Record<string, ResponseEntry> = data.followUps;

export const TYPO_MAP: Record<string, string> = data.typoMap;

export const DEFAULT_RESPONSE: ResponseEntry = data.defaultResponse;

export const INITIAL_SUGGESTIONS: string[] = data.initialSuggestions;

export const RECRUITER_SUGGESTIONS: string[] = data.recruiterSuggestions;
