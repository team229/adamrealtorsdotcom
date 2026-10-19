import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { contact } from '@/data/site';

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {contact.faqs.map((faq, index) => {
        const isOpen = openId === faq.id;
        const isLast = index === contact.faqs.length - 1;

        return (
          <div
            key={faq.id}
            className={`transition-colors ${
              isLast ? '' : 'border-b border-border'
            } ${isOpen ? 'bg-secondary/40' : 'hover:bg-secondary/30'}`}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                id={`faq-trigger-${faq.id}`}
                className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span
                  className={`text-sm font-semibold transition-colors sm:text-[15px] ${
                    isOpen
                      ? 'text-primary'
                      : 'text-foreground group-hover:text-primary'
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'rotate-180 border-primary/25 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground/60 group-hover:border-primary/25 group-hover:text-primary'
                  }`}
                >
                  <ChevronDown size={14} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pr-10 text-sm leading-relaxed text-muted-foreground sm:px-6">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
