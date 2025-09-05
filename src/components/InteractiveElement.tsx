import React from 'react';
import { InteractiveElementData } from '../types/gameTypes';

interface InteractiveElementProps {
  element: InteractiveElementData;
  calculatedHoverArea: React.CSSProperties;
  calculatedPosition: React.CSSProperties;
  onHover: (elementId: number | null) => void;
  onClick: (element: InteractiveElementData) => void; 
  isVisuallyHovered: boolean;
  isDiscovered: boolean;
  isLocked?: boolean;
}

const InteractiveElement: React.FC<InteractiveElementProps> = ({ 
    element, 
    calculatedHoverArea,
    calculatedPosition,
    onHover, 
    onClick, 
    isLocked, 
    isVisuallyHovered,
    isDiscovered 
}) => {
  
  const cursorStyle = isLocked ? 'cursor-not-allowed' : 'cursor-pointer';
  const showColoredImage = isDiscovered || isVisuallyHovered;

  return (
    <>
      <div
        className={`absolute z-20 ${cursorStyle}`}
        style={calculatedHoverArea}
        onMouseEnter={() => !isLocked && onHover(element.id)}
        onMouseLeave={() => !isLocked && onHover(null)}
        onClick={() => !isLocked && onClick(element)}
        aria-label={`Discover ${element.name}`}
      />

      {showColoredImage && (
        <img
          src={element.coloredImage}
          alt={element.name}
          className={`absolute pointer-events-none transition-opacity duration-300 z-20 object-contain ${isLocked ? 'opacity-50' : 'opacity-90'}`}
          style={calculatedPosition}
          onError={(e) => {
            // Hide the image if it fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
    </>
  );
};

export default InteractiveElement;