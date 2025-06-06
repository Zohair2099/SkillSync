import { Briefcase } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b">
      <div className="container mx-auto flex items-center gap-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-foreground">
          EmployMint
        </h1>
      </div>
    </header>
  );
}
