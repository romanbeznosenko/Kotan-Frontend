import TopNavigation from "./TopNavigation";
import Footer from "./Footer";

const PageTemplate = ({ children }: { children: React.ReactNode }) => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TopNavigation />
        <main style={{ flex: 1, width: '100%' }}>{children}</main>
        <Footer />
    </div>
);

export default PageTemplate;
