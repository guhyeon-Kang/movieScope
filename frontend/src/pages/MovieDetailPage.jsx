import { useParams } from 'react-router-dom';
import { VStack, Image, Text, Box, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { movieApi } from '../api/movieApi.js';

function MovieDetailPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        if (!id) return;
        
        setLoading(true);
        movieApi.getMovieById(id)
            .then((data) => setMovie(data))
            .catch((error) => {
                console.error('❌ 영화 정보 조회 실패:', error);
                toast({
                    title: '영화 정보 조회 실패',
                    description: '영화 정보를 불러오는 중 오류가 발생했습니다.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .finally(() => setLoading(false));
    }, [id, toast]);

    if (loading)
        return (
            <VStack py={20}>
                <Spinner size="xl" color="blue.500" />
                <Text>영화 정보를 불러오는 중입니다...</Text>
            </VStack>
        );

    if (!movie)
        return (
            <VStack py={20}>
                <Text>영화 정보를 찾을 수 없습니다.</Text>
            </VStack>
        );

    return (
        <VStack spacing={6} py={10}>
            <Image src={movie.poster || '/no-image.jpg'} alt={movie.title} h="400px" objectFit="cover" />
            <Box maxW="600px" textAlign="left">
                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    {movie.title}
                </Text>
                <Text color="gray.600">장르: {movie.genre}</Text>
                <Text color="gray.600">감독: {movie.director}</Text>
                <Text color="gray.600">배우: {movie.actors}</Text>
                <Text color="gray.600">국가: {movie.nation}</Text>
                <Text mt={4}>{movie.plot}</Text>
            </Box>
        </VStack>
    );
}

export default MovieDetailPage;
