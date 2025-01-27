import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';

const HealthDataManager = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [healthProfile, setHealthProfile] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const tabs = [
    { id: 'profile', label: 'Health Profile' },
    { id: 'labs', label: 'Lab Results' },
    { id: 'goals', label: 'Health Goals' },
    { id: 'supplements', label: 'Supplements' },
    { id: 'chat', label: 'Chat History' }
  ];

  const renderHealthProfile = () => {
    if (!healthProfile) return <div>Loading profile...</div>;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-medium mb-2">Personal Information</h3>
            <p>Age: {healthProfile.age}</p>
            <p>Gender: {healthProfile.gender}</p>
            <p>Height: {healthProfile.height}cm</p>
            <p>Weight: {healthProfile.weight}kg</p>
          </div>
          
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-medium mb-2">Medical Information</h3>
            <p>Conditions: {healthProfile.medical_conditions?.join(', ') || 'None'}</p>
            <p>Allergies: {healthProfile.allergies?.join(', ') || 'None'}</p>
            <p>Medications: {healthProfile.current_medications?.join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderLabResults = () => {
    const chartData = labResults.map(result => ({
      date: new Date(result.test_date).toLocaleDateString(),
      value: result.value,
      name: result.test_name
    }));

    return (
      <div className="space-y-4">
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {labResults.map(result => (
            <div key={result.id} className="p-4 bg-white rounded shadow">
              <h3 className="font-medium">{result.test_name}</h3>
              <p>Value: {result.value} {result.unit}</p>
              <p>Reference Range: {result.reference_range_min} - {result.reference_range_max}</p>
              <p>Date: {new Date(result.test_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHealthGoals = () => (
    <div className="grid grid-cols-1 gap-4">
      {healthGoals.map(goal => (
        <div key={goal.id} className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">{goal.goal_name}</h3>
          <p className="text-gray-600">{goal.description}</p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 rounded-full h-2"
                style={{ width: `${(goal.progress / goal.target) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-sm">
              Progress: {goal.progress} / {goal.target} ({goal.category})
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupplements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {supplements.map(supplement => (
        <div key={supplement.id} className="p-4 bg-white rounded shadow">
          <div className="flex items-start">
            {supplement.image_url && (
              <img 
                src="/api/placeholder/100/100"
                alt={supplement.supplement_name}
                className="w-16 h-16 object-cover rounded mr-4"
              />
            )}
            <div>
              <h3 className="font-medium">{supplement.supplement_name}</h3>
              <p className="text-sm text-gray-600">{supplement.company_name}</p>
              <p className="mt-2">Dosage: {supplement.dosage}</p>
              <p className="text-sm mt-1">{supplement.reason}</p>
              <p className="text-sm text-gray-600 mt-2">
                Estimated Cost: ${supplement.estimated_cost}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChatHistory = () => (
    <div className="space-y-4">
      {chatHistory.map(chat => (
        <div 
          key={chat.id} 
          className={`p-4 rounded ${
            chat.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">{chat.role}</p>
          <p>{chat.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(chat.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderHealthProfile();
      case 'labs':
        return renderLabResults();
      case 'goals':
        return renderHealthGoals();
      case 'supplements':
        return renderSupplements();
      case 'chat':
        return renderChatHistory();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 border-b">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="min-h-screen">
        {renderContent()}
      </div>
    </div>
  );
};

export default HealthDataManager;