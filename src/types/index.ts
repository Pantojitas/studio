export interface Topic {
  id: string;
  name: string;
  averageRating?: number; // Made optional as it might not always be present or relevant
  tags: string[];
}

export interface Community {
  id: string;
  topicId: string; // For regular communities, linked to a Topic. For AI, could be a special marker.
  name: string;
  description: string;
  rating?: number; // Optional, especially for AI-suggested communities
  membersCount?: number; // Optional
  subtopics?: string[]; // As per mock data, useful for UI
  isAISuggested?: boolean; // Flag to indicate if the community was suggested by AI
  imageUrl?: string; // Optional image for the community card
  dataAiHint?: string; // Optional hint for AI image search if a placeholder is used
}
