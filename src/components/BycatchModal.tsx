import React from 'react';
import { X, Fish, Recycle } from 'lucide-react';

interface BycatchModalProps {
  onClose: () => void;
}

const BycatchModal: React.FC<BycatchModalProps> = ({ onClose }) => {
  const options = [
    { 
      id: 'animal-food', 
      label: 'Used for Animal Food', 
      emoji: '🐕', 
      color: 'from-green-400 to-emerald-500',
      description: 'Recycled into nutritious pet food'
    },
    { 
      id: 'dump', 
      label: 'Sent to a Dump Yard', 
      emoji: '🗑️', 
      color: 'from-red-400 to-pink-500',
      description: 'Unfortunately wasted'
    },
  ];

  const handleOptionClick = (option: string) => {
    console.log(`Bycatch destination chosen: ${option}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full transform animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <Fish className="text-yellow-300" size={32} />
            <h2 className="text-3xl font-bold">Bycatch Challenge</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Bycatch Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="w-48 h-32 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-xl flex items-center justify-center shadow-lg">
              <div className="flex space-x-2">
                <Fish size={32} className="text-teal-600" />
                <Recycle size={32} className="text-cyan-600" />
              </div>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
            What happens to the bycatch? 🐠
          </h3>
          
          <p className="text-center text-gray-600 mb-8">
            Bycatch are fish caught accidentally. Let's learn about their journey!
          </p>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.label)}
                className={`w-full bg-gradient-to-r ${option.color} hover:scale-105 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{option.emoji}</div>
                  <div className="text-left">
                    <div className="text-xl font-bold">{option.label}</div>
                    <div className="text-sm opacity-90">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Educational Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
            <p className="text-blue-800 text-sm">
              <strong>Did you know?</strong> Sustainable fishing practices help reduce bycatch and protect marine ecosystems! 🌊
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BycatchModal;