// Element Types
export const enum ElementType {
  HEADER = 'header',
  FOOTER = 'footer',
  CARD = 'card',
  TEXT_CONTENT = 'text-content',
  SLIDER = 'slider',
  CONTAINER = 'container',
  GRID_CONTAINER = 'grid-container'
}

// Position Interface
export interface Position {
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  zIndex: number;
  fixed?: boolean;
  minHeight?: number;
}

// Responsive Configuration
export interface ResponsiveConfig {
  mobile?: Partial<Position>;
  tablet?: Partial<Position>;
  desktop?: Partial<Position>;
}

// Element Content Types
export interface HeaderContent {
  text: string;
  style: string;
  logo?: string;
  navigation?: Array<{
    label: string;
    href: string;
  }>;
}

export interface FooterContent {
  copyright: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export interface CardContent {
  title: string;
  description: string;
  image: string | null;
  icon?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface TextContent {
  html: string;
  plainText: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

export interface SliderContent {
  slides: Array<{
    id: string;
    image: string;
    caption?: string;
    title?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showNavigation?: boolean;
}

export interface ContainerContent {
  columns: number;
  gap?: number;
  backgroundColor?: string;
  padding?: number;
}

// Element Base Interface
export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  responsive?: ResponsiveConfig;
  createdAt: string;
  updatedAt: string;
}

// Specific Element Types
export interface HeaderElement extends BaseElement {
  type: ElementType.HEADER;
  content: HeaderContent;
}

export interface FooterElement extends BaseElement {
  type: ElementType.FOOTER;
  content: FooterContent;
}

export interface CardElement extends BaseElement {
  type: ElementType.CARD;
  content: CardContent;
}

export interface TextContentElement extends BaseElement {
  type: ElementType.TEXT_CONTENT;
  content: TextContent;
}

export interface SliderElement extends BaseElement {
  type: ElementType.SLIDER;
  content: SliderContent;
}

export interface ContainerElement extends BaseElement {
  type: ElementType.CONTAINER;
  content: ContainerContent;
  children?: string[]; // IDs of child elements
}

// Union Type for all elements
export type Element =
  | HeaderElement
  | FooterElement
  | CardElement
  | TextContentElement
  | SliderElement
  | ContainerElement;

// Element Creation Data (for sidebar)
export interface ElementTemplate {
  type: ElementType;
  label: string;
  icon: string;
  description: string;
  defaultContent: any;
  defaultPosition: Position;
}

