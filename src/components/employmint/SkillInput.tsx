'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { X, PlusCircle, Check, ChevronsUpDown } from 'lucide-react';

export interface Skill {
  name: string;
  experience: string; // Years of experience, can be empty
}

interface SkillInputProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

const PREDEFINED_SKILLS: string[] = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Project Management', 
  'Communication', 'Problem Solving', 'Data Analysis', 'Machine Learning', 
  'Cloud Computing (AWS/Azure/GCP)', 'DevOps (CI/CD)', 'Cybersecurity', 
  'UI/UX Design', 'Agile Methodologies', 'Java', 'C#', '.NET', 'Go', 'Ruby', 'PHP', 
  'Swift', 'Kotlin', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 
  'Spring Boot', 'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Power BI', 
  'Tableau', 'Salesforce', 'Digital Marketing', 'SEO/SEM', 'Content Creation', 
  'Product Management', 'Business Analysis', 'Financial Modeling', 'Customer Service', 
  'Leadership', 'Teamwork'
];


export function SkillInput({ skills, onSkillsChange }: SkillInputProps) {
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [currentExperience, setCurrentExperience] = useState('');

  const handleAddSkill = () => {
    if (selectedSkillName.trim() && !skills.find(s => s.name === selectedSkillName.trim())) {
      onSkillsChange([...skills, { name: selectedSkillName.trim(), experience: currentExperience.trim() }]);
      setSelectedSkillName('');
      setCurrentExperience('');
    }
    setOpenCombobox(false);
  };

  const handleSelectSkill = (skillName: string) => {
    setSelectedSkillName(skillName);
    // Optionally, close combobox here or wait for experience input
    // setOpenCombobox(false); // Keep open to input experience or use a modal
  };
  
  const handleUpdateExperience = (skillName: string, experience: string) => {
    onSkillsChange(
      skills.map(skill => 
        skill.name === skillName ? { ...skill, experience: experience.trim() } : skill
      )
    );
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill.name !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <label htmlFor="skill-combobox" className="block text-sm font-medium text-foreground mb-1">
            Add Skill
          </label>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between text-muted-foreground"
                id="skill-combobox"
              >
                {selectedSkillName
                  ? PREDEFINED_SKILLS.find((skill) => skill.toLowerCase() === selectedSkillName.toLowerCase()) || "Select or type skill..."
                  : "Select or type skill..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search or type new skill..." />
                <CommandList>
                  <CommandEmpty>No skill found. Type to add new.</CommandEmpty>
                  <CommandGroup>
                    {PREDEFINED_SKILLS.map((skill) => (
                      <CommandItem
                        key={skill}
                        value={skill}
                        onSelect={(currentValue) => {
                          setSelectedSkillName(currentValue === selectedSkillName.toLowerCase() ? '' : currentValue);
                          // Do not close on select, allow experience input
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${selectedSkillName.toLowerCase() === skill.toLowerCase() ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {selectedSkillName && (
                 <div className="p-2 border-t">
                   <Input
                     type="text" // Changed to text to allow "1-2" or "2+" etc. but will treat as number for AI
                     placeholder="Years of experience (optional)"
                     value={currentExperience}
                     onChange={(e) => setCurrentExperience(e.target.value)}
                     className="h-8 text-sm"
                   />
                 </div>
              )}
              <div className="p-2 border-t">
                 <Button onClick={handleAddSkill} className="w-full" size="sm" disabled={!selectedSkillName.trim()}>
                   <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                 </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Your Added Skills:</h3>
        {skills.length === 0 && (
          <p className="text-xs text-muted-foreground">No skills added yet.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <Badge key={skill.name} variant="secondary" className="py-1 px-3 text-sm items-center group">
              {skill.name}
              <Input 
                type="text"
                placeholder="Yrs"
                value={skill.experience}
                onChange={(e) => handleUpdateExperience(skill.name, e.target.value)}
                className="h-6 w-12 ml-2 text-xs px-1 bg-background group-hover:border-primary"
                aria-label={`Years of experience for ${skill.name}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.name)}
                className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`Remove ${skill.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
