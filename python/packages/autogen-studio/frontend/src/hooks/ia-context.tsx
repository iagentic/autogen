import React, { createContext, useContext, useState } from 'react';

interface IAContextType {
  isTourOpen: boolean;
  setTourOpen: (isOpen: boolean) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedSections: string[];
  toggleSection: (sectionId: string) => void;
}

const IAContext = createContext<IAContextType | undefined>(undefined);

export const IAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourOpen, setTourOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <IAContext.Provider
      value={{
        isTourOpen,
        setTourOpen,
        activeFilters,
        setActiveFilters,
        searchQuery,
        setSearchQuery,
        expandedSections,
        toggleSection,
      }}
    >
      {children}
    </IAContext.Provider>
  );
};

export const useIA = () => {
  const context = useContext(IAContext);
  if (context === undefined) {
    throw new Error('useIA must be used within an IAProvider');
  }
  return context;
}; 