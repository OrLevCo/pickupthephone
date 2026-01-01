'use client';

import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });

  const handleFirstInteraction = () => {
    setHasInteracted(true);
    setIsClosing(false);
    setShowPopup(true);
  };

  const handleRadioChange = (question: string, value: string) => {
    handleFirstInteraction();
    setFormData((prev) => ({ ...prev, [question]: value }));
  };


  const handleSliderChange = (question: string, value: string) => {
    handleFirstInteraction();
    setFormData((prev) => ({ ...prev, [question]: value }));
  };

  const getYearLabel = (value: string) => {
    const labels = ['<1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'];
    const index = parseInt(value) || 0;
    return labels[index] || labels[0];
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'The Ultimate Guide to Crushing It in CRE',
        text: 'Try this "ultimate guide"—spoiler alert!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
      setFormData({
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
      });
      setHasInteracted(false);
    }, 300); // Match animation duration
  };

  const handleTryAgain = () => {
    handleClosePopup();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
  };

  const handleCopy = () => {
    const text = 'You have to check out this guide: pickupthephone.club/2026-guide';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Trigger form card animation on mount with a small delay to ensure it plays
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={{ 
        backgroundColor: '#000000'
      }}
    >
      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1">
        {/* Quiz Form */}
        <div 
          className={`border border-stone-800 bg-white max-w-[600px] mx-auto rounded-sm overflow-hidden ${isMounted ? 'animate-slide-in-bottom' : ''}`}
          style={!isMounted ? { transform: 'translateY(40px)', opacity: 0 } : undefined}
        >
          {/* Header Section with Yellow Background */}
          <div 
            className="p-8 sm:p-10 pb-6 border-b border-black/10"
            style={{
              background: 'radial-gradient(circle at top center, #FFEEC3 0%, #FED97D 27%, #FAB300 68%, #DFA000 100%)'
            }}
          >
            <p className="text-black/70 text-center text-sm mb-2 font-medium">
              Pick Up the Phone Club™️ Presents
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black text-center mb-4 leading-tight" style={{ letterSpacing: '-2px' }}>
              The Ultimate Guide for<br />Success in CRE in 2026
            </h1>
            <p className="text-black/70 text-center text-base mb-0 font-medium">
              Get custom AI-based CRE coaching in seconds
            </p>
          </div>
          <div className="p-8 sm:p-10 pt-6">
          {/* Progress Bar - HIDDEN */}
          {/* <div className="mb-4 flex items-center gap-2">
            <span className="text-black/60 text-xs font-medium">0/5 questions</span>
            <div className="flex-1 h-0.5 bg-black/5">
              <div className="h-full bg-black/20" style={{ width: '0%' }}></div>
            </div>
          </div> */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question 1 - Asset Class */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">Which asset class do you focus on?</h3>
              <div className="flex flex-wrap gap-4 pl-2">
                {['Office', 'Retail', 'Multifamily', 'Industrial', 'Land', 'Mixed‑Use'].map((option) => (
                  <label key={option} className="flex items-center space-x-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="q1"
                      value={option}
                      checked={formData.q1 === option}
                      onChange={(e) => handleRadioChange('q1', e.target.value)}
                      className="w-3 h-3 text-[#FAB300] border-black/20 focus:ring-2 focus:ring-[#FAB300] focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-black group-hover:text-black/80 transition-colors text-[13px] font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 - Your Role - HIDDEN */}
            {/* <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">What is your role?</h3>
              <div className="flex flex-wrap gap-4 pl-2">
                {['Broker', 'Investor', 'Leasing', 'Other'].map((option) => (
                  <label key={option} className="flex items-center space-x-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="q2"
                      value={option}
                      checked={formData.q2 === option}
                      onChange={(e) => handleRadioChange('q2', e.target.value)}
                      className="w-3 h-3 text-[#FAB300] border-black/20 focus:ring-2 focus:ring-[#FAB300] focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-black group-hover:text-black/80 transition-colors text-[13px] font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div> */}

            {/* Question 3 - Experience */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">How many years have you been in the business?</h3>
              <div className="pl-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-black/60 font-medium">&lt;1 year</span>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={formData.q3 ? ['<1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'].indexOf(formData.q3) : 0}
                    onChange={(e) => {
                      const labels = ['<1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'];
                      handleSliderChange('q3', labels[parseInt(e.target.value)]);
                    }}
                    onMouseDown={handleFirstInteraction}
                    onTouchStart={handleFirstInteraction}
                    className="flex-1 h-2 bg-black/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #FAB300 0%, #FAB300 ${((formData.q3 ? ['<1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'].indexOf(formData.q3) : 0) / 4) * 100}%, rgba(0,0,0,0.2) ${((formData.q3 ? ['<1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'].indexOf(formData.q3) : 0) / 4) * 100}%, rgba(0,0,0,0.2) 100%)`
                    }}
                  />
                  <span className="text-xs text-black/60 font-medium">30+ years</span>
                </div>
              </div>
            </div>

            {/* Question 4 - Market */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">Which state do you focus on?</h3>
              <div
                onClick={handleFirstInteraction}
                className="w-full px-3 py-2 border border-black/20 rounded-sm bg-white text-black text-[13px] font-medium cursor-pointer flex items-center justify-between"
              >
                <span>Select a state...</span>
                <svg className="w-3 h-3 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Question 5 - Call Volume */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">How many cold calls did you make last week?</h3>
              <div className="pl-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-black/60 font-medium">0</span>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    defaultValue={0}
                    value={formData.q5 ? ['0', '1–10', '11–25', '26–50', '50+'].indexOf(formData.q5) : 0}
                    onChange={(e) => {
                      const labels = ['0', '1–10', '11–25', '26–50', '50+'];
                      handleSliderChange('q5', labels[parseInt(e.target.value)]);
                    }}
                    onMouseDown={handleFirstInteraction}
                    onTouchStart={handleFirstInteraction}
                    className="flex-1 h-2 bg-black/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #FAB300 0%, #FAB300 ${((formData.q5 ? ['0', '1–10', '11–25', '26–50', '50+'].indexOf(formData.q5) : 0) / 4) * 100}%, rgba(0,0,0,0.2) ${((formData.q5 ? ['0', '1–10', '11–25', '26–50', '50+'].indexOf(formData.q5) : 0) / 4) * 100}%, rgba(0,0,0,0.2) 100%)`
                    }}
                  />
                  <span className="text-xs text-black/60 font-medium">50+</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                data-tooltip-id="submit-tooltip"
                data-tooltip-content="Fill the form first. No Cheating :)"
                className="w-full px-8 py-3 text-black font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FAB300] focus:ring-offset-2 transition-opacity text-[13px] uppercase tracking-wide cursor-not-allowed rounded-sm"
                style={{
                  background: 'linear-gradient(to bottom, #FED97D 0%, #FAB300 50%, #DFA000 100%)'
                }}
              >
                Get your ultimate guide
              </button>
              <Tooltip
                id="submit-tooltip"
                place="top"
                delayShow={0}
                className="!bg-black !text-white !text-xs !font-medium !px-3 !py-2 !rounded-sm !z-50 !shadow-lg"
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '0',
                }}
              />
            </div>
          </form>
          </div>
        </div>
        <p className="text-center text-xs text-white/50 py-4">2026Ⓒ <a href="https://www.trophy.inc" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline transition-all duration-[250ms]">Trophy</a></p>

        {/* Share It Section */}
        <div className="mt-20 pt-12">
          <div className="bg-stone-900 border border-stone-800 p-12 sm:p-14 rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: '-0.5px' }}>Give your team the gift<br />of AI CRE coaching</h2>
              <p className="text-white/80 font-medium">
                Drop this in your team chat or share with colleagues.
              </p>
            </div>
            {/* Right Column */}
            <div>
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <textarea
                    readOnly
                    value="You have to check out this guide: pickupthephone.club/2026-guide"
                    onClick={handleCopy}
                    className="w-full px-4 py-3 pr-10 border border-black/20 rounded-sm bg-white text-black text-sm font-medium resize-none cursor-pointer hover:border-black/40 transition-colors"
                    rows={3}
                    aria-label="Message to copy"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 text-black/60 hover:text-black transition-colors pointer-events-none"
                    aria-label="Copy"
                  >
                    <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-6 py-3 text-black font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FAB300] focus:ring-offset-2 transition-opacity whitespace-nowrap cursor-pointer uppercase text-[13px] rounded-sm"
                  style={{
                    background: 'linear-gradient(to bottom, #FED97D 0%, #FAB300 50%, #DFA000 100%)'
                  }}
                >
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Hidden */}
        {/* <div className="mt-20 pt-12">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center" style={{ letterSpacing: '-0.5px' }}>FAQ</h2>
            <p className="text-white/80 font-medium text-center mb-6">Want to know more?</p>
            <div className="space-y-2">
            <div className="bg-stone-900 border border-stone-800 rounded-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full flex items-center justify-between py-4 px-4 text-left cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-white">What is this?</h3>
                <svg className={`w-3 h-3 text-white/80 transition-transform ${openFaq === 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === 0 ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pb-4 px-4">
                  <p className="text-white/80 font-medium">
                    This is a free service to CRE pros nationwide, that picking up the phone is the fastest way to business.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full flex items-center justify-between py-4 px-4 text-left cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-white">Who's behind this?</h3>
                <svg className={`w-3 h-3 text-white/80 transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === 1 ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pb-4 px-4">
                  <p className="text-white/80 font-medium">
                    Pick Up The Phone Club™️ is a venerable establishment of CRE professionals seeking to maximize dealflow.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full flex items-center justify-between py-4 px-4 text-left cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-white">I'm a residential broker, is this for me?</h3>
                <svg className={`w-3 h-3 text-white/80 transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === 2 ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pb-4 px-4">
                  <p className="text-white/80 font-medium">
                    No, go away.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full flex items-center justify-between py-4 px-4 text-left cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-white">Are you sure I should pick up the phone?</h3>
                <svg className={`w-3 h-3 text-white/80 transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === 3 ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pb-4 px-4">
                  <p className="text-white/80 font-medium">
                    Yes.
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div> */}
      </main>

      {/* Popup Modal */}
      {(showPopup || isClosing) && (
        <div 
          className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
          onClick={handleClosePopup}
        >
          <div 
            className={`bg-white max-w-2xl w-full p-8 sm:p-10 relative rounded-sm ${isClosing ? 'animate-slide-out-bounce' : 'animate-slide-in-bounce'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 p-2 text-black/60 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-16">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-0.5" style={{ letterSpacing: '-0.5px' }}>
                Doesn't matter,
              </h3>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4 leading-tight" style={{ letterSpacing: '-2px' }}>
                Pick Up The Phone.
              </h2>
              <p className="text-base text-black/70 mb-2 font-medium">
                No AI is going to save you. Start dialing.
              </p>
            </div>
            
            {/* Share Section in Popup */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-3" style={{ letterSpacing: '-0.5px' }}>Give your team the gift<br />of AI CRE coaching</h2>
                  <p className="text-black/60 text-sm font-medium">
                    Drop this in your team chat or share with colleagues.
                  </p>
                </div>
                {/* Right Column */}
                <div>
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <textarea
                        readOnly
                        value="You have to check out this guide: pickupthephone.club/2026-guide"
                        onClick={handleCopy}
                        className="w-full px-4 py-3 pr-10 border border-black/20 rounded-sm bg-white text-black text-sm font-medium resize-none cursor-pointer hover:border-black/40 transition-colors"
                        rows={3}
                        aria-label="Message to copy"
                      />
                      <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 text-black/60 hover:text-black transition-colors"
                        aria-label="Copy"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-6 py-3 text-black font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FAB300] focus:ring-offset-2 transition-opacity whitespace-nowrap cursor-pointer uppercase text-[13px] rounded-sm"
                  style={{
                    background: 'linear-gradient(to bottom, #FED97D 0%, #FAB300 50%, #DFA000 100%)'
                  }}
                    >
                      {copied ? 'Copied!' : 'Copy text'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 mt-20 py-12">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-3">
            <span className="text-black/60 text-base font-medium">Made by your friends at</span>
            <a 
              href="https://www.trophy.inc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              {/* Trophy Logo */}
              <img 
                src="/trophy-logo.svg" 
                alt="Trophy" 
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

