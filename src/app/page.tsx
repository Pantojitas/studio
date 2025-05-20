// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Topic, Community } from '@/types';
import { Header } from '@/components/layout/Header';
import { CommunityList } from '@/components/community/CommunityList';
import { searchTopicsAction, getCommunitiesForTopicAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Info, Frown, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedTopics, setSearchedTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [isAISuggested, setIsAISuggested] = useState(false);
  const [currentDisplayTitle, setCurrentDisplayTitle] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearchSubmit = useCallback(async () => {
    if (!searchTerm.trim()) {
      setSearchedTopics([]);
      setSelectedTopic(null);
      setCommunities([]);
      setCurrentDisplayTitle(null);
      return;
    }
    setIsLoadingTopics(true);
    setSearchedTopics([]);
    setSelectedTopic(null);
    setCommunities([]);
    setCurrentDisplayTitle(null);

    try {
      const topics = await searchTopicsAction(searchTerm);
      setSearchedTopics(topics);
      if (topics.length === 1) {
        // If only one topic, automatically select it
        handleTopicSelect(topics[0]);
      } else if (topics.length === 0) {
        setCurrentDisplayTitle(`No topics found for "${searchTerm}".`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to search for topics. Please try again.",
        variant: "destructive",
      });
      setCurrentDisplayTitle(`Error searching for "${searchTerm}".`);
    } finally {
      setIsLoadingTopics(false);
    }
  }, [searchTerm, toast]);

  const handleTopicSelect = useCallback(async (topic: Topic) => {
    setSelectedTopic(topic);
    setSearchedTopics([]); // Clear topic list once one is selected
    setIsLoadingCommunities(true);
    setCommunities([]);
    setIsAISuggested(false);
    setCurrentDisplayTitle(null);

    try {
      const result = await getCommunitiesForTopicAction(topic.id);
      setCommunities(result.communities);
      setIsAISuggested(result.aiSuggested || false);
      setCurrentDisplayTitle(result.topicName ? `Communities for "${result.topicName}"` : `Communities`);
      
      if (result.communities.length === 0) {
        if (result.aiSuggested) {
           // This case should be handled by AI suggestions logic below
        } else {
          setCurrentDisplayTitle(`No communities found for "${result.topicName}". Attempting to find similar ones...`);
          // The action already handles AI suggestion if no direct communities are found.
          // We are re-fetching here if the first call didn't yield AI results directly.
          // This logic can be simplified if the action always returns AI suggestions on empty.
          // For now, assuming the action's first response is what we work with.
          // If communities are empty and not AI suggested, the message is enough.
          // Let's rely on the `isAISuggested` flag.
        }
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to fetch communities for ${topic.name}.`,
        variant: "destructive",
      });
       setCurrentDisplayTitle(`Error fetching communities for "${topic.name}".`);
    } finally {
      setIsLoadingCommunities(false);
    }
  }, [toast]);
  
  // Debounced search for topics as user types (optional, currently on submit)
  // useEffect(() => {
  //   if (searchTerm.trim().length > 2) { // Trigger search if length > 2
  //     const debounceTimer = setTimeout(() => {
  //       handleSearchSubmit();
  //     }, 500); // 500ms debounce
  //     return () => clearTimeout(debounceTimer);
  //   } else {
  //     setSearchedTopics([]); // Clear if search term is too short
  //   }
  // }, [searchTerm, handleSearchSubmit]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />
      <main className="flex-grow container mx-auto px-4 py-8 pt-20 md:pt-24"> {/* pt-20 for header height */}
        
        {isLoadingTopics && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Searching topics...</p>
          </div>
        )}

        {!isLoadingTopics && searchedTopics.length > 0 && !selectedTopic && (
          <div className="my-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Topics Found:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchedTopics.map(topic => (
                <Button 
                  key={topic.id} 
                  variant="outline"
                  className="p-4 h-auto text-left flex flex-col items-start justify-start hover:bg-accent/50 transition-colors duration-150"
                  onClick={() => handleTopicSelect(topic)}
                >
                  <span className="font-medium text-primary text-base">{topic.name}</span>
                  {topic.averageRating && (
                    <span className="text-xs text-muted-foreground mt-1">Avg. Rating: {topic.averageRating.toFixed(1)} ★</span>
                  )}
                  {topic.tags && topic.tags.length > 0 && (
                     <p className="text-xs text-muted-foreground mt-1 truncate">Tags: {topic.tags.join(', ')}</p>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {isLoadingCommunities && (
           <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading communities...</p>
          </div>
        )}
        
        {!isLoadingCommunities && communities.length > 0 && (
          <>
            {isAISuggested && (
              <Card className="mb-6 border-amber-500 bg-amber-50 p-4">
                <CardContent className="flex items-center !pb-0">
                  <Wand2 className="h-6 w-6 mr-3 text-amber-700" />
                  <div>
                    <h3 className="font-semibold text-amber-800">AI Suggested Communities</h3>
                    <p className="text-sm text-amber-700">
                      We couldn't find direct communities for "{selectedTopic?.name}". Here are some AI-powered suggestions based on related topics:
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
             <CommunityList communities={communities} title={!isAISuggested ? currentDisplayTitle : undefined} />
          </>
        )}

        {!isLoadingTopics && !isLoadingCommunities && communities.length === 0 && currentDisplayTitle && (
          <div className="text-center py-10">
            {currentDisplayTitle.startsWith("No topics found") || currentDisplayTitle.startsWith("Error searching") ? (
              <Frown className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            ) : (
              <Info className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            )}
            <p className="text-xl text-muted-foreground">{currentDisplayTitle}</p>
            {currentDisplayTitle.startsWith("No communities found") && !isAISuggested && (
               <p className="text-sm text-muted-foreground mt-2">Try searching for a different topic or broaden your search terms.</p>
            )}
          </div>
        )}

        {!isLoadingTopics && !isLoadingCommunities && !selectedTopic && searchedTopics.length === 0 && !currentDisplayTitle && searchTerm && (
           <div className="text-center py-10">
             <Frown className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
             <p className="text-xl text-muted-foreground">No topics found for "{searchTerm}".</p>
             <p className="text-sm text-muted-foreground mt-2">Please check your spelling or try different keywords.</p>
           </div>
        )}
        
        {!searchTerm && !isLoadingTopics && !isLoadingCommunities && communities.length === 0 && searchedTopics.length === 0 && (
           <div className="text-center py-20">
            <Search className="h-20 w-20 mx-auto text-primary/30 mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-2">Explore Communities</h2>
            <p className="text-lg text-muted-foreground">
              Use the search bar above to find topics and join communities.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Search for things like 'Matemáticas', 'Python Programming', or 'Art History'.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

// Helper icon, not used yet, but can be if needed
function Search({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

