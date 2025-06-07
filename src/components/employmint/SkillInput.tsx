
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
  'Leadership', 'Teamwork', 'Public Speaking', 'Negotiation', 'Critical Thinking',
  'Adaptability', 'Creativity', 'Time Management', 'Emotional Intelligence'
];


export function SkillInput({ skills, onSkillsChange }: SkillInputProps) {
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [currentExperience, setCurrentExperience] = useState('');

  const handleAddSkill = () => {
    if (selectedSkillName.trim() && !skills.find(s => s.name.toLowerCase() === selectedSkillName.trim().toLowerCase())) {
      onSkillsChange([...skills, { name: selectedSkillName.trim(), experience: currentExperience.trim() }]);
      setSelectedSkillName('');
      setCurrentExperience('');
    }
    setOpenCombobox(false);
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

  const isSkillSelected = (skillName: string) => {
    return skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="skill-combobox" className="block text-lg font-semibold text-foreground mb-2">
          Your Skills
        </label>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCombobox}
              className="w-full justify-between text-muted-foreground bg-card text-base py-6"
              id="skill-combobox"
            >
              {selectedSkillName
                ? PREDEFINED_SKILLS.find((skill) => skill.toLowerCase() === selectedSkillName.toLowerCase()) || selectedSkillName
                : "Select or type skill..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput 
                placeholder="Search or type new skill..."
                value={selectedSkillName}
                onValueChange={setSelectedSkillName}
              />
              <CommandList>
                <CommandEmpty>{selectedSkillName.trim() ? `No skill found. Press Add to create "${selectedSkillName}".` : "Type to search or add a new skill."}</CommandEmpty>
                <CommandGroup>
                  {PREDEFINED_SKILLS.map((skill) => {
                    const alreadySelected = isSkillSelected(skill);
                    return (
                      <CommandItem
                        key={skill}
                        value={skill}
                        onSelect={(currentValue) => {
                           if (!alreadySelected) {
                            setSelectedSkillName(currentValue === selectedSkillName.toLowerCase() ? '' : currentValue);
                           }
                        }}
                        disabled={alreadySelected}
                        className={alreadySelected ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${selectedSkillName.toLowerCase() === skill.toLowerCase() && !alreadySelected ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {skill}
                        {alreadySelected && <span className="ml-auto text-xs text-muted-foreground">(Added)</span>}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
            {selectedSkillName && !isSkillSelected(selectedSkillName) && (
               <div className="p-2 border-t">
                 <Input
                   type="text" 
                   placeholder="Years of experience (e.g., 2, 5+, 0-1)"
                   value={currentExperience}
                   onChange={(e) => setCurrentExperience(e.target.value)}
                   className="h-8 text-sm"
                 />
               </div>
            )}
            <div className="p-2 border-t">
               <Button 
                onClick={handleAddSkill} 
                className="w-full" 
                size="sm" 
                disabled={!selectedSkillName.trim() || isSkillSelected(selectedSkillName)}
               >
                 <PlusCircle className="mr-2 h-4 w-4" /> Add Skill to Profile
               </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-medium text-muted-foreground">Your Added Skills:</h3>
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">No skills added yet. Use the input above.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <Badge key={skill.name} variant="secondary" className="py-2 px-3 text-base items-center group">
              <span>{skill.name}</span>
              <Input 
                type="text"
                placeholder="Yrs"
                value={skill.experience}
                onChange={(e) => handleUpdateExperience(skill.name, e.target.value)}
                className="h-7 w-16 ml-2 text-sm px-2 bg-background group-hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                aria-label={`Years of experience for ${skill.name}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.name)}
                className="ml-2 rounded-full hover:bg-destructive/20 p-1"
                aria-label={`Remove ${skill.name}`}
              >
                <X className="h-4 w-4 text-destructive hover:text-destructive-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      {/* Placeholder for Hard/Soft skill categorization UI - to be implemented next */}
      <CardDescription className="text-xs pt-2">
        Tip: Categorizing skills into 'Hard Skills' and 'Soft Skills' can further refine your job matches and analysis. This feature will be available in a future update.
      </CardDescription>
    </div>
  );
}

