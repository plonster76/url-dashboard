import React, { useState } from 'react';
import { useKioskStore } from '../store/kioskStore';
import { KioskUrl } from '../types';
import { Edit, Trash2, Play, Check } from 'lucide-react';
import UrlForm from './UrlForm';

const UrlList: React.FC = () => {
  const { urls, deleteUrl, setActiveUrl } = useKioskStore();
  const [showForm, setShowForm] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<KioskUrl | undefined>(undefined);
  
  const handleEdit = (url: KioskUrl) => {
    setUrlToEdit(url);
    setShowForm(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteUrl(id);
    }
  };
  
  const handleActivate = (id: string) => {
    setActiveUrl(id);
  };
  
  const closeForm = () => {
    setShowForm(false);
    setUrlToEdit(undefined);
  };
  
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {urls.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No URLs added yet. Add a URL to get started.
                </td>
              </tr>
            ) : (
              urls.map((url) => (
                <tr key={url.id} className={url.isActive ? 'bg-blue-50' : ''}>
                  <td className="py-3 px-4 text-sm">{url.name}</td>
                  <td className="py-3 px-4 text-sm truncate max-w-[200px]">{url.url}</td>
                  <td className="py-3 px-4 text-sm">{url.startTime || 'Not set'}</td>
                  <td className="py-3 px-4 text-sm">
                    {url.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleActivate(url.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Activate"
                      >
                        <Play size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(url)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(url.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {showForm && <UrlForm urlToEdit={urlToEdit} onClose={closeForm} />}
    </div>
  );
};

export default UrlList;