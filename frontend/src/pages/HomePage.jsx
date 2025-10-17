import { VStack, Text } from '@chakra-ui/react';
import SearchBar from '../components/Searchbar';

function HomePage() {
    return (
        <VStack spacing={8} py={20}>
            <Text fontSize="3xl" fontWeight="bold">
                🎥 MovieScope
            </Text>
            <Text color="gray.600">보고싶은 영화를 검색해보세요!</Text>
            <SearchBar />
        </VStack>
    );
}

export default HomePage;
