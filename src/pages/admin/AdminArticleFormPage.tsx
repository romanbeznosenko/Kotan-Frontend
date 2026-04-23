import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminNewsFormSection from '../../components/admin/AdminNewsFormSection';
import { getArticle, type ArticleResponse } from '../../services/articleService';

const AdminArticleFormPage = () => {
    const { articleId } = useParams<{ articleId?: string }>();
    const navigate = useNavigate();

    const [article,  setArticle]  = useState<ArticleResponse | null>(null);
    const [loading,  setLoading]  = useState(!!articleId);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!articleId) return;
        setLoading(true);
        getArticle(articleId)
            .then(setArticle)
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [articleId]);

    const handleBack = () => {
        localStorage.setItem('adminMenuKey', 'articles');
        navigate('/admin');
    };

    if (loading) {
        return (
            <AdminLayout activeKey="articles">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
                    Ładowanie…
                </div>
            </AdminLayout>
        );
    }

    if (notFound) {
        return (
            <AdminLayout activeKey="articles">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', fontFamily: "'Inter', sans-serif" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#cbd5e1' }}>article</span>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Artykuł nie został znaleziony.</p>
                    <button onClick={handleBack} style={{ padding: '0.5rem 1.25rem', background: '#0061a3', border: 'none', borderRadius: '0.5rem', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                        Wróć do listy
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activeKey="articles">
            <AdminNewsFormSection
                articleResponse={article ?? undefined}
                onBack={handleBack}
                onSaved={handleBack}
            />
        </AdminLayout>
    );
};

export default AdminArticleFormPage;
