
// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import Image from 'next/image';


interface HeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchSubmit: () => void;
}

export function Header({ searchTerm, onSearchTermChange, onSearchSubmit }: HeaderProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 md:px-6 shadow-md"
      style={{ backgroundColor: 'hsl(var(--navbar-background))' }} /* #6B46C1 */
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="text-primary-foreground hover:bg-primary-foreground/10 mr-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </Button>
        <Link href="/" className="flex items-center gap-2 text-primary-foreground hover:opacity-90 transition-opacity">
          {/* Using BookOpen as a generic placeholder for the graphical part of the logo */}
          <BookOpen className="h-7 w-7" />
          <h1 className="text-xl font-semibold">LOGICAP.AI</h1>
        </Link>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
          onSearchSubmit={onSearchSubmit}
        />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="relative">
          <Avatar className="h-9 w-9 border-2 border-primary-foreground/50">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait" />
            <AvatarFallback>LA</AvatarFallback>
          </Avatar>
          <span
            className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-[hsl(var(--navbar-background))] ring-[hsl(var(--status-dot-green))]"
            style={{ backgroundColor: 'hsl(var(--status-dot-green))' }}
            title="Online"
            aria-label="User status: Online"
          />
        </div>
      </div>
    </header>
  );
}
