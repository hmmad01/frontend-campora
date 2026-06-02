
import { useState, useEffect } from 'react';
import { ChevronDown, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { faqApi, type FaqItem } from '../../api';

import imgCamping from '@/images/header FAQ.png';

interface FAQDisplayItem {
  id: number;
  question: string;
  answer: string;
}

function HelpCircleIcon() {
  return (
    <svg viewBox="0 0 27 27" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M13.5 9.5625C13.0524 9.5625 12.6232 9.74029 12.3068 10.0568C11.9903 10.3732 11.8125 10.8024 11.8125 11.25V11.3704C11.8125 11.5196 11.7532 11.6626 11.6477 11.7681C11.5423 11.8736 11.3992 11.9329 11.25 11.9329C11.1008 11.9329 10.9577 11.8736 10.8523 11.7681C10.7468 11.6626 10.6875 11.5196 10.6875 11.3704V11.25C10.6875 10.5041 10.9838 9.78871 11.5113 9.26126C12.0387 8.73382 12.7541 8.4375 13.5 8.4375H13.6305C14.1783 8.43767 14.7129 8.60556 15.1624 8.91859C15.6119 9.23163 15.9548 9.6748 16.1449 10.1885C16.3351 10.7022 16.3633 11.2618 16.226 11.7921C16.0886 12.3224 15.7922 12.7979 15.3765 13.1546L14.5091 13.8983C14.3693 14.0185 14.2569 14.1674 14.1799 14.335C14.1028 14.5025 14.0628 14.6847 14.0625 14.8691V15.4688C14.0625 15.6179 14.0032 15.761 13.8977 15.8665C13.7923 15.972 13.6492 16.0312 13.5 16.0312C13.3508 16.0312 13.2077 15.972 13.1023 15.8665C12.9968 15.761 12.9375 15.6179 12.9375 15.4688V14.8691C12.9375 14.1671 13.2446 13.5011 13.7768 13.0444L14.643 12.3019C14.8846 12.0949 15.057 11.8189 15.1369 11.511C15.2169 11.2031 15.2007 10.8781 15.0904 10.5797C14.9801 10.2813 14.7811 10.0239 14.5201 9.84202C14.2591 9.66016 13.9486 9.56261 13.6305 9.5625H13.5ZM13.5 18.5625C13.7238 18.5625 13.9384 18.4736 14.0966 18.3154C14.2549 18.1571 14.3438 17.9425 14.3438 17.7188C14.3438 17.495 14.2549 17.2804 14.0966 17.1221C13.9384 16.9639 13.7238 16.875 13.5 16.875C13.2762 16.875 13.0616 16.9639 12.9034 17.1221C12.7451 17.2804 12.6562 17.495 12.6562 17.7188C12.6562 17.9425 12.7451 18.1571 12.9034 18.3154C13.0616 18.4736 13.2762 18.5625 13.5 18.5625Z"
        fill="white"
      />
      <path
        d="M3.9375 13.5C3.9375 10.9639 4.94497 8.53161 6.73829 6.73829C8.53161 4.94497 10.9639 3.9375 13.5 3.9375C16.0361 3.9375 18.4684 4.94497 20.2617 6.73829C22.055 8.53161 23.0625 10.9639 23.0625 13.5C23.0625 16.0361 22.055 18.4684 20.2617 20.2617C18.4684 22.055 16.0361 23.0625 13.5 23.0625C10.9639 23.0625 8.53161 22.055 6.73829 20.2617C4.94497 18.4684 3.9375 16.0361 3.9375 13.5ZM13.5 5.0625C11.2622 5.0625 9.11612 5.95145 7.53379 7.53379C5.95145 9.11612 5.0625 11.2622 5.0625 13.5C5.0625 15.7378 5.95145 17.8839 7.53379 19.4662C9.11612 21.0486 11.2622 21.9375 13.5 21.9375C15.7378 21.9375 17.8839 21.0486 19.4662 19.4662C21.0486 17.8839 21.9375 15.7378 21.9375 13.5C21.9375 11.2622 21.0486 9.11612 19.4662 7.53379C17.8839 5.95145 15.7378 5.0625 13.5 5.0625Z"
        fill="white"
      />
    </svg>
  );
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQDisplayItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? 'border-[#124756]/40' : 'border-black/10'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{item.question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#124756] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-4">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await faqApi.getAll();
        setFaqs(
          data.map((f: FaqItem) => ({
            id: f.id_faq,
            question: f.pertanyaan,
            answer: f.jawaban,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="w-full">

      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#124756] text-white px-5 py-2 rounded-full mb-5">
          <HelpCircleIcon />
          <span className="font-work text-sm font-medium tracking-wide">FAQ</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Temukan jawaban untuk pertanyaan umum seputar layanan kami
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <div className="lg:col-span-3 flex flex-col gap-5">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-gray-800">camporaid@gmail.com</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Nomor WhatsApp</p>
                  <p className="text-sm font-medium text-gray-800">085729649750</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href="mailto:camporaid@gmail.com"
                  className="flex items-center gap-1.5 bg-[#124756] text-white text-xs px-4 py-2 rounded-full hover:bg-[#0e3a47] transition-colors"
                >
                  <Mail size={13} /> Email
                </a>
                <a
                  href="https://wa.me/6285729649750"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#219653] text-white text-xs px-4 py-2 rounded-full hover:bg-[#1a7a44] transition-colors"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-[#124756]" size={30} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {faqs.map((item) => (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => toggle(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-md top-6 h-[530px] w-[500px]">
              <img src={imgCamping} alt="Camping Adventure" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
