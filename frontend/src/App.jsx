import { ChakraProvider, Container, Heading, Text } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <Container centerContent py={10}>
                <Heading>🎬 MovieScope</Heading>
                <Text mt={4}>AI 기반 영화 추천 시스템</Text>
            </Container>
        </ChakraProvider>
    );
}

export default App;
