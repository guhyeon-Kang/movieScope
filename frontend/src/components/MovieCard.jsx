import { Box, Image, Text, VStack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
    const navigate = useNavigate();

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="md"
            cursor="pointer"
            _hover={{ transform: 'translateY(-6px)', boxShadow: 'xl' }}
            transition="0.3s"
            onClick={() => navigate(`/movie/${movie.id}`)} // ✅ 클릭 시 이동
        >
            <Image
                src={movie.poster || '/no-poster.png'}
                alt={movie.title}
                objectFit="cover"
                w="100%"
                h="320px"
                fallbackSrc="/no-poster.png"
                onError={(e) => {
                    e.target.src = '/no-poster.png';
                }}
            />

            <VStack align="start" p={4} spacing={1}>
                <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                    {movie.title}
                </Text>
                <Badge colorScheme="purple" fontSize="0.8em">
                    {movie.genre || '장르 미상'}
                </Badge>
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {movie.plot || '줄거리 없음'}
                </Text>
            </VStack>
        </Box>
    );
}
