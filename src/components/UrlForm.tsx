import React, { useState, useEffect } from 'react';
import { useKioskStore } from '../store/kioskStore';
import { KioskUrl } from '../types';
import { Save, X } from 'lucide-react';

interface UrlFormProps {
  urlToEdit?: KioskUrl;
  onClose: () => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ urlToEdit, onClose }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  
  const { addUrl, updateUrl } = useKioskStore();
  
  useEffect(() => {
    if (urlToEdit) {
      setUrl(urlToEdit.url);
      setName(urlToEdit.name);
      setStartTime(urlToEdit.startTime || '');
      setIsEditing(true);
    }
  }, [urlToEdit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !name) return;
    
    const formattedStartTime = startTime || null;
    
    // Format URL to ensure it has http:// or https:// prefix
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    if (isEditing && urlToEdit) {
      updateUrl(urlToEdit.id, formattedUrl, name, formattedStartTime);
    } else {
      addUrl(formattedUrl, name, formattedStartTime);
    }
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setUrl('');
    setName('');
    setStartTime('');
    setIsEditing(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit URL' : 'Add New URL'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter URL without http:// or https:// (will be added automatically)
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Auto Start Time (optional)
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Save size={16} className="mr-1" />
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UrlForm;