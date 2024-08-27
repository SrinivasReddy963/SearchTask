import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { saveSearch, getSearches } from '../utils/indexedDB';
import wilyalogo from './wilyalogo.png';
import SearchIcon from '@mui/icons-material/Search';

const countriesAndStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',

  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',

  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',

  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',

  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',

  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',

  'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'

];

const validateInput = (input: string): string => {
  return input.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
};

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ name: string; count: number }[]>([]);

  const fetchSuggestions = useCallback(debounce((value: string) => {
    if (value) {
      const filtered = countriesAndStates.filter(item =>
        item.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, 300), []);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    (async () => {
      const searches = await getSearches();
      setSelected(searches);
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validInput = validateInput(e.target.value);
    setQuery(validInput);
  };

  const handleSelect = async (name: string) => {
    await saveSearch(name);
    const searches = await getSearches();
    setSelected(searches);
    setQuery('');
  };

  return (
    <div className="search-container">
      <img src={wilyalogo} alt="Wilya Logo" className="logo" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}

        placeholder="Search Countries and States of USA"
        className="search-input"
        onKeyDown={(e) => {
          if (e.key === 'Tab' && suggestions.length > 0) {
            e.preventDefault();
            setQuery(suggestions[0]);
          }
        }}
      />
      <SearchIcon
        style={{
          position: 'absolute',
          top: '36%',
          left: '70%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
      <div className="selected-list">
        <h3>Search History</h3>
        <table>
          <thead>
            <tr>
              <th>Country/State</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {selected.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.count} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Search;
