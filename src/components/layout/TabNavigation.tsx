import React from 'react';
import { SplitSquareVertical, Grid2X2 } from 'lucide-react';

export type TabId = 'split-analysis' | 'similarity-matrix';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <TabButton 
            id="split-analysis"
            label="Split Text Analysis"
            icon={<SplitSquareVertical className="w-5 h-5" />}
            isActive={activeTab === 'split-analysis'}
            onClick={() => onTabChange('split-analysis')}
          />
          <TabButton 
            id="similarity-matrix"
            label="Similarity Matrix"
            icon={<Grid2X2 className="w-5 h-5" />}
            isActive={activeTab === 'similarity-matrix'}
            onClick={() => onTabChange('similarity-matrix')}
          />
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-1 py-4 text-sm font-medium border-b-2 
        ${isActive 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
      `}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}