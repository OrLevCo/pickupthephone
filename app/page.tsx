'use client';

import { useState } from 'react';
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowPopup(true);
    }
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
    const labels = ['Under 1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'];
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

  const handleTryAgain = () => {
    setShowPopup(false);
    setFormData({
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
    });
    setHasInteracted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
  };

  const handleCopy = () => {
    const text = 'You have to check out this guide: pickupthephone.biz';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5C842] flex flex-col">
      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 flex-1">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black text-center mb-4 leading-tight" style={{ letterSpacing: '-3.2px' }}>
          The Ultimate Guide to Crushing It in CRE
        </h1>

        <p className="text-black/60 text-center text-lg mb-8 max-w-2xl mx-auto font-medium">
          Five quick questions to diagnose your path to deal flow.
        </p>

        {/* Quiz Form */}
        <div className="border border-black/20 p-8 sm:p-10 bg-white">
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
                      className="w-3 h-3 text-[#F5C842] border-black/20 focus:ring-2 focus:ring-[#F5C842] focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-black group-hover:text-black/80 transition-colors text-[13px] font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 - Your Role */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">Are you primarily a…</h3>
              <div className="flex flex-wrap gap-4 pl-2">
                {['Broker', 'Investor', 'Both'].map((option) => (
                  <label key={option} className="flex items-center space-x-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="q2"
                      value={option}
                      checked={formData.q2 === option}
                      onChange={(e) => handleRadioChange('q2', e.target.value)}
                      className="w-3 h-3 text-[#F5C842] border-black/20 focus:ring-2 focus:ring-[#F5C842] focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-black group-hover:text-black/80 transition-colors text-[13px] font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3 - Experience */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">How many years have you been in the business?</h3>
              <div className="pl-2 space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={formData.q3 ? ['Under 1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'].indexOf(formData.q3) : 0}
                    onChange={(e) => {
                      const labels = ['Under 1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'];
                      handleSliderChange('q3', labels[parseInt(e.target.value)]);
                    }}
                    onMouseDown={handleFirstInteraction}
                    onTouchStart={handleFirstInteraction}
                    className="flex-1 h-2 bg-black/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #F5C842 0%, #F5C842 ${((formData.q3 ? ['Under 1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'].indexOf(formData.q3) : 0) / 4) * 100}%, rgba(0,0,0,0.2) ${((formData.q3 ? ['Under 1 year', '1–3 years', '4–7 years', '8–15 years', '30+ years'].indexOf(formData.q3) : 0) / 4) * 100}%, rgba(0,0,0,0.2) 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-black/60 font-medium">
                  <span>Under 1 year</span>
                  <span>30+ years</span>
                </div>
              </div>
            </div>

            {/* Question 4 - Market */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">Which U.S. state is your main playground?</h3>
              <div
                onClick={handleFirstInteraction}
                className="w-full px-3 py-2 border border-black/20 rounded-none bg-white text-black text-[13px] font-medium cursor-pointer"
              >
                Select a state...
              </div>
            </div>

            {/* Question 5 - Call Volume */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">How many cold calls did you make last week?</h3>
              <div className="flex flex-wrap gap-4 pl-2">
                {['0', '1–10', '11–25', '26–50', '51+'].map((option) => (
                  <label key={option} className="flex items-center space-x-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="q5"
                      value={option}
                      checked={formData.q5 === option}
                      onChange={(e) => handleRadioChange('q5', e.target.value)}
                      className="w-3 h-3 text-[#F5C842] border-black/20 focus:ring-2 focus:ring-[#F5C842] focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-black group-hover:text-black/80 transition-colors text-[13px] font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                data-tooltip-id="submit-tooltip"
                data-tooltip-content="fill form first, no cheating"
                className="px-8 py-3 bg-black text-white font-bold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-opacity text-[13px] uppercase tracking-wide cursor-not-allowed"
              >
                Tell me how to win
              </button>
              <Tooltip
                id="submit-tooltip"
                place="top"
                delayShow={0}
                className="!bg-black !text-white !text-xs !font-medium !px-3 !py-2 !rounded-none !z-50 !shadow-lg"
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

        {/* Why This Exists Section */}
        <div className="mt-20 pt-12">
          <div className="text-center mb-4">
            <div className="inline-block text-black/40 text-2xl mb-6">⸻</div>
          </div>
          <h2 className="text-2xl font-bold text-black text-center mb-4">Why This Exists</h2>
          <p className="text-black/60 text-center max-w-2xl mx-auto font-medium">
            CRE is won on the phone, not in your browser. One click, a laugh, a shove toward the dial pad.
          </p>
        </div>

        {/* Share It Section */}
        <div className="mt-12 pt-12 border-t border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Share it with your friends</h2>
              <p className="text-black/60 font-medium">
                Drop this in your team chat or share with colleagues.
              </p>
            </div>
            {/* Right Column */}
            <div>
              <label className="block text-sm text-black/60 font-medium mb-2">
                Copy this message:
              </label>
              <div className="flex flex-col gap-2">
                <textarea
                  readOnly
                  value="You have to check out this guide: pickupthephone.biz"
                  onClick={handleCopy}
                  className="w-full px-4 py-3 border border-black/20 rounded-none bg-white text-black text-sm font-medium resize-none cursor-pointer hover:border-black/40 transition-colors"
                  rows={3}
                  aria-label="Message to copy"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-6 py-3 bg-black text-white font-bold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-opacity whitespace-nowrap cursor-pointer uppercase text-[13px]"
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Popup Modal */}
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPopup(false)}
        >
          <div 
            className="bg-white max-w-md w-full p-8 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <h4 className="text-lg text-black/80 mb-4">
                Doesn't matter
              </h4>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4 leading-tight" style={{ letterSpacing: '-2px' }}>
                PICK UP THE PHONE
              </h2>
              <p className="text-base text-black/70 mb-2 font-medium">
                Calls close deals. Forms don't. Close this tab and start dialing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleShare}
                className="flex-1 px-6 py-3 bg-black text-white font-bold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-opacity cursor-pointer uppercase text-[13px]"
              >
                Share
              </button>
              <button
                onClick={handleTryAgain}
                className="flex-1 px-6 py-3 bg-white border-2 border-black text-black font-bold hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors cursor-pointer uppercase text-[13px]"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-12">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-3">
            <span className="text-black/60 text-base font-medium">From your friends at</span>
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
