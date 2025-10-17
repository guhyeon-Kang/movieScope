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
            {/* 포스터 이미지 또는 대체 이미지 */}
            {movie.poster && movie.poster.trim() !== '' ? (
                <Image 
                    src={movie.poster.replace(/^http:\/\//, 'https://')} 
                    alt={movie.title} 
                    h="400px" 
                    objectFit="cover"
                    borderRadius="lg"
                    boxShadow="lg"
                    onError={(e) => {
                        // 이미지 로드 실패 시 대체 컴포넌트로 교체
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                    }}
                />
            ) : null}
            
            {/* 대체 이미지 컴포넌트 */}
            <Box
                display={movie.poster && movie.poster.trim() !== '' ? 'none' : 'flex'}
                w="300px"
                h="400px"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                align="center"
                justify="center"
                flexDirection="column"
                color="white"
                position="relative"
                overflow="hidden"
                borderRadius="lg"
                boxShadow="lg"
            >
                {/* 배경 패턴 */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    opacity="0.1"
                    backgroundImage="url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"2\" fill=\"white\"/></svg>')"
                    backgroundSize="20px 20px"
                />
                
                {/* 메인 콘텐츠 */}
                <Text fontSize="8xl" mb={4} opacity="0.8">🎬</Text>
                <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    textAlign="center" 
                    px={4}
                    noOfLines={3}
                    lineHeight="1.2"
                >
                    {movie.title}
                </Text>
                <Text fontSize="sm" opacity="0.7" mt={3}>
                    포스터 이미지 없음
                </Text>
            </Box>
            
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
