import React from 'react';
import { X } from 'lucide-react';
import { ConfigForm } from '../ConfigForm';
import type { AzureConfig } from '../../utils/config';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: Partial<AzureConfig>;
  onChange: (config: AzureConfig) => void;
}

export function ConfigDrawer({ isOpen, onClose, config, onChange }: ConfigDrawerProps) {
  return (
    <div className={`
      fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Configuration</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <ConfigForm config={config} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}