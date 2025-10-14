import { useState } from 'react';
import { HStack, Input, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <HStack w="50%">
            <Input
                placeholder="예: 감동적인 가족 영화 추천해줘"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleSearch}>
                검색
            </Button>
        </HStack>
    );
}

export default SearchBar;
