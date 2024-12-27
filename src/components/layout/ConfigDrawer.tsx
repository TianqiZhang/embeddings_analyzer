import React from 'react';
import { X, Shield } from 'lucide-react';
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
          <div className="mb-6 flex gap-3 p-4 bg-blue-50 rounded-lg text-blue-700 text-sm">
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Secure Local Storage</p>
              <p>Your credentials are encrypted and stored exclusively in your browser's local storage. They are never transmitted to or stored on server.</p>
            </div>
          </div>
          <ConfigForm config={config} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}