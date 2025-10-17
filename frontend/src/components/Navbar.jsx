import { Flex, Box, Button, Heading, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('user');

    // JWT 토큰에서 권한 정보 추출
    const getRoleFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('JWT 토큰 페이로드:', payload);
            console.log('추출된 권한:', payload.role);
            return payload.role || 'user';
        } catch (error) {
            console.error('JWT 토큰 파싱 오류:', error);
            return 'user';
        }
    };

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const loggedIn = !!token;
            setIsLoggedIn(loggedIn);
            
            if (loggedIn) {
                const role = getRoleFromToken(token);
                console.log('설정할 권한:', role);
                setUserRole(role);
            } else {
                setUserRole('user');
            }
        };

        // 초기 로그인 상태 확인
        checkLoginStatus();

        // localStorage 변경 감지 이벤트 리스너 추가
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                checkLoginStatus();
            }
        };

        // 커스텀 이벤트 리스너 (같은 탭에서의 변경 감지)
        const handleCustomStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleCustomStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        // localStorage 변경을 알리는 커스텀 이벤트 발생
        window.dispatchEvent(new Event('localStorageChange'));
        setIsLoggedIn(false);
        setUserRole('user');
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
                        {(() => {
                            console.log('렌더링 시 권한:', userRole);
                            console.log('관리자 버튼 표시 여부:', userRole === 'admin');
                            return userRole === 'admin' && (
                                <Button as={Link} to="/admin" colorScheme="purple" variant="ghost" mr={2}>
                                    관리자
                                </Button>
                            );
                        })()}
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
