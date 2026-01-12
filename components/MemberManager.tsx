
import React, { useState } from 'react';
import { UserPlus, X, User } from 'lucide-react';
import { Member } from '../types';

interface Props {
  members: Member[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: string) => void;
}

const MemberManager: React.FC<Props> = ({ members, onAddMember, onRemoveMember }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddMember(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Who's Splitting?</h3>
        <span className="text-sm text-gray-500">{members.length} people</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Friend's name..."
          className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={20} />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200"
          >
            <User size={14} />
            {member.name}
            <button
              onClick={() => onRemoveMember(member.id)}
              className="hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-gray-400 italic">Add some friends to start splitting!</p>
        )}
      </div>
    </div>
  );
};

export default MemberManager;
