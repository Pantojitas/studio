// src/lib/actions.ts
"use server";

import type { Topic, Community } from "@/types";
import { adminDB } from "./firebaseAdmin"; // Placeholder for Firebase Admin
import { suggestSimilarCommunities } from "@/ai/flows/suggest-similar-communities";

// Simulate a delay to mimic network latency
const networkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchTopicsAction(query: string): Promise<Topic[]> {
  await networkDelay(500); // Simulate network delay

  if (!query.trim()) {
    return [];
  }

  try {
    // In a real Firebase app:
    // const topicsRef = adminDB.collection('topics');
    // const snapshot = await topicsRef
    //   .where('name', '>=', query) // This is a prefix search, for contains, you'd need a more complex setup or third-party search like Algolia/Typesense
    //   .where('name', '<=', query + '\uf8ff')
    //   .get();
    //
    // Simplified mock search:
    const snapshot = await adminDB.collection('topics').where('name', '>=', query).get();


    if (snapshot.empty) {
      return [];
    }

    const topics: Topic[] = [];
    snapshot.docs.forEach(doc => {
      topics.push({ id: doc.id, ...doc.data() } as Topic);
    });
    // Simple relevance: exact matches first, then partials (mock handles this by nature of filter)
    return topics.sort((a, b) => a.name.toLowerCase().indexOf(query.toLowerCase()) - b.name.toLowerCase().indexOf(query.toLowerCase()));
  } catch (error) {
    console.error("Error searching topics:", error);
    // Consider throwing a more specific error or returning an error object
    throw new Error("Failed to search topics.");
  }
}

export async function getCommunitiesForTopicAction(
  topicId: string,
): Promise<{ communities: Community[]; aiSuggested?: boolean; topicName?: string }> {
  await networkDelay(800);

  try {
    // Fetch topic details first to get name and tags for AI if needed
    const topicDoc = await adminDB.collection('topics').doc(topicId).get();
    if (!topicDoc.exists) {
      throw new Error("Topic not found.");
    }
    const topicData = topicDoc.data() as Topic;

    // In a real Firebase app:
    // const communitiesRef = adminDB.collection('communities');
    // const snapshot = await communitiesRef
    //   .where('topicId', '==', topicId)
    //   .where('rating', '>=', 4.0)
    //   .get();
    //
    // Mocked query:
    const snapshot = await adminDB.collection('communities')
      .where('topicId', '==', topicId)
      .where('rating', '>=', 4.0) // This chaining is simulated in the mock
      .get();

    let communities: Community[] = [];
    if (!snapshot.empty) {
      snapshot.docs.forEach(doc => {
        communities.push({ id: doc.id, ...doc.data(), imageUrl: doc.data()?.imageUrl || `https://placehold.co/300x200.png?text=${doc.data()?.name.replace(/\s/g,'+')}` } as Community);
      });
    }
    
    if (communities.length > 0) {
      return { communities, aiSuggested: false, topicName: topicData.name };
    }

    // No communities found, try AI suggestions
    console.log(`No direct communities for ${topicData.name}. Trying AI suggestions.`);
    const aiSuggestions = await suggestSimilarCommunities({
      topicName: topicData.name,
      tags: topicData.tags,
    });

    if (aiSuggestions && aiSuggestions.communities.length > 0) {
      const aiCommunityList: Community[] = aiSuggestions.communities.map((sugg, index) => ({
        id: `ai-${topicId}-${index}-${Date.now()}`, // Generate a unique ID
        topicId: topicId, // Or a special marker like 'ai-suggested'
        name: sugg.name,
        description: sugg.description,
        // rating, membersCount, subtopics will be undefined or have default values
        isAISuggested: true,
        imageUrl: `https://placehold.co/300x200.png?text=${sugg.name.replace(/\s/g,'+')}`,
        dataAiHint: "abstract concept" // Generic hint for AI suggestions
      }));
      return { communities: aiCommunityList, aiSuggested: true, topicName: topicData.name };
    }

    return { communities: [], topicName: topicData.name }; // No direct or AI communities
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw new Error("Failed to fetch communities.");
  }
}
