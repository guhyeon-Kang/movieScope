import { useState, useEffect } from 'react';
import { 
    VStack, HStack, Box, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
    Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, useToast,
    Tabs, TabList, TabPanels, Tab, TabPanel, Input, Button, Select
} from '@chakra-ui/react';
import { adminApi } from '../api/adminApi.js';

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [collectionLogs, setCollectionLogs] = useState([]);
    const [loginLogs, setLoginLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [collectionFilters, setCollectionFilters] = useState({});
    const [loginFilters, setLoginFilters] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, collectionData, loginData] = await Promise.all([
                adminApi.getDashboardStats(),
                adminApi.getCollectionLogs(),
                adminApi.getLoginLogs()
            ]);

            setStats(statsData);
            setCollectionLogs(collectionData.logs);
            setLoginLogs(loginData.logs);
        } catch (error) {
            console.error('❌ 대시보드 데이터 로드 실패:', error);
            toast({
                title: '데이터 로드 실패',
                description: '관리자 데이터를 불러오는데 실패했습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionFilter = async () => {
        try {
            const data = await adminApi.getCollectionLogs(collectionFilters);
            setCollectionLogs(data.logs);
        } catch (error) {
            console.error('❌ 수집 로그 필터링 실패:', error);
        }
    };

    const handleLoginFilter = async () => {
        try {
            const data = await adminApi.getLoginLogs(loginFilters);
            setLoginLogs(data.logs);
        } catch (error) {
            console.error('❌ 로그인 로그 필터링 실패:', error);
        }
    };

    const getResultCodeColor = (code) => {
        switch (code) {
            case 'SUCCESS': return 'green';
            case 'FAILED': return 'red';
            case 'PARTIAL': return 'yellow';
            case 'NO_RESULTS': return 'gray';
            default: return 'blue';
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('ko-KR');
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '-';
        if (minutes < 60) return `${minutes}분`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}시간 ${mins}분`;
    };

    if (loading) {
        return (
            <VStack py={20}>
                <Text>관리자 데이터를 불러오는 중...</Text>
            </VStack>
        );
    }

    return (
        <VStack spacing={8} py={10} maxW="1200px" mx="auto">
            <Text fontSize="3xl" fontWeight="bold">
                🛠️ 관리자 대시보드
            </Text>

            {/* 통계 카드 */}
            {stats && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="100%">
                    <Stat>
                        <StatLabel>전체 사용자</StatLabel>
                        <StatNumber>{stats.stats.totalUsers}</StatNumber>
                        <StatHelpText>등록된 회원 수</StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>수집된 영화</StatLabel>
                        <StatNumber>{stats.stats.totalMovies}</StatNumber>
                        <StatHelpText>데이터베이스 영화 수</StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>수집 작업</StatLabel>
                        <StatNumber>{stats.stats.totalCollections}</StatNumber>
                        <StatHelpText>총 수집 시도 횟수</StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>로그인 횟수</StatLabel>
                        <StatNumber>{stats.stats.totalLogins}</StatNumber>
                        <StatHelpText>총 로그인 횟수</StatHelpText>
                    </Stat>
                </SimpleGrid>
            )}

            {/* 탭 메뉴 */}
            <Tabs w="100%" index={activeTab} onChange={setActiveTab}>
                <TabList>
                    <Tab>📊 수집 로그 (S1-R41)</Tab>
                    <Tab>👥 로그인 이력 (S1-R42)</Tab>
                </TabList>

                <TabPanels>
                    {/* 수집 로그 탭 */}
                    <TabPanel>
                        <VStack spacing={4} align="stretch">
                            <HStack spacing={4}>
                                <Input
                                    placeholder="키워드 검색"
                                    value={collectionFilters.keyword || ''}
                                    onChange={(e) => setCollectionFilters({...collectionFilters, keyword: e.target.value})}
                                    w="200px"
                                />
                                <Select
                                    placeholder="결과 코드"
                                    value={collectionFilters.resultCode || ''}
                                    onChange={(e) => setCollectionFilters({...collectionFilters, resultCode: e.target.value})}
                                    w="150px"
                                >
                                    <option value="SUCCESS">성공</option>
                                    <option value="FAILED">실패</option>
                                    <option value="PARTIAL">부분성공</option>
                                    <option value="NO_RESULTS">결과없음</option>
                                </Select>
                                <Button onClick={handleCollectionFilter} colorScheme="blue">
                                    필터 적용
                                </Button>
                            </HStack>

                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>로그 ID</Th>
                                            <Th>키워드</Th>
                                            <Th>페이지</Th>
                                            <Th>결과</Th>
                                            <Th>영화 수</Th>
                                            <Th>저장 수</Th>
                                            <Th>임베딩</Th>
                                            <Th>벡터</Th>
                                            <Th>처리시간</Th>
                                            <Th>수집시간</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {collectionLogs.map((log) => (
                                            <Tr key={log.log_id}>
                                                <Td>{log.log_id}</Td>
                                                <Td>{log.keyword}</Td>
                                                <Td>{log.page_number}</Td>
                                                <Td>
                                                    <Badge colorScheme={getResultCodeColor(log.result_code)}>
                                                        {log.result_code}
                                                    </Badge>
                                                </Td>
                                                <Td>{log.movies_found}</Td>
                                                <Td>{log.movies_saved}</Td>
                                                <Td>{log.embedding_created}</Td>
                                                <Td>{log.vectors_saved}</Td>
                                                <Td>{log.processing_time_ms}ms</Td>
                                                <Td>{formatDateTime(log.collection_datetime)}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </VStack>
                    </TabPanel>

                    {/* 로그인 이력 탭 */}
                    <TabPanel>
                        <VStack spacing={4} align="stretch">
                            <HStack spacing={4}>
                                <Input
                                    placeholder="이메일 검색"
                                    value={loginFilters.email || ''}
                                    onChange={(e) => setLoginFilters({...loginFilters, email: e.target.value})}
                                    w="250px"
                                />
                                <Input
                                    placeholder="사용자 ID"
                                    value={loginFilters.userId || ''}
                                    onChange={(e) => setLoginFilters({...loginFilters, userId: e.target.value})}
                                    w="150px"
                                />
                                <Button onClick={handleLoginFilter} colorScheme="blue">
                                    필터 적용
                                </Button>
                            </HStack>

                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>로그 ID</Th>
                                            <Th>사용자 ID</Th>
                                            <Th>이메일</Th>
                                            <Th>로그인 시간</Th>
                                            <Th>로그아웃 시간</Th>
                                            <Th>세션 시간</Th>
                                            <Th>IP 주소</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {loginLogs.map((log) => (
                                            <Tr key={log.log_id}>
                                                <Td>{log.log_id}</Td>
                                                <Td>{log.user_id}</Td>
                                                <Td>{log.email}</Td>
                                                <Td>{formatDateTime(log.login_datetime)}</Td>
                                                <Td>
                                                    {log.logout_datetime 
                                                        ? formatDateTime(log.logout_datetime) 
                                                        : <Badge colorScheme="orange">로그인 중</Badge>
                                                    }
                                                </Td>
                                                <Td>{formatDuration(log.session_duration_minutes)}</Td>
                                                <Td>{log.ip_address || '-'}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
}

export default AdminDashboardPage;
