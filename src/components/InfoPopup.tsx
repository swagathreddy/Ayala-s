import React, { useState, useEffect, useRef } from 'react';
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

const SpeciesPopup: React.FC<{subElement: SubElementData, onClose: () => void, isMobile: boolean}> = ({ subElement, onClose, isMobile }) => {
    const imageUrl = isMobile ? subElement.popupImages.mobile : subElement.popupImages.desktop;
    return (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-2 z-30" onClick={onClose}>
            <div className="relative w-full sm:max-w-xs md:max-w-md bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} >
                <img src={imageUrl} alt={subElement.name} className="w-full h-auto rounded-lg"/>
                <button onClick={onClose} className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md text-gray-800 hover:text-black hover:bg-white transition-all">
                    <X size={22}/>
                </button>
            </div>
        </div>
    )
}

type CalculatedSubElement = SubElementData & { calculatedHoverArea: React.CSSProperties; calculatedPosition: React.CSSProperties; };

const BycatchMiniGame: React.FC<{ element: InteractiveElementData; onElementDiscovered: (elementId: number) => void; }> = ({ element, onElementDiscovered }) => {
  const [hoveredSubElementId, setHoveredSubElementId] = useState<number | null>(null);
  const [clickedSubElementIds, setClickedSubElementIds] = useState(new Set<number>());
  const [selectedSubElement, setSelectedSubElement] = useState<SubElementData | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [calculatedSubElements, setCalculatedSubElements] = useState<CalculatedSubElement[]>([]);
  const isMobile = useIsMobile();
  const imageRef = useRef<HTMLImageElement>(null);
  
  const backgroundImage = element.popupImages ? (isMobile ? element.popupImages.mobile : element.popupImages.desktop) : '';
  const subElements = element.subElements || [];

  useEffect(() => {
    if (clickedSubElementIds.size === subElements.length && subElements.length > 0) {
      onElementDiscovered(element.id);
    }
  }, [clickedSubElementIds, subElements.length, onElementDiscovered, element.id]);

  const calculatePositions = () => {
    if (!imageRef.current) return;

    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current;
    
    if (naturalWidth === 0 || naturalHeight === 0) return;
    
    const imageAspectRatio = naturalWidth / naturalHeight;
    const containerAspectRatio = clientWidth / clientHeight;

    let renderedImageWidth = clientWidth;
    let renderedImageHeight = clientHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspectRatio > containerAspectRatio) {
      renderedImageHeight = clientWidth / imageAspectRatio;
      offsetY = (clientHeight - renderedImageHeight) / 2;
    } else {
      renderedImageWidth = clientHeight * imageAspectRatio;
      offsetX = (clientWidth - renderedImageWidth) / 2;
    }

    // --- MODIFICATION START ---
    // Be explicit about the object creation to ensure type safety.
    const newCalculatedElements: CalculatedSubElement[] = subElements.map((el): CalculatedSubElement => {
      const originalHoverArea = isMobile && el.mobileHoverArea ? el.mobileHoverArea : el.hoverArea;
      const originalPosition = el.position;
      return {
        // Explicitly list all properties from SubElementData
        id: el.id,
        name: el.name,
        coloredImage: el.coloredImage,
        popupImages: el.popupImages,
        position: el.position,
        hoverArea: el.hoverArea,
        mobileHoverArea: el.mobileHoverArea,
        isDiscovered: el.isDiscovered,

        // Add the new calculated properties
        calculatedHoverArea: {
          position: 'absolute',
          top: `${(parseFloat(originalHoverArea.top) / 100) * renderedImageHeight + offsetY}px`,
          left: `${(parseFloat(originalHoverArea.left) / 100) * renderedImageWidth + offsetX}px`,
          width: `${(parseFloat(originalHoverArea.width) / 100) * renderedImageWidth}px`,
          height: `${(parseFloat(originalHoverArea.height) / 100) * renderedImageHeight}px`,
        },
        calculatedPosition: {
          position: 'absolute',
          top: `${(parseFloat(originalPosition.top) / 100) * renderedImageHeight + offsetY}px`,
          left: `${(parseFloat(originalPosition.left) / 100) * renderedImageWidth + offsetX}px`,
          width: `${(parseFloat(originalPosition.width) / 100) * renderedImageWidth}px`,
          height: `${(parseFloat(originalPosition.height) / 100) * renderedImageHeight}px`,
        }
      };
    });
    // --- MODIFICATION END ---
    
    setCalculatedSubElements(newCalculatedElements);
  };

  useEffect(() => {
    const img = imageRef.current;
    const handleLoad = () => calculatePositions();

    if (img) {
        img.addEventListener('load', handleLoad);
        window.addEventListener('resize', calculatePositions);
        if (img.complete) handleLoad();
    }
    
    return () => {
        if (img) img.removeEventListener('load', handleLoad);
        window.removeEventListener('resize', calculatePositions);
    };
  }, [subElements, isMobile]);

  const handleSubElementHover = (subElementId: number | null) => {
      setHoveredSubElementId(subElementId);
  };
  
  const handleSubElementClick = (subElement: SubElementData) => {
    setClickedSubElementIds(prev => new Set(prev).add(subElement.id));
    setSelectedSubElement(subElement);
  };

  const debugColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
  const discoveredCount = clickedSubElementIds.size;
  const totalCount = subElements.length;

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Explore the Bycatch Pile!</h3>
      <p className="text-center text-gray-600 mb-4">Hover to discover, then click to learn more.</p>
      <div className="max-w-3xl mx-auto mb-4">
        <div className="flex justify-between items-center mb-1 text-sm"><span className="font-semibold text-gray-700">Species Found</span><span>{discoveredCount} / {totalCount}</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2.5 rounded-full" style={{ width: `${(discoveredCount / totalCount) * 100}%` }}/></div>
      </div>
      <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-inner bg-gray-200">
        <img ref={imageRef} src={backgroundImage} alt={element.name} className="w-full h-auto object-contain" />
        {calculatedSubElements.map((subEl) => {
          const isVisible = clickedSubElementIds.has(subEl.id) || hoveredSubElementId === subEl.id;
          if (!isVisible) return null;
          return ( <img key={`color-${subEl.id}`} src={subEl.coloredImage} alt="" className="absolute pointer-events-none z-10" style={subEl.calculatedPosition}/> );
        })}
        {calculatedSubElements.map(subEl => (
            <div key={subEl.id} className="absolute cursor-pointer z-20" style={subEl.calculatedHoverArea} onMouseEnter={() => handleSubElementHover(subEl.id)} onMouseLeave={() => handleSubElementHover(null)} onClick={() => handleSubElementClick(subEl)} />
        ))}
        {devMode && calculatedSubElements.map((subEl, index) => (
            <div key={`dev-${subEl.id}`} className="absolute pointer-events-none border-2 border-dashed z-30" style={{ ...subEl.calculatedHoverArea, backgroundColor: debugColors[index % debugColors.length]}}>
              <span className="bg-black text-white text-xs p-1 rounded opacity-75">{subEl.name}</span>
            </div>
        ))}
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

