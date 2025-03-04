import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../store/kioskStore';
import UrlList from '../components/UrlList';
import UrlForm from '../components/UrlForm';
import { Plus, Monitor, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { getActiveUrl } = useKioskStore();
  
  const handleLaunchKiosk = () => {
    navigate('/kiosk');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-2" size={28} />
            URL Dashboard
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleLaunchKiosk}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Monitor size={18} className="mr-2" />
              Launch Kiosk
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Manage URLs</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add URL
            </button>
          </div>
          
          <UrlList />
        </div>
        
        {showForm && <UrlForm onClose={() => setShowForm(false)} />}
      </main>
    </div>
  );
};

export default Dashboard;