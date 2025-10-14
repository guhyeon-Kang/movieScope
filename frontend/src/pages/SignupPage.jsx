import { useState, useEffect } from 'react';
import { VStack, Input, Button, Text, useToast, InputGroup, InputRightElement, IconButton, FormControl, FormLabel, FormErrorMessage, Box } from '@chakra-ui/react';
// 아이콘 대신 텍스트 사용
import { userApi } from '../api/userApi.js';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    // 이메일 유효성 검사
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('이메일을 입력해주세요.');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        setEmailError('');
        return true;
    };

    // 비밀번호 유효성 검사
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('비밀번호를 입력해주세요.');
            return false;
        }
        if (password.length < 6) {
            setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
            return false;
        }
        if (password.length > 50) {
            setPasswordError('비밀번호는 50자 이하여야 합니다.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // 비밀번호 확인 검사
    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) {
            setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
            return false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    // 실시간 유효성 검사
    useEffect(() => {
        if (email) validateEmail(email);
    }, [email]);

    useEffect(() => {
        if (password) validatePassword(password);
    }, [password]);

    useEffect(() => {
        if (confirmPassword) validateConfirmPassword(confirmPassword);
    }, [confirmPassword, password]);

    const handleSignup = async () => {
        // 모든 유효성 검사 실행
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            toast({
                title: '입력 오류',
                description: '모든 필드를 올바르게 입력해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await userApi.signup(email, password);
            
            toast({
                title: '회원가입 완료',
                description: '로그인 페이지로 이동합니다.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.error || '회원가입에 실패했습니다.';
            
            // 중복 이메일 에러 처리
            if (errorMessage.includes('이미 존재하는') || errorMessage.includes('중복')) {
                setEmailError('이미 사용 중인 이메일입니다.');
            }
            
            toast({
                title: '회원가입 실패',
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
                회원가입
            </Text>
            
            <FormControl isInvalid={!!emailError}>
                <FormLabel>이메일</FormLabel>
                <Input 
                    type="email"
                    placeholder="example@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    focusBorderColor="teal.400"
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!passwordError}>
                <FormLabel>비밀번호</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="6자 이상 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        focusBorderColor="teal.400"
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

            <FormControl isInvalid={!!confirmPasswordError}>
                <FormLabel>비밀번호 확인</FormLabel>
                <InputGroup>
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        focusBorderColor="teal.400"
                    />
                    <InputRightElement>
                        <IconButton
                            aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>
            </FormControl>

            <Box w="100%">
                <Button 
                    colorScheme="teal" 
                    size="lg"
                    width="100%"
                    onClick={handleSignup}
                    isLoading={loading}
                    loadingText="가입 중..."
                    isDisabled={!!emailError || !!passwordError || !!confirmPasswordError || !email || !password || !confirmPassword}
                >
                    회원가입
                </Button>
            </Box>

            <Text fontSize="sm" color="gray.600" textAlign="center">
                이미 계정이 있으신가요?{' '}
                <Button 
                    variant="link" 
                    colorScheme="teal" 
                    size="sm"
                    onClick={() => navigate('/login')}
                >
                    로그인
                </Button>
            </Text>
        </VStack>
    );
}

export default SignupPage;
