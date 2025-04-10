import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PostJobPage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    skills: []
  });
  
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAddSkill = () => {
    if (skill.trim() !== '') {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill.trim()]
      });
      setSkill('');
    }
  };
  
  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Eventually submit to API
      console.log('Job posting data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        title: '',
        company: user?.company || '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        skills: []
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error posting job:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Job posted successfully!</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            {/* Add more form fields here */}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;