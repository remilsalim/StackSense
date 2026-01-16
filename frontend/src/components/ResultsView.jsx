import React from 'react';

const ResultsView = ({ results, onReset }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                        Your Tech Stack
                    </h2>
                    <p className="text-gray-600 mt-1">Optimized for <span className="font-semibold text-gray-800">{results.project_name}</span></p>
                </div>
                <button onClick={onReset} className="mt-4 sm:mt-0 px-6 py-2.5 rounded-full bg-white text-indigo-600 font-semibold shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all border border-indigo-100 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Start New Project
                </button>
            </div>

            {results.deployment_strategy && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700 relative overflow-hidden animate-fade-in-up">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            </span>
                            <h3 className="text-xl font-bold tracking-tight text-white">Recommended Deployment Strategy</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-cyan-200 mb-2">
                                    {results.deployment_strategy.title}
                                </h4>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {results.deployment_strategy.description}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Target Platforms</p>
                                <div className="flex flex-wrap gap-2">
                                    {results.deployment_strategy.recommended_platforms.map((platform, idx) => (
                                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.results.map((category) => (
                    <div key={category.category} className="group flex flex-col h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 hover:z-30 relative">
                        <div className={`h-2 w-full bg-gradient-to-r rounded-t-2xl ${getCategoryColor(category.category)}`}></div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{category.category}</h3>

                            {category.top_pick ? (
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                            {category.top_pick.technology.name}
                                        </h4>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                                        {category.top_pick.technology.description}
                                    </p>

                                    <div className="mt-auto">
                                        {category.top_pick.technology.key_benefits && category.top_pick.technology.key_benefits.length > 0 ? (
                                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
                                                <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-3 flex items-center">
                                                    <span className="bg-indigo-600 w-1 h-3 mr-2 rounded-full"></span>
                                                    Pro Advantages
                                                </p>
                                                <ul className="space-y-2">
                                                    {category.top_pick.technology.key_benefits.map((benefit, idx) => (
                                                        <li key={idx} className="text-sm text-gray-700 flex items-start leading-snug">
                                                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            <span dangerouslySetInnerHTML={{ __html: benefit.replace(/:(.*)/, ':<span class="font-medium text-gray-900">$1</span>') }}></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            // Fallback to reasons if no key_benefits (for backward compatibility)
                                            category.top_pick.reason.length > 0 && (
                                                <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                                                    <p className="text-xs font-bold text-indigo-800 mb-1">WHY THIS?</p>
                                                    <ul className="space-y-1">
                                                        {category.top_pick.reason.map((r, idx) => (
                                                            <li key={idx} className="text-xs text-indigo-700 flex items-start">
                                                                <span className="mr-1.5 mt-0.5 text-indigo-500">•</span>
                                                                {r}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )
                                        )}

                                        {/* Show Context-specific reasons below benefits if needed, or merge them? 
                          Let's keep context reasons as "Analysis Notes" if they exist and are different */}
                                        {category.top_pick.reason.length > 0 && category.top_pick.technology.key_benefits && (
                                            <div className="mb-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ANALYSIS NOTES</p>
                                                <ul className="space-y-1">
                                                    {category.top_pick.reason.map((r, idx) => (
                                                        <li key={idx} className="text-xs text-gray-500 flex items-start">
                                                            <span className="mr-1.5 mt-0.5 text-gray-300">•</span>
                                                            {r}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-bold text-gray-400">CLOSE ALTERNATIVES</p>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Hover to compare</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {category.alternatives.slice(0, 3).map((alt) => (
                                                    <div key={alt.technology.id} className="group/tooltip relative">
                                                        <span className="cursor-help inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                                            {alt.technology.name}
                                                            {/* <span className="ml-1.5 text-gray-400 text-[10px]">({alt.score})</span> */}
                                                        </span>

                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-3 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                            <p className="font-bold mb-1 border-b border-gray-700 pb-1">{alt.technology.name}</p>
                                                            <ul className="space-y-1">
                                                                {alt.reason.slice(0, 2).map((r, i) => (
                                                                    <li key={i} className="flex items-start">
                                                                        <span className="mr-1 text-green-400">✓</span> {r}
                                                                    </li>
                                                                ))}
                                                                <li className="text-gray-400 italic mt-1">Score: {alt.score}</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
                                    No specific recommendation
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper for category colors
const getCategoryColor = (cat) => {
    switch (cat) {
        case 'Frontend': return 'from-blue-400 to-cyan-400';
        case 'Backend': return 'from-emerald-400 to-green-500';
        case 'Database': return 'from-amber-400 to-orange-500';
        case 'DevOps': return 'from-gray-400 to-gray-600';
        case 'Hardware': return 'from-red-400 to-rose-500';
        default: return 'from-indigo-400 to-purple-500';
    }
};

export default ResultsView;
