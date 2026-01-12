
import React from 'react';
import { ReceiptItem, Member } from '../types';
import { CheckCircle, Circle, Users } from 'lucide-react';

interface Props {
  items: ReceiptItem[];
  members: Member[];
  onToggleItemAssignment: (itemId: string, memberId: string) => void;
}

const BillSplitter: React.FC<Props> = ({ items, members, onToggleItemAssignment }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Assign Items</h3>
        <p className="text-xs text-gray-500">Tap names to split an item</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800 leading-tight">{item.name}</h4>
                <p className="text-sm text-indigo-600 font-bold mt-0.5">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Users size={14} />
                <span className="text-xs font-medium">{item.assignedTo.length}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {members.map((member) => {
                const isAssigned = item.assignedTo.includes(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => onToggleItemAssignment(item.id, member.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isAssigned
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isAssigned ? <CheckCircle size={12} /> : <Circle size={12} />}
                    {member.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillSplitter;
