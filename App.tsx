
import React, { useState, useEffect } from 'react';
import { Member, ReceiptItem } from './types';
import { parseReceipt } from './services/geminiService';
import ReceiptUploader from './components/ReceiptUploader';
import MemberManager from './components/MemberManager';
import BillSplitter from './components/BillSplitter';
import SplitSummary from './components/SplitSummary';
import { ChevronLeft, Receipt, Users, Calculator, Sparkles, RefreshCcw } from 'lucide-react';

enum Step {
  UPLOAD = 'upload',
  MEMBERS = 'members',
  SPLIT = 'split',
  SUMMARY = 'summary'
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleImageCaptured = async (base64: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await parseReceipt(base64);
      setItems(data.items.map((item, idx) => ({
        ...item,
        id: `item-${idx}`,
        assignedTo: []
      })));
      setTax(data.tax);
      setTotal(data.total);
      setCurrentStep(Step.MEMBERS);
    } catch (err) {
      console.error(err);
      setError("Oops! Failed to parse the receipt. Please try again with a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = (name: string) => {
    const newMember: Member = { id: `mem-${Date.now()}`, name };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    // Clean up assignments
    setItems(items.map(item => ({
      ...item,
      assignedTo: item.assignedTo.filter(mid => mid !== id)
    })));
  };

  const toggleItemAssignment = (itemId: string, memberId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const isAssigned = item.assignedTo.includes(memberId);
        return {
          ...item,
          assignedTo: isAssigned 
            ? item.assignedTo.filter(id => id !== memberId)
            : [...item.assignedTo, memberId]
        };
      }
      return item;
    }));
  };

  const goBack = () => {
    if (currentStep === Step.MEMBERS) setCurrentStep(Step.UPLOAD);
    if (currentStep === Step.SPLIT) setCurrentStep(Step.MEMBERS);
    if (currentStep === Step.SUMMARY) setCurrentStep(Step.SPLIT);
  };

  const reset = () => {
    if (confirm("Reset everything?")) {
      setItems([]);
      setMembers([]);
      setTax(0);
      setTotal(0);
      setCurrentStep(Step.UPLOAD);
    }
  };

  const renderProgress = () => {
    const steps = [
      { id: Step.UPLOAD, icon: Receipt },
      { id: Step.MEMBERS, icon: Users },
      { id: Step.SPLIT, icon: Sparkles },
      { id: Step.SUMMARY, icon: Calculator },
    ];

    return (
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          const isCompleted = steps.findIndex(st => st.id === currentStep) > idx;
          
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110' : 
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon size={18} />
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentStep !== Step.UPLOAD && (
            <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Split<span className="text-indigo-600">It</span>
          </h1>
        </div>
        {currentStep !== Step.UPLOAD && (
          <button onClick={reset} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <RefreshCcw size={18} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderProgress()}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 animate-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        {currentStep === Step.UPLOAD && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Split the bill in seconds</h2>
              <p className="text-gray-500 text-sm">Snap a photo and let our AI handle the rest.</p>
            </div>
            <ReceiptUploader onImageCaptured={handleImageCaptured} isLoading={isLoading} />
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-indigo-50 p-4 rounded-3xl space-y-2">
                <div className="bg-indigo-600 w-8 h-8 rounded-xl flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <h4 className="font-bold text-indigo-900 text-sm">AI Powered</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">Automatic item and price detection with 99% accuracy.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-3xl space-y-2">
                <div className="bg-emerald-600 w-8 h-8 rounded-xl flex items-center justify-center text-white">
                  <Users size={16} />
                </div>
                <h4 className="font-bold text-emerald-900 text-sm">Fair Splits</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">Split items, share taxes, and add tips effortlessly.</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === Step.MEMBERS && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <MemberManager 
              members={members} 
              onAddMember={addMember} 
              onRemoveMember={removeMember} 
            />
          </div>
        )}

        {currentStep === Step.SPLIT && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <BillSplitter 
              items={items} 
              members={members} 
              onToggleItemAssignment={toggleItemAssignment} 
            />
          </div>
        )}

        {currentStep === Step.SUMMARY && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <SplitSummary 
              items={items} 
              members={members} 
              totalTax={tax} 
              onPay={(sum) => alert(`Simulating payment link for ${sum.memberName}: $${sum.total.toFixed(2)}`)}
            />
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      {currentStep !== Step.UPLOAD && (
        <div className="p-6 bg-white border-t border-gray-100">
          {currentStep === Step.MEMBERS && (
            <button
              disabled={members.length === 0}
              onClick={() => setCurrentStep(Step.SPLIT)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <span>Next: Assign Items</span>
              <ArrowRight size={20} />
            </button>
          )}

          {currentStep === Step.SPLIT && (
            <button
              disabled={items.some(i => i.assignedTo.length === 0)}
              onClick={() => setCurrentStep(Step.SUMMARY)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {items.some(i => i.assignedTo.length === 0) ? (
                <span>Assign All Items To Continue</span>
              ) : (
                <>
                  <span>Calculate Final Split</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          )}

          {currentStep === Step.SUMMARY && (
            <button
              onClick={() => reset()}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <span>Start New Bill</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ArrowRight: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default App;
