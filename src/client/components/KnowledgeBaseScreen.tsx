import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_CATEGORIES = [
  {
    id: 'agency',
    title: '中介机构选择与合同签订',
    icon: '🤝',
    color: 'bg-brand-pink',
    points: [
      {
        title: '如何“避雷”不靠谱中介',
        content: '• 夸大承诺雷区：警惕任何“保证录取Top 10”、“和名校招生官有合作”等承诺。申请结果取决于你的背景和当年竞争情况，无人能百分百保证。\n• 信息不透明雷区：拒绝无法提供申请邮箱账号和密码的中介。你必须拥有所有申请材料的最终审核权和提交权。\n• 文书模板化雷区：如果对方提供的案例文书千篇一律，缺乏个人特色，说明其文书能力低下。\n• 人员流动性雷区：咨询时问清顾问从业年限，并确保合同中书写的顾问姓名与其一致，防止签约后频繁更换顾问或顾问离职导致申请中断。\n• 口碑调研：除了中介提供的案例，要多方查询其网络评价（如知乎、小红书、贴吧），并尝试联系该中介的过往学生获取真实反馈。'
      },
      {
        title: '建议签订时间与合同细节',
        content: '• 最佳时间：建议在申请季当年的春节后（2-4月）开始接触和筛选中介，最晚在暑假（7-8月）前确定。这样有充足的时间进行背景提升、文书头脑风暴和写作。\n• 合同必看条款：\n  - 服务明细：明确包含哪些学校的哪些专业、申请账号是否共享、文书修改次数上限、是否包含面试辅导等；\n  - 付款方式：强烈建议选择分阶段付款（如签约付30%，文书定稿付40%，收到第一个Offer付尾款30%），避免一次性付全款；\n  - 退款条款：这是合同的核心！必须明确“全拒得”如何退款（如退款比例）、以及若未申请约定数量的学校如何退款。条款要清晰，无模糊字眼；\n  - 附加费用：确认是否包含申请费、邮寄材料费、成绩单翻译认证费等，避免后续产生隐形消费。'
      }
    ]
  },
  {
    id: 'language',
    title: '雅思/托福等语言考试',
    icon: '📝',
    color: 'bg-brand-cyan',
    points: [
      {
        title: '考试时间点',
        content: '• 理想时间：最晚应在申请季当年的暑假结束前考出达标的语言成绩。例如，申请2025年秋季入学，应在2025年9月前完成考试并出分；\n• 原因：为后续的文书写作、申请材料准备留出充足时间。如果成绩不理想，还来得及在9-10月进行第二次考试；\n• 出分时间：雅思笔试成绩通常需要13天，托福iBT成绩约需6-10天。安排考试时需算上出分时间。'
      },
      {
        title: '成绩有效期与要求查询',
        content: '• 雅思/托福有效期均为2年，从考试日期算起。确保你的成绩在入学注册时依然在有效期内。\n• 官方渠道唯一：绝对不要只听信中介或旁人的说法，必须亲自上目标院校官网的招生页面查询。\n• 看清细节：很多专业不仅要求总分（如雅思7.0），还会要求单项小分（如写作不低于6.5）；同一大学内，文科专业的要求通常比理工科专业更高；\n• 豁免政策：如果你在英语国家完成全日制本科学习并取得学位，通常可以豁免语言成绩。具体政策以官网为准。'
      }
    ]
  }
];

export const KnowledgeBaseScreen = ({ onBack }: { onBack: () => void }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="min-h-[100dvh] bg-[#89CFF0] flex flex-col font-sans p-4 sm:p-8 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 4px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Giant Abstract Star/Explosion Background - Pop Adjusted */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[#FFE066] opacity-80 pointer-events-none" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full bg-[#FDF9F1] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-[#FDF9F1] relative">
          
          {/* Subtle brutalist grid inside content area */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {KNOWLEDGE_CATEGORIES.map((category) => (
            <div key={category.id} className="mb-10 relative z-10">
              {/* Category Header - Pop Tag Style with Shadow Layer */}
              <div className="relative inline-block mb-4 ml-2">
                <div className="absolute inset-0 bg-black transform translate-x-2 translate-y-2 -rotate-1"></div>
                <div className="relative bg-[#FFB3D9] text-black font-black uppercase text-sm sm:text-base px-4 py-2 border-[3px] border-black transform -rotate-3">
                  <span className="mr-2">{category.icon}</span> {category.title}
                </div>
              </div>
              
              <div className="space-y-4">
                {category.points.map((point, index) => {
                  const itemId = `${category.id}-${index}`;
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};