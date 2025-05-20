// src/components/community/CommunityList.tsx
import type { Community } from '@/types';
import { CommunityCard } from './CommunityCard';

interface CommunityListProps {
  communities: Community[];
  title?: string;
}

export function CommunityList({ communities, title }: CommunityListProps) {
  if (!communities || communities.length === 0) {
    return null; // Or a "No communities found" message if handled here
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-semibold mb-6 text-foreground">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
}
