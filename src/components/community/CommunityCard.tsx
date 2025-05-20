// src/components/community/CommunityCard.tsx
import type { Community } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const textColor = 'text-foreground'; // Use themed foreground
  const iconColor = 'text-muted-foreground';
  const cardStripColor = 'bg-[hsl(var(--card-strip))]';

  // Use community.name for placeholder if imageUrl is missing
  const placeholderText = community.name.replace(/\s/g, '+');
  const effectiveImageUrl = community.imageUrl || `https://placehold.co/600x400.png?text=${placeholderText}`;
  const showImage = !!community.imageUrl; // Only show image if explicitly provided

  return (
    <Card className="flex flex-col overflow-hidden bg-card shadow-lg rounded-lg relative h-full">
      <div className={`absolute right-0 top-0 bottom-0 w-2 ${cardStripColor}`}></div>
      
      {showImage && (
        <div className="relative w-full h-40">
          <Image 
            src={effectiveImageUrl} 
            alt={community.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={community.dataAiHint || "community topic"}
          />
        </div>
      )}
      
      <CardHeader className="pb-2 pr-10"> {/* pr-10 to avoid overlap with strip */}
        <div className="flex items-center justify-between mb-1">
          <CardTitle className={`text-lg font-bold ${textColor}`}>{community.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Users size={16} className={iconColor} aria-label="Community icon" />
            <Star size={16} className={iconColor} aria-label="Favorite icon" />
          </div>
        </div>
        {community.isAISuggested && (
          <div className="flex items-center text-xs text-amber-600 mb-1">
            <AlertTriangle size={14} className="mr-1" />
            <span>AI Suggested</span>
          </div>
        )}
        {community.description && (
            <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {community.description}
            </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col pb-4 pt-2 pr-10"> {/* Adjusted padding, pr-10 to avoid overlap with strip */}
        <Button
          variant="default"
          size="sm"
          className="bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-md px-3 py-1 text-sm self-start mb-3"
        >
          learn...
        </Button>

        {community.subtopics && community.subtopics.length > 0 && (
          <ul className="space-y-1 mt-1">
            {community.subtopics.slice(0, 3).map((subtopic, index) => (
              <li key={index} className={`text-sm ${textColor} leading-normal`}>
                {subtopic}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      {/* CardFooter removed to match the new design */}
    </Card>
  );
}
