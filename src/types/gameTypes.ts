export interface HoverArea {
  top: string;
  left: string;
  width: string;
  height: string;
}

// SubElementData is now much richer to support its own interactions
export interface SubElementData {
  id: number;
  name: string;
  coloredImage: string; // The full-size overlay for the colored species
  popupImages: {       // The info-card image for the species' own popup
    desktop: string;
    mobile: string;
  };
  position: HoverArea;      // Position for the colored overlay
  hoverArea: HoverArea;
  mobileHoverArea?: HoverArea;
  isDiscovered: boolean;
}

export interface InteractiveElementData {
  id: number;
  name: string;
  coloredImage: string;
 
  popupImages?: {
    desktop: string;
    mobile: string;
  };
  position: HoverArea;
  hoverArea: HoverArea;
  mobileHoverArea?: HoverArea;
  isDiscovered: boolean;
  subElements?: SubElementData[];
  isTruck?: boolean;
}

export interface SceneData {
  title: string;
  description: string;
  backgroundImage: string;
  elements: InteractiveElementData[];
}

