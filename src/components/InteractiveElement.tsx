import React from 'react';
import { InteractiveElementData } from '../types/gameTypes';

interface InteractiveElementProps {
  element: InteractiveElementData;
  onHover: (element: InteractiveElementData) => void;
  onClick: (element: InteractiveElementData) => void; 
  isLocked?: boolean;
  isMobile: boolean; // New prop to determine screen size
}

const InteractiveElement: React.FC<InteractiveElementProps> = ({ element, onHover, onClick, isLocked, isMobile }) => {
  
  // Conditionally choose the correct hover area
  const currentHoverArea = isMobile && element.mobileHoverArea ? element.mobileHoverArea : element.hoverArea;
  const cursorStyle = isLocked ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <>
      <div
        className={`absolute z-20 ${cursorStyle}`}
        style={currentHoverArea} // Use the selected hover area
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

