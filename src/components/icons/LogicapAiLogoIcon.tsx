// src/components/icons/LogicapAiLogoIcon.tsx
import type { SVGProps } from 'react';

export function LogicapAiLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95 85" // Adjusted viewBox to fit the new path
      fill="currentColor"
      {...props}
    >
      {/* This path data is a representation of the provided logo image (cerebro.png)
          It defines the shape of a brain combined with a speech bubble. */}
      <path
        d="M47.5,5 
           C25,5 10,22 10,45 
           C10,68 25,80 47.5,80 
           C58,80 66,75 70,68 
           L83,68 
           L83,50 
           L92,45 
           L83,40 
           L83,22 
           C78,12 65,5 47.5,5 Z
           M23,27 C18,37 18,50 23,60 
           M33,22 C28,32 28,53 33,63 
           M43,27 C38,37 38,50 43,60 
           M58,22 C53,32 53,45 58,52 
           M68,25 C63,35 63,48 68,55"
      />
    </svg>
  );
}
