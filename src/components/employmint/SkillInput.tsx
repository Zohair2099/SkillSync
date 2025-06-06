'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';

interface SkillInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export function SkillInput({ skills, onSkillsChange }: SkillInputProps) {
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      onSkillsChange([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="skill-input" className="block text-sm font-medium text-foreground">
        Your Skills
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="skill-input"
          type="text"
          placeholder="e.g., JavaScript, Python, Project Management"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button type="button" onClick={handleAddSkill} variant="outline" size="icon">
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">Add Skill</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" className="py-1 px-3 text-sm">
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
              aria-label={`Remove ${skill}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {skills.length === 0 && (
        <p className="text-xs text-muted-foreground">Add skills to get started. Press Enter or click the plus button to add.</p>
      )}
    </div>
  );
}
