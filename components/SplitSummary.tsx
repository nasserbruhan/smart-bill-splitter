
import React, { useState } from 'react';
import { Member, ReceiptItem, BillSummary } from '../types';
import { DollarSign, Wallet, ArrowRight, Info } from 'lucide-react';

interface Props {
  items: ReceiptItem[];
  members: Member[];
  totalTax: number;
  onPay?: (summary: BillSummary) => void;
}

const SplitSummary: React.FC<Props> = ({ items, members, totalTax, onPay }) => {
  const [tipPercentage, setTipPercentage] = useState<number>(18);

  // Calculate split
  const summaries: BillSummary[] = members.map((member) => {
    let subtotal = 0;
    items.forEach((item) => {
      if (item.assignedTo.includes(member.id)) {
        subtotal += item.price / item.assignedTo.length;
      }
    });

    const billSubtotal = items.reduce((sum, item) => sum + item.price, 0);
    const taxShare = billSubtotal > 0 ? (subtotal / billSubtotal) * totalTax : 0;
    const tipAmount = subtotal * (tipPercentage / 100);

    return {
      memberId: member.id,
      memberName: member.name,
      subtotal,
      tax: taxShare,
      tip: tipAmount,
      total: subtotal + taxShare + tipAmount,
    };
  });

  const grandTotal = summaries.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <p className="text-indigo-100 text-sm font-medium">Grand Total</p>
          <div className="bg-indigo-500 bg-opacity-30 p-2 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <h2 className="text-4xl font-bold">${grandTotal.toFixed(2)}</h2>
        <div className="mt-4 flex gap-4 text-xs text-indigo-100 border-t border-indigo-500 pt-4">
          <p>Tax: ${totalTax.toFixed(2)}</p>
          <p>Tip ({tipPercentage}%): ${(grandTotal - totalTax - (grandTotal / (1 + tipPercentage/100))).toFixed(2)} (est.)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Info size={18} className="text-indigo-600" />
          Adjust Tip
        </h3>
        <div className="flex gap-2">
          {[15, 18, 20, 25].map((p) => (
            <button
              key={p}
              onClick={() => setTipPercentage(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tipPercentage === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}%
            </button>
          ))}
          <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-2">
            <span className="text-xs text-gray-400 mr-1">%</span>
            <input
              type="number"
              value={tipPercentage}
              onChange={(e) => setTipPercentage(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {summaries.map((summary) => (
          <div key={summary.memberId} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                {summary.memberName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{summary.memberName}</h4>
                <p className="text-xs text-gray-500">Items: ${summary.subtotal.toFixed(2)} + Tax/Tip</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <p className="text-lg font-black text-indigo-600">${summary.total.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => onPay?.(summary)}
                className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                title="Settle Up"
              >
                <DollarSign size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitSummary;
