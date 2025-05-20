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
      // Ensure data exists and conforms to Topic structure before pushing
      const data = doc.data();
      if (data && typeof data.name === 'string' && Array.isArray(data.tags)) {
        topics.push({ id: doc.id, ...data } as Topic);
      } else {
        console.warn(`Topic document ${doc.id} has malformed data. Skipping.`);
      }
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
      console.error(`Topic with ID ${topicId} not found.`);
      throw new Error("Topic not found.");
    }
    
    const topicData = topicDoc.data() as Topic | undefined;

    if (!topicData || typeof topicData.name !== 'string') {
      console.error("Fetched topic data is malformed: name is missing or invalid.", topicData);
      throw new Error("Malformed topic data received: name is missing or invalid.");
    }
    // Tags are crucial for AI suggestions. If missing/invalid, AI might not work well, but direct communities can still be fetched.
    if (!Array.isArray(topicData.tags)) {
        console.warn(`Tags for topic ${topicData.name} (ID: ${topicId}) are missing or not an array. AI suggestions might be affected.`);
    }

    const currentTopicName = topicData.name; // Now safe to use

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
        const communityData = doc.data();
        if (communityData) {
          const name = typeof communityData.name === 'string' ? communityData.name : 'Community';
          const communityEntry: Community = {
            id: doc.id,
            topicId: communityData.topicId,
            name: name,
            description: communityData.description || "",
            rating: communityData.rating,
            membersCount: communityData.membersCount,
            subtopics: communityData.subtopics,
            isAISuggested: false, 
            imageUrl: communityData.imageUrl || `https://placehold.co/300x200.png?text=${encodeURIComponent(name)}`,
            dataAiHint: communityData.dataAiHint || name.toLowerCase().split(' ').slice(0, 2).join(' ') 
          };
          communities.push(communityEntry);
        } else {
          console.warn(`Document ${doc.id} in communities snapshot had no data. Skipping.`);
        }
      });
    }
    
    if (communities.length > 0) {
      return { communities, aiSuggested: false, topicName: currentTopicName };
    }

    // No communities found, try AI suggestions
    const tagsForAI = Array.isArray(topicData.tags) ? topicData.tags : [];
    
    console.log(`No direct communities for ${currentTopicName}. Trying AI suggestions with tags: [${tagsForAI.join(', ')}]`);
    const aiSuggestions = await suggestSimilarCommunities({
      topicName: currentTopicName, 
      tags: tagsForAI,       
    });

    if (aiSuggestions && aiSuggestions.communities.length > 0) {
      const aiCommunityList: Community[] = aiSuggestions.communities.map((sugg, index) => {
        const name = typeof sugg.name === 'string' ? sugg.name : 'AI Suggested Community';
        return {
          id: `ai-${topicId}-${index}-${Date.now()}`, 
          topicId: topicId, 
          name: name,
          description: sugg.description || "",
          isAISuggested: true,
          imageUrl: `https://placehold.co/300x200.png?text=${encodeURIComponent(name)}`,
          dataAiHint: "abstract concept" 
        };
      });
      return { communities: aiCommunityList, aiSuggested: true, topicName: currentTopicName };
    }

    return { communities: [], topicName: currentTopicName }; 
  } catch (error) {
    console.error(`Error in getCommunitiesForTopicAction for topicId ${topicId}:`, error);
    throw new Error("Failed to fetch communities.");
  }
}
