import React from 'react';
import { X, Truck } from 'lucide-react';

interface TruckModalProps {
  onClose: () => void;
}

const TruckModal: React.FC<TruckModalProps> = ({ onClose }) => {
  const destinations = [
    { id: 'poultry', label: 'Poultry Farm', emoji: '🐔', color: 'from-yellow-400 to-orange-400' },
    { id: 'airport', label: 'Airport', emoji: '✈️', color: 'from-blue-400 to-indigo-400' },
    { id: 'petshop', label: 'Pet Shop', emoji: '🐕', color: 'from-pink-400 to-purple-400' },
    { id: 'market', label: 'Market', emoji: '🏪', color: 'from-green-400 to-emerald-400' },
  ];

  const handleDestinationClick = (destination: string) => {
    console.log(`Truck destination chosen: ${destination}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full transform animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <Truck className="text-yellow-300" size={32} />
            <h2 className="text-3xl font-bold">Transportation Challenge</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Truck Image Placeholder */}
          <div className="mb-6 flex justify-center">
            <div className="w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
              <Truck size={64} className="text-gray-500" />
            </div>
          </div>

          {/* Question */}
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Where should the truck take the fish? 🤔
          </h3>

          {/* Destination Options */}
          <div className="grid grid-cols-2 gap-4">
            {destinations.map((destination) => (
              <button
                key={destination.id}
                onClick={() => handleDestinationClick(destination.label)}
                className={`bg-gradient-to-br ${destination.color} hover:scale-105 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="text-4xl mb-2">{destination.emoji}</div>
                <div className="text-xl font-bold">{destination.label}</div>
              </button>
            ))}
          </div>

          {/* Hint */}
          <p className="text-center text-gray-500 mt-6 text-sm">
            Think about where fresh fish would be most useful! 🐟
          </p>
        </div>
      </div>
    </div>
  );
};

export default TruckModal;