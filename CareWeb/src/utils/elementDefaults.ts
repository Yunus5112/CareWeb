import { ElementType, ElementTemplate, Position } from '../types';

// Default positions for each element type
export const DEFAULT_POSITIONS: Record<ElementType, Position> = {
  [ElementType.HEADER]: {
    x: 0,
    y: 0,
    width: '100%',
    height: 80,
    zIndex: 100,
    fixed: true
  },
  [ElementType.FOOTER]: {
    x: 0,
    y: 'calc(100% - 60px)',
    width: '100%',
    height: 60,
    zIndex: 100,
    fixed: true
  },
  [ElementType.CARD]: {
    x: 50,
    y: 100,
    width: 300,
    height: 200,
    zIndex: 1
  },
  [ElementType.TEXT_CONTENT]: {
    x: 50,
    y: 100,
    width: 400,
    height: 'auto',
    minHeight: 100,
    zIndex: 1
  },
  [ElementType.SLIDER]: {
    x: 0,
    y: 100,
    width: '100%',
    height: 400,
    zIndex: 1
  },
  [ElementType.CONTAINER]: {
    x: 50,
    y: 100,
    width: 600,
    height: 300,
    zIndex: 1
  },
  [ElementType.GRID_CONTAINER]: {
    x: 50,
    y: 100,
    width: 800,
    height: 400,
    zIndex: 1
  }
};

// Element templates for sidebar
export const ELEMENT_TEMPLATES: ElementTemplate[] = [
  {
    type: ElementType.HEADER,
    label: 'Header',
    icon: '☰',
    description: 'Page header with navigation',
    defaultContent: {
      text: 'Site Header',
      style: 'default',
      navigation: [
        { label: 'Home', href: '#' },
        { label: 'About Us', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.HEADER]
  },
  {
    type: ElementType.FOOTER,
    label: 'Footer',
    icon: '▭',
    description: 'Page footer with copyright',
    defaultContent: {
      copyright: '© 2024 Test Builder',
      links: []
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.FOOTER]
  },
  {
    type: ElementType.CARD,
    label: 'Card',
    icon: '▢',
    description: 'Content card with text & images',
    defaultContent: {
      title: 'Card Title',
      description: 'Card description goes here...',
      image: null
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.CARD]
  },
  {
    type: ElementType.TEXT_CONTENT,
    label: 'Content',
    icon: '📄',
    description: 'Text content area',
    defaultContent: {
      html: '<p>Your content here...</p>',
      plainText: 'Your content here...',
      fontSize: 16,
      color: '#000000',
      alignment: 'left'
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.TEXT_CONTENT]
  },
  {
    type: ElementType.SLIDER,
    label: 'Slider',
    icon: '🖼️',
    description: 'Image slider carousel',
    defaultContent: {
      slides: [
        { id: 'slide-1', image: '', caption: 'Slide 1' },
        { id: 'slide-2', image: '', caption: 'Slide 2' }
      ],
      autoPlay: true,
      interval: 3000,
      showIndicators: true,
      showNavigation: true
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.SLIDER]
  },
  {
    type: ElementType.CONTAINER,
    label: 'Container',
    icon: '▦',
    description: 'Custom row with 1-3 columns',
    defaultContent: {
      columns: 2,
      gap: 20,
      backgroundColor: 'transparent',
      padding: 20
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.CONTAINER]
  },
  {
    type: ElementType.GRID_CONTAINER,
    label: 'Grid Container',
    icon: '▦',
    description: 'Flexible width container (25/50/75/150%)',
    defaultContent: {
      columns: 3,
      gap: 20,
      backgroundColor: 'transparent',
      padding: 20
    },
    defaultPosition: DEFAULT_POSITIONS[ElementType.GRID_CONTAINER]
  }
];

