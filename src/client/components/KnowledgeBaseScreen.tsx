import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_CATEGORIES = [
  {
    id: 'agency',
    title: 'Agencies & Scam Avoidance',
    icon: '🤝',
    color: 'bg-brand-pink',
    points: [
      {
        title: 'How to Avoid Unreliable Agencies',
        content: '• Exaggerated Promises: Beware of "Top 10 Admission Guarantee" or "Partnerships with Admissions Officers". Results depend on your profile and competition; no one can guarantee 100% success.\n• Lack of Transparency: Reject agencies that won\'t share application email accounts and passwords. You must have the final review and submission rights for all materials.\n• Templated Essays: If their sample essays look identical and lack a personal touch, it indicates poor writing capabilities.\n• High Turnover Rate: Ask about the consultant\'s years of experience and ensure their name is in the contract to avoid frequent changes or application disruptions if they leave.\n• Background Check: Beyond the agency\'s successful cases, check online reviews (e.g., Reddit, local forums) and try to contact their past students for genuine feedback.'
      },
      {
        title: 'Recommended Signing Time & Contract Details',
        content: '• Best Timing: Start screening agencies between February and April of the application year, and finalize by summer (July-August) at the latest. This leaves ample time for background improvement, essay brainstorming, and writing.\n• Must-Check Contract Clauses:\n  - Service Details: Clarify included schools/majors, account sharing, essay revision limits, and interview coaching;\n  - Payment Terms: Strongly recommend milestone-based payments (e.g., 30% on signing, 40% on essay finalization, 30% on first offer) instead of full upfront payment;\n  - Refund Policy: The core of the contract! Clearly define refund ratios for "all rejections" or if the agreed number of schools aren\'t applied to. No vague wording;\n  - Extra Fees: Confirm if application, mailing, and transcript translation/certification fees are included to avoid hidden costs.'
      },
      {
        title: 'DIY vs. Semi-DIY vs. All-Inclusive',
        content: '• All-Inclusive: Suitable for those with poor self-control and extreme time constraints, but highly prone to assembly-line work and loss of application control.\n• Semi-DIY: Agency handles school targeting and essay polishing; you handle the online application and material submission. Best ROI, but requires strong information-gathering skills.\n• Pure DIY: Ideal for top students with great profiles, ample time, and strong execution. Produces the most personalized essays with zero agency fees, but has a high trial-and-error cost.'
      }
    ]
  },
  {
    id: 'language',
    title: 'Language & Standardized Tests',
    icon: '📝',
    color: 'bg-brand-cyan',
    points: [
      {
        title: 'IELTS/TOEFL: Exam Timeline',
        content: '• Ideal Timing: Achieve the target language score by the end of the summer before the application season. E.g., for Fall 2025 admission, finish the exam and get scores by September 2024.\n• Reason: Leaves ample time for essay writing and material preparation. If the score is suboptimal, you still have time for a retake in September-October.\n• Score Release: IELTS paper-based takes about 13 days; TOEFL iBT takes 6-10 days. Factor this in when scheduling.'
      },
      {
        title: 'IELTS/TOEFL: Requirements & Waivers',
        content: '• Official Channels Only: Never rely solely on agencies or hearsay; always check the target university\'s official admissions page.\n• Check Details: Many programs require not just an overall score (e.g., IELTS 7.0) but also sub-scores (e.g., Writing 6.5+). Humanities usually demand higher scores than STEM within the same university.\n• Waiver Policies: If you completed a full-time undergraduate degree in an English-speaking country (usually 2+ years) or meet specific criteria, you can apply for a language score waiver.'
      },
      {
        title: 'GRE/GMAT: Should You Take It?',
        content: '• Trend: In recent years, more top master\'s programs (especially in the US) have adopted "Test-Optional" policies for GRE/GMAT.\n• Decision Criteria:\n  - If your GPA is low, a high GRE (320+) is strongly recommended to prove academic capability;\n  - For top business schools (e.g., Finance, MBA), a high GMAT (700+) remains a massive plus;\n  - If the target program is Test-Optional and your other profile metrics are extremely strong, you can skip it to save energy.'
      }
    ]
  },
  {
    id: 'gpa',
    title: 'GPA Weight & Background',
    icon: '📊',
    color: 'bg-[#FFE066]',
    points: [
      {
        title: 'GPA Weight & Remedies',
        content: '• Core Metric: GPA is usually the hardest threshold in applications. For most Top 50 schools, 3.0/4.0 is the baseline, 3.5+ is the norm, and 3.8+ offers core competitiveness.\n• Trend Over Absolute Value: If freshman grades are poor but sophomore/junior years show a clear Upward Trend, admissions officers will see your potential and adaptability.\n• Core Major Courses: Grades in major-related courses matter far more than general electives. If overall GPA is low, try listing "Major GPA" separately on your CV or in essays.\n• Remedies: If your GPA is finalized and low, compensate with a high GRE/GMAT, high-value research experience, or excellent summer research/exchange programs.'
      },
      {
        title: 'Research Experience: Finding & Doing',
        content: '• How to Find: Sending cold emails to professors at your university to assist in their labs is the most direct way. Also, look out for external or overseas summer research programs.\n• No "Fake Research": Name-only research is easily exposed during interviews or essay deep-dives. Admissions care about What you did, Skills applied, and Impact/Result.\n• Goal-Oriented: The ultimate goal of research isn\'t just the experience itself, but producing a paper (even as a co-author) or securing a Strong Recommendation Letter (RL).'
      },
      {
        title: 'Internships: Big Name vs. Core Role?',
        content: '• Master vs. PhD: For Coursework Masters, high-value internships at Big Name companies are often favored over generic research.\n• Title vs. Content: Between a "marginal admin role at a Big Tech" and a "core business role at a startup", the latter is more valuable for applications as it yields concrete achievements.\n• Duration: A superficial 1-month internship means little. Aim for 2-3 deep internships, each lasting 3+ months.'
      }
    ]
  },
  {
    id: 'document',
    title: 'Essays & Recommendation Letters',
    icon: '✍️',
    color: 'bg-[#D0BFFF]',
    points: [
      {
        title: 'Core Logic of PS/SOP',
        content: '• No Laundry Lists: Don\'t make the PS an expanded CV. The CV is the skeleton; the PS is the flesh. Use specific "stories" or "project details" to show your motivation and skills.\n• Classic Trilogy: Why this field? (Your academic motivation); Why me? (Your preparation and how your research/internships prove your competence); Why this program? (How this specific program helps your career goals).\n• Tailoring: Never mass-submit one PS. Tailoring it to different schools\' curricula, professors\' research, and program vibes (Career-oriented vs. Academic-oriented) is crucial.'
      },
      {
        title: 'CV/Resume Formatting Rules',
        content: '• One-Page Rule: For undergrads applying to master\'s, strictly keep the CV to 1 page. Omit irrelevant hobbies or lengthy self-evaluations.\n• Action Verbs: Start experience bullet points with strong action verbs (e.g., Developed, Implemented, Designed, Led) instead of a passive "Responsible for".\n• Data-Driven: Quantify your achievements. "Optimized algorithm" is weaker than "Optimized algorithm, reducing runtime by 30%".\n• Reverse Chronological: List both education and experience starting from the most recent (Reverse Chronological Order).'
      },
      {
        title: 'Recommendation Letter (RL) Tips',
        content: '• "Big Name" vs. "Strong" RL: A letter from an industry giant who knows you well (Big Name + Strong) is ideal. But if the giant only knows you briefly and writes a generic template (Weak), a highly detailed letter from a young associate professor who knows you well (Strong) is much better.\n• Recommender Mix: Usually 2-3 letters are needed. Suggested mix: 2 Academic Recommenders (proving academic/research skills) + 1 Professional Recommender (proving practical/teamwork skills).\n• Communicate Early: Don\'t wait until a week before the deadline. Email them 1-2 months in advance, attaching your CV and transcript to help them write.'
      }
    ]
  }
];

