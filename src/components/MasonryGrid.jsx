import React from "react";

const MasonryGrid = ({ items, onImageClick }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 w-full h-full p-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg relative group cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => onImageClick && onImageClick(item)}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full object-cover rounded-xl"
            loading="lazy"
          />
          {/* Dark overlay for text on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <h3 className="text-white text-sm font-semibold tracking-wide drop-shadow-md">
              {item.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
