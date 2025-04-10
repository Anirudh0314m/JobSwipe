import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    title: '',
    location: '',
    dateOfBirth: '', // Add this field
    about: '',
    skills: [],
    experience: [],
    education: []
  });
  
  // For new skill input
  const [newSkill, setNewSkill] = useState('');
  
  // For resume upload
  const [resume, setResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const profileRes = await api.get('/api/profile');
        
        // Set form data from profile, prioritizing data from API
        // but falling back to context data if needed
        setFormData({
          name: profileRes.data.name || user?.name || '',  // Prioritize API data, then context
          email: user?.email || '',  // Email always from context
          title: profileRes.data.title || '',
          location: profileRes.data.location || '',
          dateOfBirth: profileRes.data.dateOfBirth || '',
          about: profileRes.data.about || '',
          skills: profileRes.data.skills || [],
          experience: profileRes.data.experience || [],
          education: profileRes.data.education || []
        });
        
        // Fetch resume if exists
        try {
          const resumeRes = await api.get('/api/profile/resume');
          setResume({
            name: resumeRes.data.filename,
            url: resumeRes.data.url,
            uploadDate: resumeRes.data.uploadDate
          });
        } catch (err) {
          // No resume found, that's ok
          console.log('No resume found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setFormData(prevData => ({
          ...prevData,
          name: user?.name || '',
          email: user?.email || ''
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Add user as dependency
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      if (fileType === 'application/pdf' || 
          fileType === 'application/msword' || 
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResume(file);
      } else {
        alert('Please upload a PDF or Word document');
      }
    }
  };
  
  // Replace the handleResumeUpload function with a real API call
  const handleResumeUpload = async () => {
    if (!resume) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('resume', resume);
    
    try {
      // Simulate progress with an interval
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Make API request
      const res = await api.post('/api/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Update the resume object with response data
      setResume({
        ...resume,
        url: `/api/profile/resume/${res.data.resume.filename}`, // This would be a real URL to view the resume
        uploadDate: res.data.resume.uploadDate
      });
      
      setUploading(false);
      setSuccessMessage('Resume uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading resume:', err);
      setUploading(false);
      // Show error message
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Include all fields we want to update
      const profileData = {
        name: formData.name,
        title: formData.title,
        location: formData.location,
        dateOfBirth: formData.dateOfBirth,
        about: formData.about,
        skills: formData.skills
      };
      
      const res = await api.post('/api/profile', profileData);
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Complete your profile to get better job recommendations
        </p>
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                  <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Professional Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        About
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          name="about"
                          rows={4}
                          value={formData.about}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Brief description of your professional background and goals"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Skills</h3>
                  <div className="mt-5">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Add a skill (e.g., JavaScript)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            <span className="sr-only">Remove {skill}</span>
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Resume Upload */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Resume</h3>
                  <div className="mt-5">
                    <div className="flex items-center justify-center">
                      <div className="space-y-2 text-center w-full">
                        {!resume && (
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        
                        {resume && !uploading && (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">{resume.name}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-center">
                          <label
                            htmlFor="resume-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>{resume ? 'Change file' : 'Upload a file'}</span>
                            <input
                              id="resume-upload"
                              name="resume-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleResumeChange}
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          PDF or Word document up to 5MB
                        </p>
                      </div>
                    </div>
                    
                    {resume && !uploading && !(resume.url) && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleResumeUpload}
                          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Upload Resume
                        </button>
                      </div>
                    )}
                    
                    {uploading && (
                      <div className="mt-4 space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">{uploadProgress}% uploaded</p>
                      </div>
                    )}
                    
                    {resume && resume.url && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Resume Preview</p>
                        <div className="border rounded-md p-4 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="ml-2 text-sm font-medium text-gray-900 truncate">
                                {resume.name}
                              </span>
                            </div>
                            
                            <div>
                              <a
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-500"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;