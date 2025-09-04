import React from 'react';
import { InteractiveElementData } from '../types/gameTypes';

interface InteractiveElementProps {
  element: InteractiveElementData;
  onHover: (element: InteractiveElementData) => void;
  onClick: (element: InteractiveElementData) => void; 
  isLocked?: boolean;
  isMobile: boolean;
}

const InteractiveElement: React.FC<InteractiveElementProps> = ({ element, onHover, onClick, isLocked, isMobile }) => {
  
  const currentHoverArea = isMobile && element.mobileHoverArea ? element.mobileHoverArea : element.hoverArea;
  const cursorStyle = isLocked ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <>
      <div
        className={`absolute z-20 ${cursorStyle}`}
        style={currentHoverArea}
        onMouseEnter={() => !isLocked && onHover(element)}
        onClick={() => !isLocked && onClick(element)}
        aria-label={`Discover ${element.name}`}
      />

      {element.isDiscovered && (
        <img
          src={element.coloredImage}
          alt={element.name}
          className={`absolute pointer-events-none transition-opacity duration-500 z-20 object-contain ${isLocked ? 'opacity-50' : 'opacity-90'}`}
          style={element.position}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
    </>
  );
};

export default InteractiveElement;

