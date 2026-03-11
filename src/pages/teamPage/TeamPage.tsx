import { useState } from "react";
import PageTemplate from "../../components/common/PageTemplate";
import TeamHero from "../../components/team/TeamHero";
import TeamTabs, { type TeamTab } from "../../components/team/TeamTabs";
import SeniorSection from "../../components/team/SeniorSection";
import KidsSection from "../../components/team/KidsSection";
import GirlsSection from "../../components/team/GirlsSection";

const TeamPage = () => {
    const [activeTab, setActiveTab] = useState<TeamTab>('senior');

    const handleTabChange = (tab: TeamTab) => {
        setActiveTab(tab);
        document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <PageTemplate>
            <div style={{
                width: '100%',
                maxWidth: '75rem',
                margin: '0 auto',
                padding: '2.5rem 1.5rem',
                fontFamily: "'Lexend', sans-serif",
                boxSizing: 'border-box',
            }}>
                <TeamHero />
                <TeamTabs active={activeTab} onChange={handleTabChange} />
                <SeniorSection />
                <KidsSection />
                <GirlsSection />
            </div>
        </PageTemplate>
    );
};

export default TeamPage;