export const KnowledgeBaseScreen = ({ onBack }: { onBack: () => void }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const totalPages = KNOWLEDGE_CATEGORIES.length;
  const currentCategory = KNOWLEDGE_CATEGORIES[currentPage];

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setOpenCategory(null); // Reset expanded item on page change
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      setOpenCategory(null); // Reset expanded item on page change
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#89CFF0] flex flex-col font-sans p-4 sm:p-8 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 4px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Giant Abstract Star/Explosion Background - Pop Adjusted */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[#FFE066] opacity-80 pointer-events-none" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col h-full max-h-[85vh] sm:max-h-[800px] bg-[#FDF9F1] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mr-4 sm:mr-auto sm:ml-auto">
        {/* Header */}
        <div className="bg-white border-b-[6px] border-black p-3 sm:p-4 sticky top-0 z-20 flex items-center justify-between shadow-[0px_4px_0px_0px_#D0BFFF]">
          <button 
            onClick={onBack}
            className="bg-black text-white font-black text-xs sm:text-sm px-3 py-1 border-[3px] border-black hover:bg-[#FFA6A6] hover:text-black transition-colors shadow-[3px_3px_0px_0px_#FFE066] hover:shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none flex items-center gap-1 transform -rotate-2"
          >
            <span>←</span> <span className="hidden sm:inline">BACK</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black flex-1 text-center transform rotate-1">
            SURVIVAL GUIDE
          </h1>
          <div className="w-12 sm:w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Content (Paginated) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-[#FDF9F1] relative">
          
          {/* Subtle brutalist grid inside content area */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentCategory.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-10 relative z-10"
            >
              {/* Category Header - Pop Tag Style with Shadow Layer */}
              <div className="relative inline-block mb-6 ml-2 mt-2">
                <div className="absolute inset-0 bg-black transform translate-x-2 translate-y-2 -rotate-1"></div>
                <div className={`relative ${currentCategory.color || 'bg-[#FFB3D9]'} text-black font-black uppercase text-base sm:text-lg px-4 py-2 border-[3px] border-black transform -rotate-3`}>
                  <span className="mr-2">{currentCategory.icon}</span> {currentCategory.title}
                </div>
              </div>
              
              <div className="space-y-4">
                {currentCategory.points.map((point, index) => {
                  const itemId = `${currentCategory.id}-${index}`;
                  const isExpanded = openCategory === itemId;
                  
                  return (
                    <div 
                      key={index} 
                      className="relative group"
                    >
                      {/* Decorative Shadow Layer (Pop Style offset) */}
                      <div className={`absolute inset-0 transition-colors duration-300 transform translate-x-1.5 translate-y-1.5 ${isExpanded ? 'bg-[#FFE066]' : 'bg-[#D0BFFF]'}`} style={{ clipPath: 'polygon(0 0, 100% 2%, 99% 100%, 1% 98%)' }}></div>
                      
                      {/* Main Item Container */}
                      <div 
                        className={`border-[4px] border-black transition-all duration-300 relative z-10 ${isExpanded ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                        style={{ clipPath: isExpanded ? 'polygon(1% 0, 100% 2%, 99% 100%, 0 98%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                      >
                        <button 
                          onClick={() => toggleCategory(itemId)}
                          className="w-full text-left p-3 sm:p-4 font-black text-sm sm:text-base flex justify-between items-center relative overflow-hidden"
                        >
                          {/* Halftone texture overlay on button hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFE066 2px, transparent 2px)', backgroundSize: '8px 8px' }}></div>
                          
                          <span className="uppercase tracking-tighter pr-4 leading-snug z-10 relative">
                            {/* Numbering Tag */}
                            <span className={`inline-block mr-2 px-2 py-0.5 border-[2px] border-black transform -rotate-2 ${isExpanded ? 'bg-white text-black' : 'bg-black text-white'}`}>
                              #0{index + 1}
                            </span>
                            {point.title}
                          </span>
                          
                          <span className={`text-2xl font-black transform transition-transform duration-300 z-10 relative ${isExpanded ? 'rotate-45 text-[#FFE066]' : 'group-hover:scale-125 group-hover:text-[#FFA6A6]'}`}>
                            {isExpanded ? '✖' : '+'}
                          </span>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-[#FDF9F1] text-black border-t-[4px] border-black relative"
                            >
                              {/* Inner background texture for content */}
                              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMjAiIHkyPSIyMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]"></div>
                              
                              <div className="p-4 sm:p-5 text-sm sm:text-base font-bold leading-relaxed relative z-10">
                                {point.content.split('\n').map((paragraph, pIndex) => (
                                  <p key={pIndex} className="mb-3 last:mb-0">
                                    {paragraph.trim().startsWith('•') ? (
                                      <span className="flex gap-2 items-start">
                                        <span className="text-[#FFA6A6] font-black mt-0.5">▶</span>
                                        <span>{paragraph.replace('•', '').trim()}</span>
                                      </span>
                                    ) : (
                                      paragraph
                                    )}
                                  </p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Pagination Controls */}
        <div className="bg-white border-t-[6px] border-black p-4 sticky bottom-0 z-20 flex items-center justify-between shadow-[0px_-4px_0px_0px_#D0BFFF]">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`font-black text-sm sm:text-base px-4 py-2 border-[3px] border-black transform rotate-1 transition-all ${currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#89CFF0] text-black hover:bg-black hover:text-[#89CFF0] shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none'}`}
          >
            ← PREV
          </button>
          
          <div className="font-black text-lg tracking-widest bg-black text-white px-3 py-1 border-[2px] border-white transform -rotate-2">
            {currentPage + 1} / {totalPages}
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`font-black text-sm sm:text-base px-4 py-2 border-[3px] border-black transform -rotate-1 transition-all ${currentPage === totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#FFE066] text-black hover:bg-black hover:text-[#FFE066] shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none'}`}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};