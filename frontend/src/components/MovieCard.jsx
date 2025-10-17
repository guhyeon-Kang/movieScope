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
            {movie.poster && movie.poster.trim() !== '' ? (
                <Image
                    src={movie.poster.replace(/^http:\/\//, 'https://')} // 🔹 HTTP → HTTPS 변환
                    alt={movie.title}
                    objectFit="cover"
                    w="100%"
                    h="320px"
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
                w="100%"
                h="320px"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                align="center"
                justify="center"
                flexDirection="column"
                color="white"
                position="relative"
                overflow="hidden"
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
                <Text fontSize="6xl" mb={3} opacity="0.8">🎬</Text>
                <Text 
                    fontSize="sm" 
                    fontWeight="bold" 
                    textAlign="center" 
                    px={4}
                    noOfLines={2}
                    lineHeight="1.2"
                >
                    {movie.title}
                </Text>
                <Text fontSize="xs" opacity="0.7" mt={2}>
                    포스터 이미지 없음
                </Text>
            </Box>

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
