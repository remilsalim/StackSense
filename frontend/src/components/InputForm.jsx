import React, { useState } from 'react';
import SearchableSelect from './SearchableSelect';
import { PROJECT_TYPES } from '../data/projectTypes';
import { DOMAINS } from '../data/domains';
import { SCALES, TEAM_SIZES, BUDGETS } from '../data/formOptions';
import { PRIORITIES } from '../data/priorities';

const InputForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        project_type: 'Web App',
        domain: 'E-commerce',
        expected_scale: 'Small (Hundreds of users)',
        team_size: 'Solo Developer',
        budget: 'Tight / Bootstrapped',
        priorities: ["Functionality & Correctness"], // Default selection
        // Legacy fields for internal state compatibility if needed, but we rely on 'priorities'
        hardware_integration: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const togglePriority = (priority) => {
        setFormData(prev => {
            const current = prev.priorities || [];
            if (current.includes(priority)) {
                return { ...prev, priorities: current.filter(p => p !== priority) };
            } else {
                return { ...prev, priorities: [...current, priority] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 space-y-8 animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Describe Your Vision
                </h2>
                <p className="text-gray-500 mt-2">Tell us about your project constraints and goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 tracking-wide">Project Type</label>
                    <SearchableSelect
                        options={PROJECT_TYPES}
                        value={formData.project_type}
                        onChange={handleChange}
                        name="project_type"
                        placeholder="Select Project Type..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 tracking-wide">Domain</label>
                    <SearchableSelect
                        options={DOMAINS}
                        value={formData.domain}
                        onChange={handleChange}
                        name="domain"
                        placeholder="Select Domain..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 tracking-wide">Expected Scale</label>
                    <SearchableSelect
                        options={SCALES}
                        value={formData.expected_scale}
                        onChange={handleChange}
                        name="expected_scale"
                        placeholder="Select Scale..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 tracking-wide">Team Size</label>
                    <SearchableSelect
                        options={TEAM_SIZES}
                        value={formData.team_size}
                        onChange={handleChange}
                        name="team_size"
                        placeholder="Select Team Size..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 tracking-wide">Budget</label>
                    <SearchableSelect
                        options={BUDGETS}
                        value={formData.budget}
                        onChange={handleChange}
                        name="budget"
                        placeholder="Select Budget..."
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Priorities (Select all that apply)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PRIORITIES.map((priority) => (
                        <div
                            key={priority}
                            onClick={() => togglePriority(priority)}
                            className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer select-none group ${formData.priorities.includes(priority)
                                    ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-colors ${formData.priorities.includes(priority)
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'border-gray-300 bg-white group-hover:border-indigo-400'
                                }`}>
                                {formData.priorities.includes(priority) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`ml-3 text-sm font-medium ${formData.priorities.includes(priority) ? 'text-indigo-900' : 'text-gray-700'
                                }`}>
                                {priority}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all active:scale-95 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl'}`}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </span>
                ) : 'Generate Recommendation'}
            </button>
        </form>
    );
};

export default InputForm;
