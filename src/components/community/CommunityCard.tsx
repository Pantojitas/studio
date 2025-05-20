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
  const iconColor = 'text-muted-foreground'; // #4A5568
  const cardStripColor = 'bg-[hsl(var(--card-strip))]'; // #2D3748

  const placeholderText = community.name.replace(/\s/g, '+');
  // Ensure placeholder is used if imageUrl is missing, matching original behavior
  const effectiveImageUrl = community.imageUrl || `https://placehold.co/600x400.png?text=${placeholderText}`;
  // Only show image if explicitly provided, consistent with "Matemáticas" / "Física" card styling preference
  const showImage = !!community.imageUrl; 

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
      
      <CardHeader className="px-4 pt-4 pb-0 pr-10"> {/* Adjusted padding: 16px top/left, 0 bottom for precise spacing to content */}
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-lg font-bold text-foreground">{community.name}</CardTitle> {/* text-foreground is #1A202C */}
          <div className="flex items-center space-x-2">
            <Users size={16} className={iconColor} aria-label="Community icon" />
            <Star size={16} className={iconColor} aria-label="Favorite icon" />
          </div>
        </div>
        {community.isAISuggested && (
          <div className="flex items-center text-xs text-amber-600 mt-1 mb-1"> {/* Added mt-1 */}
            <AlertTriangle size={14} className="mr-1" />
            <span>AI Suggested</span>
          </div>
        )}
        {community.description && (
            <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-1"> {/* text-muted-foreground is #4A5568 */}
              {community.description}
            </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="px-4 pb-4 pt-3 flex-grow flex flex-col pr-10"> {/* pt-3 for 12px margin for button */}
        <Button
          variant="outline" // Use outline for border and bg
          size="sm" // size="sm" is h-9 (36px) and px-3 (12px)
          className="bg-input text-primary border-border hover:bg-accent hover:text-accent-foreground font-medium rounded-md py-1 px-3 self-start"
          // Custom Tailwind: bg-input (#FFFFFF), text-primary (#6B46C1), border-border (#E2E8F0), rounded-md (6px), py-1 (4px vert padding), px-3 (12px horiz padding)
        >
          learn…
        </Button>

        {community.subtopics && community.subtopics.length > 0 && (
          <ul className="space-y-1 mt-2 text-muted-foreground pl-4"> {/* mt-2 (8px), text-muted-foreground (#4A5568), pl-4 for viñetas */}
            {community.subtopics.map((subtopic, index) => (
              <li key={index} className="leading-normal list-disc list-inside"> {/* Ensure viñetas are visible */}
                {subtopic}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
