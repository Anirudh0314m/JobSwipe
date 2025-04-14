import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '../components/common/Autocomplete';
import PhoneInput from '../components/common/PhoneInput';
import { top500Companies, commonJobTitles, countries, usStates } from '../utils/companyData';

const PostJobPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    description: '',
    requirements: '',
    location: '',
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
    screeningQuestions: []
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
  
  useEffect(() => {
    // Prefill company name if user is logged in
    if (user?.company) {
      setFormData(prev => ({ ...prev, company: user.company }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Convert salary strings to numbers if they exist
      const submitData = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined
      };
      
      // Submit to API
      const response = await api.post('/api/jobs', submitData);
      
      console.log('Job posting created:', response.data);
      
      setSuccess(true);
      
      // Navigate to matches page after a delay
      setTimeout(() => {
        navigate('/matches');
      }, 3000);
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <input
                id="title"
                name="title"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Data Analyst"
              />
            </div>
            
            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Amazon, Google, Your Company"
              />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA or Remote"
              />
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
            
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g., JavaScript, React, SQL"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Post a New Job</h1>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > index + 1 ? 'bg-blue-600' : 
                    currentStep === index + 1 ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-200'
                  }`}>
                    {currentStep > index + 1 ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className={`text-sm font-medium ${currentStep === index + 1 ? 'text-white' : 'text-gray-500'}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className={`w-full h-1 ${currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-medium">Basic Info</span>
              <span className="text-xs font-medium">Description</span>
              <span className="text-xs font-medium">Details</span>
              <span className="text-xs font-medium">Review</span>
            </div>
          </div>
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Job posted successfully! Redirecting to matches page...</p>
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
                      Posting Job...
                    </>
                  ) : (
                    'Post Job'
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