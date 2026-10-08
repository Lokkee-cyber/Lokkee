import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputAdornment, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function SearchBar({ compact = false, value = '', onChange, placeholder = 'Search AI tools, articles...' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalQuery = (onChange ? value : query).trim();
    if (!finalQuery) {
      navigate('/search?q=');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth={!compact}
        value={onChange ? value : query}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value);
          } else {
            setQuery(event.target.value);
          }
        }}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" />
            </InputAdornment>
          ),
        }}
        aria-label="Search ToolPilot AI"
        size={compact ? 'small' : 'medium'}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            backgroundColor: 'background.paper',
          },
        }}
      />
    </form>
  );
}
