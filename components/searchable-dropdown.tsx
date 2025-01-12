import { useEffect, useRef, useState } from "react";


const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    label,
    id,
    selectedVal,
    isRequired,
    handleChange
}) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const selectOption = (option: Option) => {
        setQuery("");
        handleChange(option[label]);
        setIsOpen(false);
    };

    const toggle = (e: React.MouseEvent<HTMLInputElement>) => {
        setIsOpen(e.target === inputRef.current);
    };

    const getDisplayValue = () => {
        if (query) return query;
        if (selectedVal) return selectedVal;
        return "";
    };

    const filter = (options: Option[]) => {
        return options.filter(
            (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
        );
    };

    return (
        <div className="dropdown">
            <div className="control">
                <div className="selected-value">
                    <input
                        required={isRequired}
                        ref={inputRef}
                        type="text"
                        value={getDisplayValue()}
                        name="searchTerm"
                        placeholder="Search Country..."
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleChange(null);
                        }}
                        onClick={toggle}
                    />
                </div>
                <div className={`arrow ${isOpen ? "open" : ""}`}></div>
            </div>

            <div className={`options ${isOpen ? "open" : ""}`}>
                {filter(options).map((option, index) => {
                    return (
                        <div
                            onClick={() => selectOption(option)}
                            className={`option ${
                                option[label] === selectedVal ? "selected" : ""
                            }`}
                            key={`${id}-${index}`}
                        >
                            {option[label]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchableDropdown;
