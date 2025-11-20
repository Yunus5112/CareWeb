/**
 * ElementFactory Service
 * Handles element creation with proper type safety
 * Factory Pattern implementation
 */

import type {
  Element,
  Position,
  HeaderContent,
  FooterContent,
  CardContent,
  SliderContent,
  ContainerContent,
} from '../types';
import { ElementType } from '../types';
import { generateElementId } from '../utils';
import { ELEMENT_DEFAULTS } from '../constants';

/**
 * Element content type map for type safety
 */
type ElementContentMap = {
  [ElementType.HEADER]: HeaderContent;
  [ElementType.FOOTER]: FooterContent;
  [ElementType.CARD]: CardContent;
  [ElementType.TEXT_CONTENT]: {
    html: string;
    plainText: string;
    fontSize?: number;
    color?: string;
    alignment?: string;
  };
  [ElementType.SLIDER]: SliderContent;
  [ElementType.CONTAINER]: ContainerContent;
  [ElementType.GRID_CONTAINER]: ContainerContent;
};

/**
 * Create element position based on type
 */
const createElementPosition = (
  type: ElementType,
  customPosition?: { x: number; y: number }
): Position => {
  
  switch (type) {
    case ElementType.HEADER:
      return {
        x: ELEMENT_DEFAULTS.HEADER.POSITION_X,
        y: ELEMENT_DEFAULTS.HEADER.POSITION_Y,
        width: ELEMENT_DEFAULTS.HEADER.WIDTH,
        height: ELEMENT_DEFAULTS.HEADER.HEIGHT,
        zIndex: ELEMENT_DEFAULTS.HEADER.Z_INDEX,
        fixed: true,
      };
      
    case ElementType.FOOTER:
      return {
        x: ELEMENT_DEFAULTS.FOOTER.POSITION_X,
        y: ELEMENT_DEFAULTS.FOOTER.POSITION_Y,
        width: ELEMENT_DEFAULTS.FOOTER.WIDTH,
        height: ELEMENT_DEFAULTS.FOOTER.HEIGHT,
        zIndex: ELEMENT_DEFAULTS.FOOTER.Z_INDEX,
        fixed: true,
      };
      
    case ElementType.CARD:
      return {
        x: customPosition?.x ?? ELEMENT_DEFAULTS.CARD.POSITION_X,
        y: customPosition?.y ?? ELEMENT_DEFAULTS.CARD.POSITION_Y,
        width: ELEMENT_DEFAULTS.CARD.WIDTH,
        height: ELEMENT_DEFAULTS.CARD.HEIGHT,
        zIndex: ELEMENT_DEFAULTS.CARD.Z_INDEX,
      };
      
    case ElementType.TEXT_CONTENT:
      return {
        x: customPosition?.x ?? ELEMENT_DEFAULTS.TEXT_CONTENT.POSITION_X,
        y: customPosition?.y ?? ELEMENT_DEFAULTS.TEXT_CONTENT.POSITION_Y,
        width: ELEMENT_DEFAULTS.TEXT_CONTENT.WIDTH,
        height: ELEMENT_DEFAULTS.TEXT_CONTENT.HEIGHT,
        minHeight: ELEMENT_DEFAULTS.TEXT_CONTENT.MIN_HEIGHT,
        zIndex: ELEMENT_DEFAULTS.TEXT_CONTENT.Z_INDEX,
      };
      
    case ElementType.SLIDER:
      return {
        x: customPosition?.x ?? ELEMENT_DEFAULTS.SLIDER.POSITION_X,
        y: customPosition?.y ?? ELEMENT_DEFAULTS.SLIDER.POSITION_Y,
        width: ELEMENT_DEFAULTS.SLIDER.WIDTH,
        height: ELEMENT_DEFAULTS.SLIDER.HEIGHT,
        zIndex: ELEMENT_DEFAULTS.SLIDER.Z_INDEX,
      };
      
    case ElementType.CONTAINER:
    case ElementType.GRID_CONTAINER:
      return {
        x: customPosition?.x ?? ELEMENT_DEFAULTS.CONTAINER.POSITION_X,
        y: customPosition?.y ?? ELEMENT_DEFAULTS.CONTAINER.POSITION_Y,
        width: ELEMENT_DEFAULTS.CONTAINER.WIDTH,
        height: ELEMENT_DEFAULTS.CONTAINER.HEIGHT,
        zIndex: ELEMENT_DEFAULTS.CONTAINER.Z_INDEX,
      };
      
    default:
      return {
        x: customPosition?.x ?? 50,
        y: customPosition?.y ?? 100,
        width: 300,
        height: 200,
        zIndex: 1,
      };
  }
};

/**
 * Create default content for element type
 */
const createDefaultContent = <T extends ElementType>(type: T): any => {
  switch (type) {
    case ElementType.HEADER:
      return {
        text: 'Site Header',
        style: 'default',
        navigation: [
          { label: 'Home', href: '#' },
          { label: 'About Us', href: '#' },
          { label: 'Contact', href: '#' },
        ],
      };
      
    case ElementType.FOOTER:
      return {
        copyright: '© 2024 Test Builder',
        links: [],
      };
      
    case ElementType.CARD:
      return {
        title: 'Card Title',
        description: 'Card description goes here...',
        image: null,
      };
      
    case ElementType.TEXT_CONTENT:
      return {
        html: '<p>Your content here...</p>',
        plainText: 'Your content here...',
        fontSize: ELEMENT_DEFAULTS.TEXT_CONTENT.FONT_SIZE,
        color: '#000000',
        alignment: 'left',
      };
      
    case ElementType.SLIDER:
      return {
        slides: [
          { id: 'slide-1', image: '', caption: 'Slide 1' },
          { id: 'slide-2', image: '', caption: 'Slide 2' },
        ],
        autoPlay: ELEMENT_DEFAULTS.SLIDER.AUTO_PLAY,
        interval: ELEMENT_DEFAULTS.SLIDER.INTERVAL,
        showIndicators: true,
        showNavigation: true,
      };
      
    case ElementType.CONTAINER:
    case ElementType.GRID_CONTAINER:
      return {
        columns: ELEMENT_DEFAULTS.CONTAINER.COLUMNS,
        gap: ELEMENT_DEFAULTS.CONTAINER.GAP,
        backgroundColor: 'transparent',
        padding: ELEMENT_DEFAULTS.CONTAINER.PADDING,
      };
      
    default:
      return {};
  }
};

/**
 * Element Factory - Create type-safe elements
 */
export class ElementFactory {
  /**
   * Create a new element with proper type safety
   */
  static createElement<T extends ElementType>(
    type: T,
    customPosition?: { x: number; y: number }
  ): Element {
    const now = new Date().toISOString();
    const id = generateElementId(type);
    const position = createElementPosition(type, customPosition);
    const content = createDefaultContent(type);
    
    // Type-safe element creation
    const element = {
      id,
      type,
      content,
      position,
      createdAt: now,
      updatedAt: now,
    } as Element;
    
    return element;
  }
  
  /**
   * Validate element structure
   */
  static validateElement(element: Element): boolean {
    return !!(
      element.id &&
      element.type &&
      element.content &&
      element.position &&
      element.createdAt &&
      element.updatedAt
    );
  }
  
  /**
   * Clone an element with a new ID
   */
  static cloneElement(element: Element): Element {
    const now = new Date().toISOString();
    
    return {
      ...element,
      id: generateElementId(element.type),
      createdAt: now,
      updatedAt: now,
    };
  }
}

