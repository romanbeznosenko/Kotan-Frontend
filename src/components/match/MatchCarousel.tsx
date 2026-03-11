import { useState, useEffect } from "react";
import MatchCard from "./MatchCard";
import kotanLogo from "../../assets/images/kotan_logo.jpeg";
import uksSmsLogo from "../../assets/images/uks_sms_logo.png";
import { AgeGroup } from "../../styles/colors";

const PRIMARY = '#46a5fd';

const KOTAN = "Kotan Ozorków";

const MOCK_MATCHES = [
    {
        id: 1,
        homeTeamName: KOTAN,
        homeTeamLogo: kotanLogo,
        awayTeamName: "UKS SMS Łódź",
        awayTeamLogo: uksSmsLogo,
        competition: "IV Liga Kobiet",
        stadium: "ul. Leśna 1, Ozorków",
        matchDate: "17.08.2026 11:00",
        ageGroup: AgeGroup.Seniorki,
    },
    {
        id: 2,
        homeTeamName: "UKS SMS Łódź",
        homeTeamLogo: uksSmsLogo,
        awayTeamName: KOTAN,
        awayTeamLogo: kotanLogo,
        competition: "IV Liga Kobiet",
        stadium: "ul. Sportowa 5, Łódź",
        matchDate: "24.08.2026 13:00",
        ageGroup: AgeGroup.Juniorki,
    },
    {
        id: 3,
        homeTeamName: KOTAN,
        homeTeamLogo: kotanLogo,
        awayTeamName: "UKS SMS Łódź",
        awayTeamLogo: uksSmsLogo,
        competition: "Puchar Polski Kobiet",
        stadium: "ul. Leśna 1, Ozorków",
        matchDate: "31.08.2026 10:00",
        ageGroup: AgeGroup.Mlodziczki,
    },
    {
        id: 4,
        homeTeamName: "UKS SMS Łódź",
        homeTeamLogo: uksSmsLogo,
        awayTeamName: KOTAN,
        awayTeamLogo: kotanLogo,
        competition: "IV Liga Kobiet",
        stadium: "ul. Sportowa 5, Łódź",
        matchDate: "07.09.2026 15:00",
        ageGroup: AgeGroup.Orliczki,
    },
    {
        id: 5,
        homeTeamName: KOTAN,
        homeTeamLogo: kotanLogo,
        awayTeamName: "UKS SMS Łódź",
        awayTeamLogo: uksSmsLogo,
        competition: "IV Liga Kobiet",
        stadium: "ul. Leśna 1, Ozorków",
        matchDate: "14.09.2026 11:00",
        ageGroup: AgeGroup.Seniory,
    },
];

const MatchCarousel = () => {
    const [index, setIndex] = useState(0);
    const [perView, setPerView] = useState(window.innerWidth < 768 ? 1 : 3);

    useEffect(() => {
        const update = () => setPerView(window.innerWidth < 768 ? 1 : 3);
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const maxIndex = MOCK_MATCHES.length - perView;
    const prev = () => setIndex((i) => (i === 0 ? maxIndex : i - 1));
    const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    const visibleMatches = MOCK_MATCHES.slice(index, index + perView);

    return (
        <section style={{
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '0 1rem 5rem',
            fontFamily: "'Lexend', sans-serif",
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        margin: 0,
                        color: '#0f172a',
                    }}>
                        Najbliższe Rozgrywki
                    </h2>
                    <div style={{ height: 6, width: 80, backgroundColor: PRIMARY, marginTop: 4, borderRadius: 3 }} />
                </div>
                <a href="#" style={{
                    color: PRIMARY,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    Wszystkie mecze
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </a>
            </div>

            {/* Cards + nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button onClick={prev} style={{
                    background: 'none',
                    border: `1px solid ${PRIMARY}66`,
                    borderRadius: '50%',
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: PRIMARY,
                    flexShrink: 0,
                    padding: 0,
                }}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <div style={{ flex: 1, display: 'flex', gap: '1.5rem' }}>
                    {visibleMatches.map((match) => (
                        <div key={match.id} style={{ flex: 1, minWidth: 0 }}>
                            <MatchCard
                                {...match}
                                isHome={match.homeTeamName === KOTAN}
                            />
                        </div>
                    ))}
                </div>

                <button onClick={next} style={{
                    background: 'none',
                    border: `1px solid ${PRIMARY}66`,
                    borderRadius: '50%',
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: PRIMARY,
                    flexShrink: 0,
                    padding: 0,
                }}>
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        style={{
                            width: i === index ? 20 : 8,
                            height: 8,
                            borderRadius: 4,
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            backgroundColor: i === index ? PRIMARY : `${PRIMARY}44`,
                            transition: 'width 0.3s, background-color 0.3s',
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default MatchCarousel;
