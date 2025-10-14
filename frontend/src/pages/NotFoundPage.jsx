import { VStack, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <VStack py={20} spacing={4}>
            <Text fontSize="3xl" fontWeight="bold">
                404 - 페이지를 찾을 수 없습니다
            </Text>
            <Button as={Link} to="/" colorScheme="blue">
                홈으로 돌아가기
            </Button>
        </VStack>
    );
}

export default NotFoundPage;
