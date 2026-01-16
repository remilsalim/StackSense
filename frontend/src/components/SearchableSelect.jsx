import React, { useState, useEffect, useRef } from 'react';

const SearchableSelect = ({ options, value, onChange, placeholder, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        // If external value changes (e.g. reset), update search term only if it matches an option
        // or allows custom input. Here we want to show the selected value.
        setSearchTerm(value || '');
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                // If the current search term isn't a valid option, revert to value? 
                // Or allow custom values? For now, let's keep it simple: 
                // If user typed something but didn't select, we treat that as the value (allow custom).
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        onChange({ target: { name, value: e.target.value } });
    };

    const handleOptionClick = (option) => {
        setSearchTerm(option);
        onChange({ target: { name, value: option } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 p-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:bg-white truncate"
                    autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in-down">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className="cursor-pointer select-none relative py-2.5 pl-3 pr-9 hover:bg-indigo-50 transition-colors text-gray-900"
                            onClick={() => handleOptionClick(option)}
                        >
                            <span className={`block truncate ${value === option ? 'font-semibold text-indigo-600' : 'font-normal'}`}>
                                {option}
                            </span>
                            {value === option && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && filteredOptions.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 px-3 text-sm text-gray-500">
                    No matching options found.
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
