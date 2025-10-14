import { useState } from 'react';
import { VStack, Input, Button, Text, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react';
import { userApi } from '../api/userApi.js';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function ProfileEditPage() {
    const [newPw, setNewPw] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const handleChangePw = async () => {
        if (!newPw) {
            toast({
                title: '입력 오류',
                description: '새 비밀번호를 입력해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await userApi.updateProfile(newPw);
            
            toast({
                title: '비밀번호 변경 완료',
                description: '비밀번호가 성공적으로 변경되었습니다.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            setNewPw('');
        } catch (error) {
            const errorMessage = error.response?.data?.error || '비밀번호 변경에 실패했습니다.';
            toast({
                title: '변경 실패',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await userApi.deleteUser();
            
            toast({
                title: '회원탈퇴 완료',
                description: '회원탈퇴가 완료되었습니다.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.error || '회원탈퇴에 실패했습니다.';
            toast({
                title: '회원탈퇴 실패',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <>
            <VStack spacing={4} py={20}>
                <Text fontSize="2xl" fontWeight="bold">
                    내 정보
                </Text>
                <Input
                    placeholder="새 비밀번호 입력"
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                />
                <Button 
                    colorScheme="teal" 
                    onClick={handleChangePw}
                    isLoading={loading}
                    loadingText="변경 중..."
                >
                    비밀번호 변경
                </Button>
                <Button colorScheme="red" onClick={onOpen}>
                    회원탈퇴
                </Button>
            </VStack>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            회원탈퇴
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                취소
                            </Button>
                            <Button 
                                colorScheme="red" 
                                onClick={handleDelete} 
                                ml={3}
                                isLoading={loading}
                                loadingText="탈퇴 중..."
                            >
                                탈퇴하기
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default ProfileEditPage;
