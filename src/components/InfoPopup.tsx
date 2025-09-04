import React, { useState, useEffect } from 'react';
import { InteractiveElementData, SubElementData } from '../types/gameTypes';
import { X, Sparkles, Eye } from 'lucide-react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

// A smaller, simpler popup for individual species
const SpeciesPopup: React.FC<{subElement: SubElementData, onClose: () => void, isMobile: boolean}> = ({ subElement, onClose, isMobile }) => {
    const imageUrl = isMobile ? subElement.popupImages.mobile : subElement.popupImages.desktop;
    return (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-2 z-30" onClick={onClose}>
             <div className="relative w-full max-w-md bg-white rounded-lg p-2 shadow-xl">
                 <button onClick={onClose} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg text-gray-700 hover:text-black transition-colors z-10">
                     <X size={24}/>
                 </button>
                 <img src={imageUrl} alt={subElement.name} className="w-full h-auto rounded"/>
             </div>
        </div>
    )
}

const BycatchMiniGame = ({ element, onElementDiscovered }: { element: InteractiveElementData; onElementDiscovered: (elementId: number) => void; }) => {
  const [visuallyDiscoveredIds, setVisuallyDiscoveredIds] = useState(new Set<number>());
  const [selectedSubElement, setSelectedSubElement] = useState<SubElementData | null>(null);
  const [devMode, setDevMode] = useState(false);
  const isMobile = useIsMobile();
  
  const backgroundImage = element.popupImages ? (isMobile ? element.popupImages.mobile : element.popupImages.desktop) : '';
  const subElements = element.subElements || [];

  const handleSubElementHover = (subElement: SubElementData) => {
      if(!visuallyDiscoveredIds.has(subElement.id)) {
          setVisuallyDiscoveredIds(prev => {
              const newIds = new Set(prev).add(subElement.id);
              if(newIds.size === subElements.length) {
                  onElementDiscovered(element.id);
              }
              return newIds;
          });
      }
  };
  
  const handleSubElementClick = (subElement: SubElementData) => {
      if(visuallyDiscoveredIds.has(subElement.id)) {
          setSelectedSubElement(subElement);
      }
  };

  const debugColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
  const discoveredCount = visuallyDiscoveredIds.size;
  const totalCount = subElements.length;

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Explore the Bycatch Pile!</h3>
      <p className="text-center text-gray-600 mb-4">Hover to discover, then click to learn more.</p>

      {/* Progress Bar moved to the top */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="flex justify-between items-center mb-1 text-sm"><span className="font-semibold text-gray-700">Species Found</span><span>{discoveredCount} / {totalCount}</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2.5 rounded-full" style={{ width: `${(discoveredCount / totalCount) * 100}%` }}/></div>
      </div>

      <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-inner bg-gray-200">
        <img src={backgroundImage} alt={element.name} className="w-full h-auto" />
        
        {/* Render colored overlays for discovered species */}
        {subElements.filter(se => visuallyDiscoveredIds.has(se.id)).map(subEl => (
             <img key={`color-${subEl.id}`} src={subEl.coloredImage} alt="" className="absolute pointer-events-none object-contain z-10" style={subEl.position}/>
        ))}

        {/* Render hover/click triggers */}
        {subElements.map(subEl => {
          const currentHoverArea = isMobile && subEl.mobileHoverArea ? subEl.mobileHoverArea : subEl.hoverArea;
          return (
            <div
              key={subEl.id}
              className="absolute cursor-pointer z-20"
              style={{ ...currentHoverArea }}
              onMouseEnter={() => handleSubElementHover(subEl)}
              onClick={() => handleSubElementClick(subEl)}
            />
          )
        })}

        {devMode && subElements.map((subEl, index) => {
            const currentHoverArea = isMobile && subEl.mobileHoverArea ? subEl.mobileHoverArea : subEl.hoverArea;
            return (
                <div key={`dev-${subEl.id}`} className="absolute pointer-events-none border-2 border-dashed z-30" style={{ ...currentHoverArea, backgroundColor: debugColors[index % debugColors.length]}}>
                  <span className="bg-black text-white text-xs p-1 rounded opacity-75">{subEl.name}</span>
                </div>
            )
        })}
        
        {selectedSubElement && <SpeciesPopup subElement={selectedSubElement} onClose={() => setSelectedSubElement(null)} isMobile={isMobile} />}
      </div>

       <div className="max-w-3xl mx-auto mt-4">
            <button onClick={() => setDevMode(!devMode)} className="w-full flex items-center justify-center space-x-2 text-xs bg-gray-600 text-white px-3 py-1.5 rounded-md">
                <Eye size={14} /><span>{devMode ? 'Hide' : 'Show'} Species Hover Areas</span>
            </button>
       </div>
    </div>
  );
};

// Main InfoPopup Component remains largely the same
const InfoPopup: React.FC<{ element: InteractiveElementData; onClose: () => void; onElementDiscovered: (elementId: number) => void; }> = ({ element, onClose, onElementDiscovered }) => {
  const isMiniGame = element.subElements && element.subElements.length > 0;
  const isMobile = useIsMobile();
  const imageUrl = element.popupImages ? (isMobile ? element.popupImages.mobile : element.popupImages.desktop) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 md:p-6 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-white hover:text-gray-200"><X size={24} /></button>
          <div className="flex items-center space-x-3"><Sparkles className="text-yellow-300" size={28} /><h2 className="text-xl md:text-2xl font-bold">{element.name} Discovered!</h2></div>
        </div>
        <div className="overflow-y-auto">
            {isMiniGame ? (
              <BycatchMiniGame element={element} onElementDiscovered={onElementDiscovered} />
            ) : (
              <div className="p-4 md:p-6">
                {imageUrl && (<div className="mb-4 rounded-lg overflow-hidden flex justify-center"><img src={imageUrl} alt={element.name} className="w-full h-auto object-contain max-h-52" /></div>)}
                <p className="text-gray-700 text-base md:text-lg text-center">{element.infoText}</p>
              </div>
            )}
        </div>
        <div className="p-4 md:p-6 pt-0 mt-auto flex justify-center">
            <button onClick={onClose} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg">Continue Exploring</button>
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;

