import { useState } from 'react';
import { VStack, Input, Button, Text, useToast } from '@chakra-ui/react';
import { userApi } from '../api/userApi.js';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!email || !password) {
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
        <VStack spacing={4} py={20}>
            <Text fontSize="2xl" fontWeight="bold">
                회원가입
            </Text>
            <Input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
                colorScheme="teal" 
                onClick={handleSignup}
                isLoading={loading}
                loadingText="가입 중..."
            >
                회원가입
            </Button>
        </VStack>
    );
}

export default SignupPage;
