import { HeaderElement as HeaderElementType } from '../../types';

interface HeaderElementProps {
  element: HeaderElementType;
}

const HeaderElement = ({ element }: HeaderElementProps) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white flex items-center justify-between px-6">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        <span className="font-bold text-lg">{element.content.text}</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        {element.content.navigation?.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="text-sm hover:text-blue-400 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default HeaderElement;

