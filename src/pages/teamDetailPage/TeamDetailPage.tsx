import { useState } from "react";
import PageTemplate from "../../components/common/PageTemplate";
import TeamDetailHero from "../../components/teamDetail/TeamDetailHero";
import TeamInfoCards from "../../components/teamDetail/TeamInfoCards";
import TeamDetailTabs, { type DetailTab } from "../../components/teamDetail/TeamDetailTabs";
import SquadSection from "../../components/teamDetail/SquadSection";
import MatchesSection from "../../components/teamDetail/MatchesSection";
import LeagueTableSection from "../../components/teamDetail/LeagueTableSection";
import GallerySection from "../../components/teamDetail/GallerySection";

const TeamDetailPage = () => {
    const [activeTab, setActiveTab] = useState<DetailTab>('sklad');

    const handleTabChange = (tab: DetailTab) => {
        setActiveTab(tab);
        document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <PageTemplate>
            <div style={{ fontFamily: "'Lexend', sans-serif", width: '100%' }}>
                <TeamDetailHero name="Kadra U-15" years="2010 – 2011" />

                <div style={{
                    maxWidth: '75rem',
                    margin: '0 auto',
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    boxSizing: 'border-box',
                }}>
                    <TeamInfoCards />
                    <TeamDetailTabs active={activeTab} onChange={handleTabChange} />
                    <SquadSection />
                    <MatchesSection />
                    <LeagueTableSection />
                    <GallerySection />
                </div>
            </div>
        </PageTemplate>
    );
};

export default TeamDetailPage;
