import React, { useState, useEffect, useRef } from 'react';
import InteractiveElement from './InteractiveElement.tsx';
import InfoPopup from './InfoPopup.tsx';
import TruckDestinationModal from './TruckDestinationModal.tsx';
import { SceneData, InteractiveElementData } from '../types/gameTypes';
import { Eye, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

interface GameSceneProps {
  sceneData: SceneData;
  sceneNumber: number;
  onElementDiscovered: (elementId: number) => void;
  allElementsDiscovered: boolean;
  getIsElementDiscovered: (elementId: number) => boolean;
  onNavigate: (scene: number) => void;
  handleLeftArrow: () => void;
  handleRightArrow: () => void;
}

type CalculatedElement = InteractiveElementData & { calculatedHoverArea: React.CSSProperties; calculatedPosition: React.CSSProperties; };

const GameScene: React.FC<GameSceneProps> = ({ sceneData, sceneNumber, onElementDiscovered, allElementsDiscovered, getIsElementDiscovered, onNavigate, handleLeftArrow, handleRightArrow }) => {
  const [selectedElement, setSelectedElement] = useState<InteractiveElementData | null>(null);
  const [showTruckDestinationModal, setShowTruckDestinationModal] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [hoveredElementId, setHoveredElementId] = useState<number | null>(null);
  const [calculatedElements, setCalculatedElements] = useState<CalculatedElement[]>([]);
  const isMobile = useIsMobile();
  const imageRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    setHoveredElementId(null);
    const img = imageRef.current;
    if (img && img.complete) {
        calculatePositions();
    }
  }, [sceneData]);

  useEffect(() => {
    if (allElementsDiscovered) {
        const timer = setTimeout(() => {
            setShowCompletionMessage(true);
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [allElementsDiscovered]);

  const calculatePositions = () => {
    if (!imageRef.current) return;

    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current;
    
    if (naturalWidth === 0 || naturalHeight === 0) {
        return;
    }

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
    const newCalculatedElements: CalculatedElement[] = sceneData.elements.map((el): CalculatedElement => {
      const originalHoverArea = isMobile && el.mobileHoverArea ? el.mobileHoverArea : el.hoverArea;
      const originalPosition = el.position;

      return {
        // Explicitly list all properties from InteractiveElementData
        id: el.id,
        name: el.name,
        coloredImage: el.coloredImage,
        popupImages: el.popupImages,
        position: el.position,
        hoverArea: el.hoverArea,
        mobileHoverArea: el.mobileHoverArea,
        isDiscovered: el.isDiscovered,
        subElements: el.subElements,
        isTruck: el.isTruck,

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

    setCalculatedElements(newCalculatedElements);
  };

  useEffect(() => {
    const img = imageRef.current;
    const handleLoad = () => calculatePositions();
    if (img) {
        img.addEventListener('load', handleLoad);
        window.addEventListener('resize', calculatePositions);
        if (img.complete) {
            handleLoad();
        }
    }

    return () => {
        if (img) {
            img.removeEventListener('load', handleLoad);
        }
        window.removeEventListener('resize', calculatePositions);
    };
  }, [sceneData, isMobile]);

  const handleElementHover = (elementId: number | null) => {
    setHoveredElementId(elementId);
  };
  
  const handleElementClick = (element: InteractiveElementData) => {
    if (element.isTruck && allElementsDiscovered) {
        setShowTruckDestinationModal(true);
    } else if (!element.isTruck) {
        setSelectedElement(element);
    }
  };

  const closePopup = () => setSelectedElement(null);
  
  const debugColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(255, 255, 0, 0.5)'];
  
  const sceneTotal = sceneData.elements.filter(el => !el.isTruck).length;
  const sceneDiscovered = sceneData.elements.filter(el => getIsElementDiscovered(el.id) && !el.isTruck).length;

  const LeftArrowContent = () => ( <div className="flex flex-col items-center text-center"> <button onClick={handleLeftArrow} className="bg-white hover:bg-blue-50 text-blue-600 rounded-full p-2 shadow-lg border-2 border-blue-200"> <ChevronLeft size={24} /> </button> </div> );
  const RightArrowContent = () => ( <div className="flex flex-col items-center text-center"> <button onClick={handleRightArrow} className="bg-white hover:bg-blue-50 text-blue-600 rounded-full p-2 shadow-lg border-2 border-blue-200"> <ChevronRight size={24} /> </button> </div> );

  return (
    <div className="relative w-full">
      {isMobile && (sceneNumber === 1 || sceneNumber === 2) && ( <div className="flex justify-center mb-2"> <LeftArrowContent /> </div> )}
      <div className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <img ref={imageRef} src={sceneData.backgroundImage} alt={sceneData.title} className="relative z-10 w-full h-auto max-h-[70vh] object-contain" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-200 -z-10"/>
        {calculatedElements.map((element) => (
          <InteractiveElement 
            key={element.id} 
            element={element} 
            calculatedHoverArea={element.calculatedHoverArea}
            calculatedPosition={element.calculatedPosition}
            onHover={handleElementHover} 
            onClick={handleElementClick}
            isVisuallyHovered={hoveredElementId === element.id}
            isDiscovered={getIsElementDiscovered(element.id)}
            isLocked={!!(element.isTruck && !allElementsDiscovered)}
          />
        ))}
        {devMode && calculatedElements.map((element, index) => (
            <div key={`dev-${element.id}`} className="absolute pointer-events-none border-2 border-dashed" style={{...element.calculatedHoverArea, backgroundColor: debugColors[index % debugColors.length], zIndex: 999}}>
                <span className="bg-black text-white text-xs p-1 rounded opacity-75">{element.name}</span>
            </div>
        ))}
      </div>
      {isMobile && (sceneNumber === 1 || sceneNumber === 3) && ( <div className="flex justify-center mt-2"> <RightArrowContent /> </div> )}
      <div className="mt-4 bg-white rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Discovery Progress</span>
              <span className="text-sm text-blue-600">{sceneDiscovered} / {sceneTotal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full" style={{ width: `${(sceneDiscovered / sceneTotal) * 100}%` }}/>
          </div>
          <button onClick={() => setDevMode(!devMode)} className="w-full flex items-center justify-center space-x-2 text-sm bg-gray-700 text-white px-4 py-2 rounded-lg">
              <Eye size={16} /><span>{devMode ? 'Hide' : 'Show'} Main Hover Areas</span>
          </button>
      </div>
      {showCompletionMessage && ( <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-40 text-white text-center p-8 rounded-2xl animate-in fade-in duration-500"> <CheckCircle className="text-green-400 w-16 h-16 mb-4" /> <h2 className="text-3xl font-bold mb-2">Congratulations!</h2> <p className="max-w-md text-lg">You've discovered all the interactive elements. Find the truck in the Fish Market to continue the journey!</p> <button onClick={() => setShowCompletionMessage(false)} className="mt-6 bg-white/20 hover:bg-white/30 px-8 py-2 rounded-full font-semibold transition-colors" > Continue Exploring </button> </div> )}
      {selectedElement && ( <InfoPopup element={selectedElement} onClose={closePopup} onElementDiscovered={onElementDiscovered}/>)}
      {showTruckDestinationModal && ( <TruckDestinationModal onClose={() => setShowTruckDestinationModal(false)} onNavigate={onNavigate}/>)}
    </div>
  );
};

export default GameScene;