const InfoPopup: React.FC<{ element: InteractiveElementData; onClose: () => void; onElementDiscovered: (elementId: number) => void; }> = ({ element, onClose, onElementDiscovered }) => {
  const isMiniGame = element.subElements && element.subElements.length > 0;
  const isMobile = useIsMobile();
  const imageUrl = element.popupImages ? (isMobile ? element.popupImages.mobile : element.popupImages.desktop) : null;

  useEffect(() => {
    if (!isMiniGame) {
      onElementDiscovered(element.id);
    }
  }, [element.id, isMiniGame, onElementDiscovered]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 md:p-6 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md-right-4 text-white hover:text-gray-200"><X size={24} /></button>
          <div className="flex items-center space-x-3"><Sparkles className="text-yellow-300" size={28} /><h2 className="text-xl md:text-2xl font-bold">{element.name} Discovered!</h2></div>
        </div>
        <div className="overflow-y-auto flex-grow flex flex-col">
            {isMiniGame ? ( <BycatchMiniGame element={element} onElementDiscovered={onElementDiscovered} /> ) : ( <div className="flex-grow flex items-center justify-center p-4"> {imageUrl && ( <img src={imageUrl} alt={element.name} className="w-full h-auto object-contain max-h-[calc(90vh-150px)]" /> )} </div> )}
        </div>
        <div className="p-4 md:p-6 pt-0 mt-auto flex justify-center">
            <button onClick={onClose} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg">Continue Exploring</button>
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;