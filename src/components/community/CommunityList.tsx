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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"> {/* Updated grid layout and gap */}
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
}
