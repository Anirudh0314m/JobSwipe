import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Autocomplete from '../components/common/Autocomplete';
import PhoneInput from '../components/common/PhoneInput';
import { companyNames, jobTitles } from '../utils/companyData';
import SuccessAnimation from '../components/common/SuccessAnimation';
import { top500Companies, commonJobTitles, countries, usStates, citiesByCountry, skillsByJobTitle } from '../utils/companyData';
import { getCompanyLogo } from '../utils/companyLogos';

// Combine countries and US states with "Remote" option for location suggestions
const locationSuggestions = ['Remote', 'Remote - US Only', ...countries, ...usStates.map(state => `${state}, USA`)];

const PostJobPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get location for query params
  
  // Get jobId from query params for editing
  const queryParams = new URLSearchParams(location.search);
  const editJobId = queryParams.get('edit');
  
  // Set page title based on edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    description: '',
    requirements: '',
    location: '',
    isRemote: true,
    country: '',
    city: '',
    salary: '',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'yearly',
    employmentType: 'Full-time',
    workSchedule: [],
    benefits: [],
    education: 'None',
    experience: 'No experience',
    applicationInstructions: '',
    applicationDeadline: '',
    skills: [],
    screeningQuestions: [],
    phoneNumber: '' // Added phone number field
  });
  
  // State for available cities based on selected country
  const [availableCities, setAvailableCities] = useState([]);
  
  // Track if dropdowns are open
  const [dropdownsOpen, setDropdownsOpen] = useState({
    country: false,
    city: false,
    title: false,  // Added for job title dropdown
    company: false // Added for company dropdown
  });
  
  const [skill, setSkill] = useState('');
  const [newQuestion, setNewQuestion] = useState({ question: '', required: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Define options for select fields
  const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
  const salaryPeriodOptions = [
    { value: 'hourly', label: 'per hour' },
    { value: 'daily', label: 'per day' },
    { value: 'weekly', label: 'per week' },
    { value: 'monthly', label: 'per month' },
    { value: 'yearly', label: 'per year' }
  ];
  const educationOptions = ['None', 'High School', 'Associate', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Professional'];
  const experienceOptions = ['No experience', '1-2 years', '3-5 years', '6-8 years', '9+ years'];
  const benefitOptions = [
    '401(k)', 'Health insurance', 'Dental insurance', 'Vision insurance', 
    'Paid time off', 'Flexible schedule', 'Remote work', 'Professional development',
    'Parental leave', 'Gym membership', 'Free lunch', 'Company events'
  ];
  const scheduleOptions = [
    'Monday to Friday', 'Weekend availability', 'Day shift', 'Night shift', 
    'Overnight shift', 'Rotating shift', 'Flexible hours'
  ];
  
  // Add state for filtered skills
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  
  // Company logo state
  const [companyLogo, setCompanyLogo] = useState(null);
  
  useEffect(() => {
    // Prefill company name if user is logged in
    if (user?.company) {
      setFormData(prev => ({ ...prev, company: user.company }));
    }
  }, [user]);
  
  // Update available cities when country changes
  useEffect(() => {
    if (formData.country && citiesByCountry[formData.country]) {
      setAvailableCities(citiesByCountry[formData.country]);
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);
  
  // Update location field when isRemote, country or city changes
  useEffect(() => {
    if (formData.isRemote) {
      setFormData(prev => ({ ...prev, location: 'Remote' }));
    } else if (formData.country && formData.city) {
      setFormData(prev => ({ ...prev, location: `${formData.city}, ${formData.country}` })); 
    } else if (formData.country) {
      setFormData(prev => ({ ...prev, location: formData.country }));
    }
  }, [formData.isRemote, formData.country, formData.city]);
  
  // Update filtered skills when job title changes
  useEffect(() => {
    if (formData.title && skillsByJobTitle[formData.title]) {
      setFilteredSkills(skillsByJobTitle[formData.title]);
    } else {
      // Fallback to common skills if no matching job title or no skills for that title
      setFilteredSkills([
        'JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'Python', 'Java', 'SQL',
        'Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Time Management'
      ]);
    }
  }, [formData.title]);
  
  // Check for company logo when company name changes
  useEffect(() => {
    if (formData.company) {
      const logo = getCompanyLogo(formData.company);
      setCompanyLogo(logo);
    } else {
      setCompanyLogo(null);
    }
  }, [formData.company]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const toggleDropdown = (dropdown) => {
    setDropdownsOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };
  
  const handleCountrySelect = (country) => {
    setFormData(prev => ({ ...prev, country, city: '' }));
    setDropdownsOpen(prev => ({ ...prev, country: false }));
  };
  
  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setDropdownsOpen(prev => ({ ...prev, city: false }));
  };
  
  const handleLocationTypeChange = (isRemote) => {
    setFormData(prev => ({ 
      ...prev, 
      isRemote,
      country: isRemote ? '' : prev.country,
      city: isRemote ? '' : prev.city,
      location: isRemote ? 'Remote' : (prev.country && prev.city ? `${prev.city}, ${prev.country}` : '')
    }));
  };
  
  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field];
    if (currentValues.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentValues.filter(item => item !== value)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentValues, value]
      });
    }
  };
  
  const handleAddSkill = () => {
    if (skill.trim() !== '' && !formData.skills.includes(skill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill.trim()]
      });
      setSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const handleScreeningQuestionChange = (e, index) => {
    const updatedQuestions = [...formData.screeningQuestions];
    if (e.target.name === 'required') {
      updatedQuestions[index].required = e.target.checked;
    } else {
      updatedQuestions[index].question = e.target.value;
    }
    setFormData({ ...formData, screeningQuestions: updatedQuestions });
  };
  
  const handleAddQuestion = () => {
    if (newQuestion.question.trim() !== '') {
      setFormData({
        ...formData,
        screeningQuestions: [...formData.screeningQuestions, { ...newQuestion }]
      });
      setNewQuestion({ question: '', required: false });
    }
  };
  
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...formData.screeningQuestions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, screeningQuestions: updatedQuestions });
  };
  
  const handleSkillSelect = (selectedSkill) => {
    if (!formData.skills.includes(selectedSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, selectedSkill]
      });
    }
    setSkillDropdownOpen(false);
  };
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.company && formData.location && formData.employmentType;
      case 2:
        return formData.description && formData.skills.length > 0;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };
  
  // Helper function to get token from storage based on user ID
  const getAuthToken = (userId) => {
    // Try session storage first
    let token = sessionStorage.getItem(`jobswipe_token_${userId}`);
    
    // If not in session storage, try local storage
    if (!token) {
      token = localStorage.getItem(`jobswipe_token_${userId}`);
    }
    
    return token;
  };
  
  // Load job data if in edit mode
  useEffect(() => {
    const fetchJobForEditing = async () => {
      if (!editJobId) return;
      
      try {
        setLoading(true);
        
        if (!user || !user._id) {
          console.error('No authenticated user found');
          setError('Authentication error. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Get the auth token using our helper function
        const token = getAuthToken(user._id);
        
        if (!token) {
          console.error('No authentication token found');
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Configure headers for the request
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        
        // Fetch the job data
        const response = await axios.get(`/api/jobs/${editJobId}`, config);
        const jobData = response.data.data || response.data;
        
        setIsEditMode(true);
        
        // Update form data with job values
        setFormData({
          ...formData,
          title: jobData.title || '',
          company: jobData.company || user?.company || '',
          description: jobData.description || '',
          requirements: jobData.requirements || '',
          location: jobData.location || '',
          isRemote: jobData.isRemote || false,
          country: jobData.country || '',
          city: jobData.city || '',
          salary: jobData.salary || '',
          salaryMin: jobData.salaryMin || '',
          salaryMax: jobData.salaryMax || '',
          salaryPeriod: jobData.salaryPeriod || 'yearly',
          employmentType: jobData.employmentType || 'Full-time',
          workSchedule: jobData.workSchedule || [],
          benefits: jobData.benefits || [],
          education: jobData.education || 'None',
          experience: jobData.experience || 'No experience',
          applicationInstructions: jobData.applicationInstructions || '',
          applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline).toISOString().split('T')[0] : '',
          skills: jobData.skills || [],
          screeningQuestions: jobData.screeningQuestions || [],
          phoneNumber: jobData.phoneNumber || ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job for editing:', err);
        setError('Failed to load job data for editing.');
        setLoading(false);
      }
    };
    
    fetchJobForEditing();
  }, [editJobId, user]);
  
  // Modify handleSubmit to support both creating and updating jobs
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!user || !user._id) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Get the auth token using our helper function
      const token = getAuthToken(user._id);
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Configure headers for the request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      // Convert salary strings to numbers if they exist
      const submitData = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined
      };
      
      let response;
      
      // Check if we're editing or creating
      if (isEditMode && editJobId) {
        // Update existing job
        response = await axios.put(`/api/jobs/${editJobId}`, submitData, config);
      } else {
        // Create new job
        response = await axios.post('/api/jobs', submitData, config);
      }
      
      console.log('Job operation successful:', response.data);
      
      setSuccess(true);
      setLoading(false);
      
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'posting'} job:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'post'} job. Please try again.`);
      setLoading(false);
    }
  };
  
  // Add navigation handlers

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Progress indicator circle class based on step
  const getCircleClass = (stepNumber) => {
    if (stepNumber < currentStep) {
      return "flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white";
    } else if (stepNumber === currentStep) {
      return "flex items-center justify-center w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded-full text-blue-500";
    } else {
      return "flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600";
    }
  };

  // Render the form header with progress indicator
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line behind the circles */}
          <div className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full"></div>
          {/* Enhanced blue progress line that fills based on current step */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {/* Step circles */}
          <div className="relative z-10">
            <div className={getCircleClass(1)}>
              {currentStep > 1 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              ) : "1"}
            </div>
            <div className="mt-2 text-xs text-center font-medium">Basic Info</div>
          </div>
          
          <div className="relative z-10">
            <div className={getCircleClass(2)}>
              {currentStep > 2 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              ) : "2"}
            </div>
            <div className="mt-2 text-xs text-center font-medium">Description</div>
          </div>
          
          <div className="relative z-10">
            <div className={getCircleClass(3)}>
              {currentStep > 3 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              ) : "3"}
            </div>
            <div className="mt-2 text-xs text-center font-medium">Benefits</div>
          </div>
          
          <div className="relative z-10">
            <div className={getCircleClass(4)}>4</div>
            <div className="mt-2 text-xs text-center font-medium">Review</div>
          </div>
        </div>
      </div>
    );
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Basic Job Information</h2>
            
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Autocomplete
                  suggestions={commonJobTitles}
                  placeholder="e.g., Software Engineer, Data Analyst"
                  value={formData.title}
                  onChange={(value) => setFormData({...formData, title: value})}
                  required={true}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10"
                  onClick={() => toggleDropdown('title')}
                  aria-label="Toggle job title dropdown"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                {dropdownsOpen.title && (
                  <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    <div className="overflow-y-auto max-h-48">
                      {commonJobTitles.map((title) => (
                        <div
                          key={title}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                          onClick={() => {
                            setFormData({...formData, title});
                            toggleDropdown('title');
                          }}
                        >
                          {title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative flex items-center">
                  {/* Show inline logo in the input if available */}
                  {companyLogo && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <img 
                        src={companyLogo} 
                        alt={`${formData.company} logo`}
                        className="h-5 w-5 object-contain" 
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className={`block w-full border border-gray-300 rounded-md shadow-sm py-2 ${companyLogo ? 'pl-10' : 'pl-3'} pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="e.g., Amazon, Google, Your Company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    onClick={() => toggleDropdown('company')}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => toggleDropdown('company')}
                  >
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {dropdownsOpen.company && (
                  <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    <div className="overflow-y-auto max-h-48">
                      {top500Companies.map(company => renderCompanyDropdownItem(company))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              
              {/* Remote/Non-Remote Radio Buttons */}
              <div className="mt-2 mb-4 flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="remote"
                    name="locationType"
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    checked={formData.isRemote}
                    onChange={() => handleLocationTypeChange(true)}
                  />
                  <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                    Remote
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="non-remote"
                    name="locationType"
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    checked={!formData.isRemote}
                    onChange={() => handleLocationTypeChange(false)}
                  />
                  <label htmlFor="non-remote" className="ml-2 block text-sm text-gray-700">
                    On-site / Hybrid
                  </label>
                </div>
              </div>
              
              {!formData.isRemote && (
                <div className="space-y-3">
                  {/* Country Selector with Dropdown Arrow */}
                  <div className="relative">
                    <label htmlFor="country" className="block text-sm text-gray-600">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="country"
                        className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Select a country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        onClick={() => toggleDropdown('country')}
                        readOnly
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => toggleDropdown('country')}
                      >
                        <span className="sr-only">Toggle dropdown</span>
                      </button>
                    </div>
                    
                    {dropdownsOpen.country && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                        <div className="overflow-y-auto max-h-48">
                          {countries.map((country) => (
                            <div
                              key={country}
                              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                              onClick={() => handleCountrySelect(country)}
                            >
                              {country}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* City Selector with Dropdown Arrow */}
                  {formData.country && (
                    <div className="relative">
                      <label htmlFor="city" className="block text-sm text-gray-600">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          id="city"
                          className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Select a city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          onClick={() => toggleDropdown('city')}
                          readOnly
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => toggleDropdown('city')}
                        >
                          <span className="sr-only">Toggle dropdown</span>
                        </button>
                      </div>
                      
                      {dropdownsOpen.city && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                          <div className="overflow-y-auto max-h-48">
                            {availableCities.map((city) => (
                              <div
                                key={city}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                onClick={() => handleCitySelect(city)}
                              >
                                {city}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Display the selected location */}
              <div className="mt-2 text-sm font-medium text-blue-600">
                Selected location: {formData.location}
              </div>
            </div>
            
            {/* Employment Type */}
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.employmentType}
                onChange={handleChange}
              >
                {employmentTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Salary Range */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Salary Range (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-1/3">
                  <label htmlFor="salaryMin" className="block text-xs text-gray-500">
                    Minimum
                  </label>
                  <input
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                  />
                </div>
                <div className="w-1/3">
                  <label htmlFor="salaryMax" className="block text-xs text-gray-500">
                    Maximum
                  </label>
                  <input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="e.g., 80000"
                  />
                </div>
                <div className="w-1/3">
                  <label htmlFor="salaryPeriod" className="block text-xs text-gray-500">
                    Period
                  </label>
                  <select
                    id="salaryPeriod"
                    name="salaryPeriod"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.salaryPeriod}
                    onChange={handleChange}
                  >
                    {salaryPeriodOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Legacy salary field for backwards compatibility */}
              <div>
                <label htmlFor="salary" className="block text-xs text-gray-500">
                  Or enter salary as text (e.g., "$50K - $80K per year")
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., $50K - $80K per year"
                />
              </div>
            </div>
            
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Contact Phone Number (Optional)
              </label>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(value) => setFormData({...formData, phoneNumber: value})}
                className="mt-1"
                placeholder="Enter a contact phone number"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Job Description & Requirements</h2>
            
            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Describe the responsibilities, day-to-day activities, and what success in this role looks like
              </p>
              <textarea
                id="description"
                name="description"
                rows={8}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a detailed job description..."
              />
            </div>
            
            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <p className="text-xs text-gray-500 mb-2">
                List any specific qualifications, certifications, or other requirements
              </p>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Enter job requirements..."
              />
            </div>
            
            {/* Skills - Modified to include dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex mt-1 relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onClick={() => setSkillDropdownOpen(true)}
                  placeholder="e.g., JavaScript, React, SQL"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
                
                {/* Skills dropdown */}
                {skillDropdownOpen && filteredSkills.length > 0 && (
                  <div className="absolute z-10 mt-12 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    <div className="overflow-y-auto max-h-48">
                      {filteredSkills.filter(s => 
                        s.toLowerCase().includes(skill.toLowerCase()) && 
                        !formData.skills.includes(s)
                      ).map((skillOption) => (
                        <div
                          key={skillOption}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                          onClick={() => handleSkillSelect(skillOption)}
                        >
                          {skillOption}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {formData.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.skills.map((s, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Education and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                  Education Level
                </label>
                <select
                  id="education"
                  name="education"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.education}
                  onChange={handleChange}
                >
                  {educationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  id="experience"
                  name="experience"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Benefits & Screening Questions</h2>
            
            {/* Benefits and Perks */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Benefits & Perks
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Select benefits offered with this position
              </p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {benefitOptions.map((benefit) => (
                  <div key={benefit} className="flex items-start">
                    <input
                      id={`benefit-${benefit}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      checked={formData.benefits.includes(benefit)}
                      onChange={() => handleCheckboxChange('benefits', benefit)}
                    />
                    <label htmlFor={`benefit-${benefit}`} className="ml-2 block text-sm text-gray-700">
                      {benefit}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Work Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Schedule
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Select applicable work schedules
              </p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {scheduleOptions.map((schedule) => (
                  <div key={schedule} className="flex items-start">
                    <input
                      id={`schedule-${schedule}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      checked={formData.workSchedule.includes(schedule)}
                      onChange={() => handleCheckboxChange('workSchedule', schedule)}
                    />
                    <label htmlFor={`schedule-${schedule}`} className="ml-2 block text-sm text-gray-700">
                      {schedule}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Application Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="applicationInstructions" className="block text-sm font-medium text-gray-700">
                  Application Instructions (Optional)
                </label>
                <textarea
                  id="applicationInstructions"
                  name="applicationInstructions"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.applicationInstructions}
                  onChange={handleChange}
                  placeholder="Any special instructions for applicants..."
                />
              </div>
              
              <div>
                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
                  Application Deadline (Optional)
                </label>
                <input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Screening Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Screening Questions (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Add questions to help screen candidates
              </p>
              
              {formData.screeningQuestions.length > 0 && (
                <div className="space-y-3 mt-4 mb-4">
                  {formData.screeningQuestions.map((q, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{q.question}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-1 flex items-center">
                        <input
                          id={`required-${index}`}
                          name="required"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={q.required}
                          onChange={(e) => handleScreeningQuestionChange(e, index)}
                        />
                        <label htmlFor={`required-${index}`} className="ml-2 block text-sm text-gray-700">
                          Required answer
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-3 space-y-3">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  placeholder="e.g., Do you have experience with React?"
                />
                <div className="flex items-center">
                  <input
                    id="new-question-required"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion({...newQuestion, required: e.target.checked})}
                  />
                  <label htmlFor="new-question-required" className="ml-2 block text-sm text-gray-700">
                    Required answer
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">Review Your Job Post</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">{formData.title}</h3>
                <p className="text-sm text-gray-600">{formData.company} • {formData.location}</p>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Job Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Employment Type:</span> {formData.employmentType}
                    </div>
                    {(formData.salaryMin || formData.salaryMax) && (
                      <div>
                        <span className="font-medium">Salary Range:</span> {formData.salaryMin && `$${formData.salaryMin.toLocaleString()}`}{formData.salaryMin && formData.salaryMax && ' - '}{formData.salaryMax && `$${formData.salaryMax.toLocaleString()}`} {formData.salaryPeriod}
                      </div>
                    )}
                    {formData.salary && (
                      <div>
                        <span className="font-medium">Salary:</span> {formData.salary}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Experience:</span> {formData.experience}
                    </div>
                    <div>
                      <span className="font-medium">Education:</span> {formData.education}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{formData.description}</p>
                </div>
                
                {formData.requirements && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{formData.requirements}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((s, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                
                {formData.benefits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits & Perks</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-1">
                      {formData.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.workSchedule.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Work Schedule</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {formData.workSchedule.map((schedule, index) => (
                        <li key={index}>{schedule}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.applicationDeadline && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Application Deadline</h4>
                    <p className="text-sm text-gray-600">{new Date(formData.applicationDeadline).toLocaleDateString()}</p>
                  </div>
                )}
                
                {formData.screeningQuestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Screening Questions</h4>
                    <ul className="space-y-2">
                      {formData.screeningQuestions.map((q, index) => (
                        <li key={index} className="text-sm">
                          <p className="font-medium">{q.question} {q.required && <span className="text-red-500">*</span>}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Add a new function to handle navigation after successful posting
  const handleViewPostedJobs = () => {
    navigate('/posted-jobs');
  };

  // Add this function to render company dropdown items with logos
  const renderCompanyDropdownItem = (company) => {
    const logo = getCompanyLogo(company);
    
    return (
      <div
        key={company}
        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 flex items-center"
        onClick={() => {
          setFormData({...formData, company});
          toggleDropdown('company');
          // If the company has a logo, we'll set it directly here
          const logoUrl = getCompanyLogo(company);
          if (logoUrl) {
            setCompanyLogo(logoUrl);
          }
        }}
      >
        {logo && (
          <img 
            src={logo} 
            alt={`${company} logo`}
            className="h-5 w-5 mr-3 object-contain"
          />
        )}
        <span>{company}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            {isEditMode ? 'Edit Job Posting' : 'Post a New Job'}
          </h1>
          
          {/* Progress indicator */}
          {renderProgressBar()}
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Job {isEditMode ? 'updated' : 'posted'} successfully!
                  </p>
                  {/* Add buttons for next actions */}
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={handleViewPostedJobs}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      View Posted Jobs
                    </button>
                    <button
                      onClick={handleBackToDashboard}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    validateCurrentStep() 
                      ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      : 'bg-blue-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating Job...' : 'Posting Job...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Job' : 'Post Job'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;