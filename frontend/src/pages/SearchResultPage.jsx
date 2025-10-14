import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { VStack, Text, SimpleGrid, Spinner, useToast } from '@chakra-ui/react';
import { movieApi } from '../api/movieApi.js';
import MovieCard from '../components/MovieCard.jsx';

function SearchResultPage() {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (!query) return;
        setLoading(true);

        movieApi
            .searchMovies(query)
            .then((data) => {
                setResults(data.results || []);
            })
            .catch((error) => {
                console.error('❌ 검색 실패:', error);
                toast({
                    title: '검색 실패',
                    description: '검색 중 오류가 발생했습니다.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .finally(() => setLoading(false));
    }, [query, toast]);

    if (loading)
        return (
            <VStack py={20}>
                <Spinner size="xl" color="blue.500" />
                <Text>검색 중입니다...</Text>
            </VStack>
        );

    return (
        <VStack spacing={8} py={10}>
            <Text fontSize="2xl" fontWeight="bold">
                🔍 “{query}” 검색 결과
            </Text>

            {results.length === 0 ? (
                <Text color="gray.500">검색 결과가 없습니다.</Text>
            ) : (
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                    {results.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </SimpleGrid>
            )}
        </VStack>
    );
}

export default SearchResultPage;
