export interface HoverArea {
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface SubElementData {
  id: number;
  name: string;
  image: string; 
  hoverArea: HoverArea;
  mobileHoverArea?: HoverArea; // Optional: A separate hover area for mobile screens
  isDiscovered: boolean;
}

export interface InteractiveElementData {
  id: number;
  name: string;
  coloredImage: string;
  infoText: string;
  popupImages?: {
    desktop: string;
    mobile: string;
  };
  position: HoverArea;
  hoverArea: HoverArea;
  mobileHoverArea?: HoverArea; // Optional: A separate hover area for mobile screens
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

