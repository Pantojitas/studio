// src/components/community/CommunityCard.tsx
import type { Community } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, AlertTriangle, Dot } from 'lucide-react';
import Image from 'next/image';

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const textColor = 'text-[#1A202C]'; // #1A202C
  const subtopicColor = 'text-muted-foreground'; // Mapped to #4A5568
  const iconColor = 'text-muted-foreground'; // Mapped to #4A5568
  const buttonTextColor = 'text-[hsl(var(--button-text-purple))]'; // #6B46C1
  const cardStripColor = 'bg-[hsl(var(--card-strip))]'; // #2D3748

  return (
    <Card className="flex flex-col overflow-hidden bg-[#F7F7F7] shadow-lg rounded-lg relative h-full">
      <div className={`absolute right-0 top-0 bottom-0 w-2 ${cardStripColor}`}></div>
      
      {community.imageUrl && (
        <div className="relative w-full h-40">
          <Image 
            src={community.imageUrl} 
            alt={community.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={community.dataAiHint as string || "community topic"}
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
        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {community.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3 pr-10"> {/* pr-10 to avoid overlap with strip */}
        {community.subtopics && community.subtopics.length > 0 && (
          <div>
            <h4 className={`text-xs font-semibold ${textColor} mb-1`}>Subtemas:</h4>
            <ul className="space-y-0.5">
              {community.subtopics.slice(0, 3).map((subtopic, index) => (
                <li key={index} className={`flex items-center text-xs ${subtopicColor}`}>
                  <Dot size={16} className="mr-0.5 shrink-0" /> {subtopic}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pr-10 border-t border-border pt-3"> {/* pr-10 to avoid overlap with strip */}
        <Button 
          variant="outline" 
          size="sm"
          className={`bg-white border-[hsl(var(--border))] ${buttonTextColor} hover:${buttonTextColor}/90 rounded-md w-full`}
        >
          Learn...
          {community.rating && <span className="ml-auto text-xs text-muted-foreground">★ {community.rating.toFixed(1)}</span>}
        </Button>
      </CardFooter>
    </Card>
  );
}
