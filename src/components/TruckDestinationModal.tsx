import React, { useState } from 'react';
import { X, Truck, ChevronsRight, Home, ShoppingCart, Utensils, ArrowLeft, RefreshCw, Undo2, Factory, Plane, Wheat, PawPrint } from 'lucide-react';

interface TruckDestinationModalProps {
  onClose: () => void;
  onNavigate: (scene: number) => void;
}

// Added all the new steps for the Processing journey
type JourneyStep = 
  | 'initial' 
  | 'market' | 'delivery' | 'shopping' | 'kitchen' | 'final_consumption'
  | 'processing_factory' | 'processing_export' 
  | 'processing_livestock_agro' | 'processing_livestock_poultry' | 'processing_livestock_final'
  | 'processing_petshop' | 'processing_petshop_pet' | 'processing_petshop_aquarium';

const JourneyStepContent: React.FC<{step: JourneyStep, setStep: React.Dispatch<React.SetStateAction<JourneyStep>>, onNavigate: (scene: number) => void, onClose: () => void}> = ({ step, setStep, onNavigate, onClose }) => {
    switch (step) {
        // --- CONSUMPTION JOURNEY ---
        case 'market':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Market.png" alt="Main Market" className="journey-image" />
                    <h3 className="journey-title">Do you want home delivery or shopping?</h3>
                    <div className="journey-buttons-row">
                        <button onClick={() => setStep('delivery')} className="btn-primary bg-blue-500 hover:bg-blue-600"><Home className="mr-2"/> Home Delivery</button>
                        <button onClick={() => setStep('shopping')} className="btn-primary bg-teal-500 hover:bg-teal-600"><ShoppingCart className="mr-2"/> Shopping</button>
                    </div>
                    <button onClick={() => setStep('initial')} className="btn-secondary mt-4"><ArrowLeft className="mr-2"/>Back to Truck</button>
                </div>
            );
        case 'delivery':
             return (
                <div className="text-center">
                    <img src="/images/Truck/Home-Delivery.png" alt="Home Delivery" className="journey-image"/>
                    <div className="journey-buttons-row">
                        <button onClick={() => setStep('kitchen')} className="btn-primary bg-green-500 hover:bg-green-600">What's Next? <ChevronsRight/></button>
                    </div>
                    <button onClick={() => setStep('initial')} className="btn-secondary mt-4"><ArrowLeft className="mr-2"/>Back to Truck</button>
                </div>
            );
        case 'shopping':
             return (
                <div className="text-center">
                    <img src="/images/Truck/Local_shop.png" alt="Local Market" className="journey-image"/>
                    <div className="journey-buttons-row">
                         <button onClick={() => setStep('kitchen')} className="btn-primary bg-green-500 hover:bg-green-600">What's Next? <ChevronsRight/></button>
                    </div>
                    <button onClick={() => setStep('initial')} className="btn-secondary mt-4"><ArrowLeft className="mr-2"/>Back to Truck</button>
                </div>
            );
        case 'kitchen':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Kitchen.png" alt="Kitchen" className="journey-image"/>
                    <div className="journey-buttons-row">
                         <button onClick={() => setStep('final_consumption')} className="btn-primary bg-green-500 hover:bg-green-600">What's Next? <ChevronsRight/></button>
                    </div>
                    <button onClick={() => setStep('initial')} className="btn-secondary mt-4"><ArrowLeft className="mr-2"/>Back to Truck</button>
                </div>
            );
        case 'final_consumption':
            return (
                 <div className="text-center">
                    <img src="/images/Truck/Food.png" alt="Food on Plate" className="journey-image"/>
                    <p className="journey-text">The fish has completed its journey from the sea to the table, providing a nutritious meal.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { onNavigate(3); onClose(); }} className="btn-primary bg-indigo-500 hover:bg-indigo-600"><Undo2 className="mr-2"/>Go back to Fish Market</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                        <button onClick={() => setStep('market')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Main Market</button>
                    </div>
                </div>
            );

        // --- PROCESSING JOURNEY ---
        case 'processing_factory':
            return (
                <div className="text-center">
                    <img src="/images/Truck/factory.png" alt="Processing Factory" className="journey-image"/>
                    <p className="journey-text"> Trawler owners now sell the bycatch fish to dealers, who partially process it before selling. Fish meal comprises around 6% of the final, processed feed. </p>
                    <div className="journey-buttons-row">
                        <button onClick={() => setStep('processing_export')} className="btn-primary bg-purple-500 hover:bg-purple-600"><Plane className="mr-2"/> Export</button>
                        <button onClick={() => setStep('processing_livestock_agro')} className="btn-primary bg-yellow-500 hover:bg-yellow-600"><Wheat className="mr-2"/> Livestock</button>
                        <button onClick={() => setStep('processing_petshop')} className="btn-primary bg-pink-500 hover:bg-pink-600"><PawPrint className="mr-2"/> Pet Shop</button>
                    </div>
                    <button onClick={() => setStep('initial')} className="btn-secondary mt-4"><ArrowLeft className="mr-2"/>Back to Truck</button>
                </div>
            );
        case 'processing_export':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Airplane.png" alt="Airport" className="journey-image"/>
                     <p className="journey-text">In the financial year 2023–24, India exported marine products worth US$7.38 billion (₹ 60,523.89 crore), overexploiting fish stocks </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setStep('processing_factory')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Factory</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                    </div>
                </div>
            );
        case 'processing_livestock_agro':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Poultry.png" alt="Agro Shop" className="journey-image"/>
                    <button onClick={() => setStep('processing_livestock_poultry')} className="btn-primary bg-green-500 hover:bg-green-600 mb-4">What's Next? <ChevronsRight/></button>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setStep('processing_factory')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Factory</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                    </div>
                </div>
            );
        case 'processing_livestock_poultry':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Poultry_farm.png" alt="Poultry Farm" className="journey-image"/>
                     <button onClick={() => setStep('processing_livestock_final')} className="btn-primary bg-green-500 hover:bg-green-600 mb-4">What's Next? <ChevronsRight/></button>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setStep('processing_factory')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Factory</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                    </div>
                </div>
            );
        case 'processing_livestock_final':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Your_plate.png" alt="Your Plate" className="journey-image"/>
                    <p className="journey-text">Over the last two decades, there has been a growing demand for bycatch fish from the poultry industry. Poultry production is currently growing faster in India than elsewhere in Asia as the country’s rising affluence fuels a shift away from vegetarianism. These trends are likely to continue through the next decade, further increasing the demand for fish meal.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { onNavigate(3); onClose(); }} className="btn-primary bg-indigo-500 hover:bg-indigo-600"><Undo2 className="mr-2"/>Go back to Fish Market</button>
                        <button onClick={() => setStep('processing_factory')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Factory</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                    </div>
                </div>
            );
        case 'processing_petshop':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Pet_shop.png" alt="Pet Shop" className="journey-image"/>
                    <div className="journey-buttons-row">
                        <button onClick={() => setStep('processing_petshop_pet')} className="btn-primary bg-blue-500 hover:bg-blue-600">Pet</button>
                        <button onClick={() => setStep('processing_petshop_aquarium')} className="btn-primary bg-teal-500 hover:bg-teal-600">Aquarium</button>
                    </div>
                </div>
            );
        case 'processing_petshop_pet':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Your_pet.png" alt="Your Pet" className="journey-image"/>
                    <p className="journey-text">Pet food is made from small fish, fish heads, or bycatch from trawlers. These are cleaned, cooked, and ground into fishmeal or fish oil, which are then mixed with grains, vitamins, and other ingredients to make kibble or wet food for cats and dogs. Using large amounts of bycatch for pet food can raise concerns about the impact on marine life and the food chain.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { onNavigate(3); onClose(); }} className="btn-primary bg-indigo-500 hover:bg-indigo-600"><Undo2 className="mr-2"/>Go back to Fish Market</button>
                         <button onClick={() => setStep('processing_factory')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Factory</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                    </div>
                </div>
            );
        case 'processing_petshop_aquarium':
            return (
                <div className="text-center">
                    <img src="/images/Truck/Aquarium.png" alt="Your Aquarium" className="journey-image"/>
                     <p className="journey-text"> Fishmeal constitutes a cheap source of protein and is also an important source of crucial micronutrients, not easily available in other protein alternatives such as soyabean.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { onNavigate(3); onClose(); }} className="btn-primary bg-indigo-500 hover:bg-indigo-600"><Undo2 className="mr-2"/>Go back to Fish Market</button>
                         <button onClick={() => setStep('processing_factory')} className="btn-secondary"><ArrowLeft className="mr-2"/>Back to Factory</button>
                        <button onClick={() => setStep('initial')} className="btn-secondary"><RefreshCw className="mr-2"/>Back to Truck</button>
                    </div>
                </div>
            );

        // --- INITIAL CHOICE ---
        default: 
            return (
                 <div className="text-center">
                    <img src="/images/Truck/Truck.png" alt="Fish Transportation Truck" className="journey-image"/>
                    <h3 className="journey-title">Where does the fish go now?</h3>
                    <div className="journey-buttons-row">
                        <button onClick={() => setStep('market')} className="btn-primary bg-green-500 hover:bg-emerald-600">For Consumption</button>
                        <button onClick={() => setStep('processing_factory')} className="btn-primary bg-sky-500 hover:bg-blue-600">For Processing</button>
                    </div>
                </div>
            );
    }
}


