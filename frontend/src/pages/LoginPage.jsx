import { useState } from 'react';
import { VStack, Input, Button, Text, useToast, InputGroup, InputRightElement, IconButton, FormControl, FormLabel, FormErrorMessage, Box } from '@chakra-ui/react';
// 아이콘 대신 텍스트 사용
import { userApi } from '../api/userApi.js';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async () => {
        // 기본 유효성 검사
        let hasError = false;
        
        if (!email) {
            setEmailError('이메일을 입력해주세요.');
            hasError = true;
        } else {
            setEmailError('');
        }
        
        if (!password) {
            setPasswordError('비밀번호를 입력해주세요.');
            hasError = true;
        } else {
            setPasswordError('');
        }

        if (hasError) {
            toast({
                title: '입력 오류',
                description: '이메일과 비밀번호를 모두 입력해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const data = await userApi.login(email, password);
            localStorage.setItem('token', data.token);
            
            // localStorage 변경을 알리는 커스텀 이벤트 발생
            window.dispatchEvent(new Event('localStorageChange'));
            
            toast({
                title: '로그인 성공',
                description: '환영합니다!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.error || '로그인에 실패했습니다.';
            
            // 로그인 실패 시 에러 표시
            if (errorMessage.includes('잘못되었습니다')) {
                setPasswordError('이메일 또는 비밀번호가 잘못되었습니다.');
            }
            
            toast({
                title: '로그인 실패',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack spacing={6} py={20} maxW="400px" mx="auto">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                로그인
            </Text>
            
            <FormControl isInvalid={!!emailError}>
                <FormLabel>이메일</FormLabel>
                <Input 
                    type="email"
                    placeholder="example@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    focusBorderColor="blue.400"
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!passwordError}>
                <FormLabel>비밀번호</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        focusBorderColor="blue.400"
                    />
                    <InputRightElement>
                        <IconButton
                            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{passwordError}</FormErrorMessage>
            </FormControl>

            <Box w="100%">
                <Button 
                    colorScheme="blue" 
                    size="lg"
                    width="100%"
                    onClick={handleLogin}
                    isLoading={loading}
                    loadingText="로그인 중..."
                    isDisabled={!email || !password}
                >
                    로그인
                </Button>
            </Box>

            <Text fontSize="sm" color="gray.600" textAlign="center">
                계정이 없으신가요?{' '}
                <Button 
                    variant="link" 
                    colorScheme="blue" 
                    size="sm"
                    onClick={() => navigate('/signup')}
                >
                    회원가입
                </Button>
            </Text>
        </VStack>
    );
}

export default LoginPage;
