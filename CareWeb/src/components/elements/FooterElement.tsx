import { FooterElement as FooterElementType } from '../../types';

interface FooterElementProps {
  element: FooterElementType;
}

const FooterElement = ({ element }: FooterElementProps) => {
  return (
    <div className="w-full h-full bg-gray-800 text-gray-300 flex items-center justify-between px-6">
      {/* Copyright */}
      <div className="text-sm">
        {element.content.copyright}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4">
        {element.content.links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-sm hover:text-white transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterElement;

