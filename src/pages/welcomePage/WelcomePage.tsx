import Banner from "../../components/common/Banner";
import PageTemplate from "../../components/common/PageTemplate";
import MatchCarousel from "../../components/match/MatchCarousel";
import HomeNewsSection from "../../components/news/HomeNewsSection";

const WelcomePage = () => (
    <PageTemplate>
        <Banner />
        <MatchCarousel />
        <HomeNewsSection />
    </PageTemplate>
);

export default WelcomePage;