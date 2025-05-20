// src/components/search/SearchBar.tsx
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchSubmit: () => void;
  placeholder?: string;
}

export function SearchBar({ 
  searchTerm, 
  onSearchTermChange, 
  onSearchSubmit,
  placeholder = "search… (‘Matemáticas, lenguaje, químicas, español, etc.’)" 
}: SearchBarProps) {
  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <Input
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="h-10 pl-4 pr-12 rounded-lg border-none shadow-md focus-visible:ring-2 focus-visible:ring-ring bg-input text-foreground"
        aria-label="Search topics"
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon" 
        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label="Submit search"
      >
        <SearchIcon size={20} />
      </Button>
    </form>
  );
}
