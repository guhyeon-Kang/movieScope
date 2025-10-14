import { Flex, Box, Button, Heading, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <Flex bg="white" px={8} py={4} align="center" shadow="sm">
            <Heading size="md" as={Link} to="/">
                MovieScope 🎬
            </Heading>
            <Spacer />
            <Box>
                <Button as={Link} to="/search" colorScheme="blue" variant="ghost" mr={2}>
                    검색
                </Button>
                {isLoggedIn ? (
                    <>
                        <Button as={Link} to="/admin" colorScheme="purple" variant="ghost" mr={2}>
                            관리자
                        </Button>
                        <Button as={Link} to="/profile" colorScheme="teal" variant="ghost" mr={2}>
                            내정보
                        </Button>
                        <Button onClick={handleLogout} colorScheme="red" variant="solid">
                            로그아웃
                        </Button>
                    </>
                ) : (
                    <>
                        <Button as={Link} to="/login" colorScheme="blue" variant="ghost" mr={2}>
                            로그인
                        </Button>
                        <Button as={Link} to="/signup" colorScheme="green" variant="solid">
                            회원가입
                        </Button>
                    </>
                )}
            </Box>
        </Flex>
    );
}

export default Navbar;
