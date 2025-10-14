import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResultPage from './pages/SearchResultPage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileEditPage from './pages/ProfileEditPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Box minH="100vh" bg="gray.50">
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultPage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProfileEditPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Box>
    );
}

export default App;
