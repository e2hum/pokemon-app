import React, { useState, useRef } from 'react';

interface DropdownItems {
    id: string;
    filterName: string;
    items: string[];
    onSelect: (id: string, item: string) => void;
};

export default function Dropdown({ id, filterName, items, onSelect }: DropdownItems) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filteredItems, setFilteredItems] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (item: string) => {
        onSelect(id, item)
        setInputValue(item);
        setIsOpen(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        setFilteredItems(items.filter(item => item.toLowerCase().includes(value.toLowerCase())));
        setIsOpen(true);
    }

    const handleInputFocus = () => {
        setIsOpen(true); // Open dropdown on focus
        setFilteredItems(items); // Reset filtered items to show all when focusing
      };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // Timeout to allow for click event to register before closing
        setTimeout(() => {
          if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
            setIsOpen(false);
          }
        }, 100);
      };

    const buttonStyle = {
        width: '150px',
        height: '40px',
        fontSize: '16px',
      };

    return (
        <div ref = {dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleBlur}
        style={buttonStyle}
        placeholder={`Select ${filterName}`}
        />

      {isOpen && filteredItems.length > 0 && (
        <ul style={{ 
            border: '1px solid #ccc', 
            position: 'absolute', 
            backgroundColor: 'grey', 
            padding: '0', 
            margin: '0', 
            listStyle: 'none',
            width: buttonStyle.width
            }}>
          {filteredItems.map((item) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              style={{ 
                padding: '8px', 
                cursor: 'pointer', 
                width: buttonStyle.width, // Match the width of the button
                height: buttonStyle.height, // Match the height of the button
                display: 'flex', // Use flexbox for centering text
                alignItems: 'center', // Center vertically
                justifyContent: 'center', // Center horizontally
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
    );
};