const TruckDestinationModal: React.FC<TruckDestinationModalProps> = ({ onClose, onNavigate }) => {
  const [journeyStep, setJourneyStep] = useState<JourneyStep>('initial');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-5 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-orange-100 transition-colors" aria-label="Close modal"><X size={24} /></button>
          <div className="flex items-center space-x-3"><Truck size={32} /><h2 className="text-2xl font-bold">The Journey Continues!</h2></div>
        </div>
        <div className="p-6 overflow-y-auto">
             <JourneyStepContent step={journeyStep} setStep={setJourneyStep} onNavigate={onNavigate} onClose={onClose} />
        </div>
      </div>
      <style>{`
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; color: white; transition: all 0.3s ease; transform: scale(1); }
        .btn-primary:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .btn-secondary { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; color: #4A5568; background-color: #E2E8F0; transition: background-color 0.3s ease; }
        .btn-secondary:hover { background-color: #CBD5E0; }
        .journey-image { border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 24rem; margin: 0 auto 1rem; }
        .journey-title { font-size: 1.25rem; font-weight: 600; color: #2D3748; margin-bottom: 1.5rem; }
        .journey-text { color: #4A5568; margin: 1rem 0; font-size: 1rem; }
        .journey-buttons-row { display: flex; flex-direction: column; gap: 0.75rem; justify-content: center; }
        @media (min-width: 640px) { .journey-buttons-row { flex-direction: row; gap: 1rem; } }
      `}</style>
    </div>
  );
};

export default TruckDestinationModal;

