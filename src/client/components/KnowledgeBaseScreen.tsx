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
    <div className="min-h-[100dvh] bg-brand-green flex flex-col font-sans p-4 sm:p-8 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 3px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-white border-[6px] border-black p-4 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <button 
            onClick={onBack}
            className="bg-black text-white font-black px-4 py-2 uppercase hover:bg-brand-yellow hover:text-black transition-colors border-2 border-transparent"
          >
            ← BACK
          </button>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">KNOWLEDGE BASE</h1>
        </div>

        {/* Accordion Menu */}
        <div className="flex flex-col gap-6">
          {KNOWLEDGE_CATEGORIES.map((category) => (
            <div key={category.id} className="w-full">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between p-6 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${category.color} transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl bg-white border-4 border-black w-16 h-16 flex items-center justify-center rounded-full shadow-inner">{category.icon}</span>
                  <h2 className="font-black text-2xl uppercase tracking-tight text-left">{category.title}</h2>
                </div>
                <span className="text-4xl font-black">{openCategory === category.id ? '−' : '+'}</span>
              </button>

              <AnimatePresence>
                {openCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white border-x-[6px] border-b-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-2 sm:mx-4 transform -translate-y-2"
                  >
                    <div className="p-6 sm:p-8 flex flex-col gap-6 pt-8">
                      {category.points.map((point, index) => (
                        <div key={index} className="border-l-[6px] border-brand-yellow pl-4">
                          <h3 className="font-black text-xl mb-3 bg-black text-white inline-block px-3 py-1 transform -rotate-1">{point.title}</h3>
                          <div className="font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {point.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};