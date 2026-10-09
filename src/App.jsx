import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import ToolPage from './pages/ToolPage';
import ComparisonPage from './pages/ComparisonPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import AuthorPage from './pages/AuthorPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';
import ComparisonIndexPage from './pages/ComparisonIndexPage';

export default function App({ mode, setMode }) {
  return (
    <Routes>
      <Route element={<Layout mode={mode} onToggleMode={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-tools" element={<CategoryPage categorySlug="ai-tools" />} />
        <Route path="/ai-video" element={<CategoryPage categorySlug="ai-video" />} />
        <Route path="/ai-image" element={<CategoryPage categorySlug="ai-image" />} />
        <Route path="/ai-writing" element={<CategoryPage categorySlug="ai-writing" />} />
        <Route path="/ai-audio" element={<CategoryPage categorySlug="ai-audio" />} />
        <Route path="/ai-coding" element={<CategoryPage categorySlug="ai-coding" />} />
        <Route path="/ai-creators" element={<CategoryPage categorySlug="ai-creators" />} />
        <Route path="/ai-business" element={<CategoryPage categorySlug="ai-business" />} />
        <Route path="/ai-students" element={<CategoryPage categorySlug="ai-students" />} />
        <Route path="/comparisons" element={<ComparisonIndexPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/compare/:slug" element={<ComparisonPage />} />
        <Route path="/authors/:slug" element={<AuthorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/disclaimer" element={<LegalPage type="disclaimer" />} />
        <Route path="/affiliate-disclosure" element={<LegalPage type="affiliate" />} />
        <Route path="/editorial-policy" element={<LegalPage type="editorial" />} />
        {import.meta.env.DEV && <Route path="/admin" element={<AdminPage />} />}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
