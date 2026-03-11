import { useState } from "react";

const PRIMARY = '#46a5fd';

const PLAYERS = [
    { number: 10, name: 'Adam Nowak',       position: 'Napastnik', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlssNyB1-Qeemmr7Nw2rTQ49KzFbOTKJcMFQM9rl9eSztIMxQuly67uSGwhDyuaz3VyH07ryLnNpTuBzKHMnWtosSWfkmMJcaWilp1VtjGV2R7KocplvEMK9OmyZyubc6dop3B0Qu7T1ucEgUycaIT9yDMLeOwcQYiw9cMOTxHauaBYYe0hzZyGNnUeXmn9nHPyMASF7N4facUAJBcwQ7KRli-1F6w1lszKRsZa88JMtLsRL3HRDZnRv86ujKFXC8ETfou5rfPoyo' },
    { number:  1, name: 'Jakub Wiśniewski', position: 'Bramkarz',  photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX9UFH5ieGsEzchuWTuBTPTQ13exnqPOYHfT_JFO8aDDwq-HVNQ4Ssb9vAExAISxa6SAacR0fYBKKoCRS_oiLQCXDghYRWvTHvfKI6Sq-lVewOA1s9zrKGdhfpwFrzKKp_6Y1ZI7LZOBEV2kGfP5T1QlXlbVQ68JqRUCuxrhAGQRAw2foLQr6wuJbn5MHTRS16rhqXlSj3-wPTJg5c4g9B2M58jyNi6hdLZIbb1sAQdvL0tKltKLd0T_jlQkgUvewkorU69LhMfqs' },
    { number:  4, name: 'Marek Kowal',      position: 'Obrońca',   photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUkTLZ9Z6Aw400j8lw5sgI5XcwfwD3Q-8z5tXszchRjNXEg66bwlABdzBGWiKb4KSQ4MMjIIFGSn-opi4QOlQX7FvKIwx1tq8ybw1c8vkAtS7yanfVFXVVn01FVnrgarHSpI4P6BR5yrN1ygrzMPIIa1FTbUf9jGMe5b9MvRRc9R7aMRX-DG53qpvr9iHdk66ArcwJq0KEY1DyEP68rb0ZzzI6OMN1tDVnsujQzTMhaDLaDzNTe3w9O1aP0bGAWzFA8GHUU1ov_o' },
    { number:  8, name: 'Piotr Zieliński',  position: 'Pomocnik',  photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA41SXwzjuieoqDRHoKb5NUifel8GKsHyC2M3VPabPxskp4XviMYaF3WRKJehnVN4WpPyUqwl0PFge-JK0X2a0cbrpa75hiiBbuoFlPpw7tOiUHU-_ZJAF-wstCEoUzn0A674GAoiF_KLduMfqIsAIo0UqE5iGNPJOt4SyUDmkFmUOAP9_q2xJn_kILUZwNWfkkS8e1A1IuHhjou2sv4UIYh733x57qj9nksBlMqjLJZVOLHePCVMclzmKpvJ661Cdttd2FflKfM-M' },
    { number: 21, name: 'Filip Mazur',      position: 'Pomocnik',  photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWIW64bSfolZxZ520cvgm8270OZdNfx8MdW1Fqfdw8TbSfi7qbR_t6aM1BDyw4RFNa05R-kJuJs8M6AMJGNpct5veo6U4vsUnrIlb-Pb0YOFZ5HSCONjo1h_4NlZoq81QfI_UsQC_S1ykx9VU__iDdZaDhtFE1KtEWCOuwgpmAmjBknLHPBL8qF_J5D2WfBGU4TgeZKGy-v_Qk50s3h7oNsCaFZ_KTWNPi5ndQawrHVjNQbuNkPqi43eNuE3K-749K2Y2IkeYOwpE' },
];

const PlayerCard = ({ number, name, position, photo }: typeof PLAYERS[0]) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: '#fff',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
                transition: 'box-shadow 0.2s',
            }}
        >
            <div style={{ aspectRatio: '3 / 4', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <img
                    src={photo}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                    position: 'absolute', top: 8, right: 8,
                    backgroundColor: PRIMARY, color: '#fff',
                    fontWeight: 700, borderRadius: '0.5rem',
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.125rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                    {number}
                </div>
            </div>
            <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 2px', fontSize: '0.9rem' }}>{name}</p>
                <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>{position}</p>
            </div>
        </div>
    );
};

const SquadSection = () => (
    <section id="sklad" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Kadra Drużyny</h2>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>22 Zawodników</span>
        </div>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem',
        }}>
            {PLAYERS.map((p) => <PlayerCard key={p.number} {...p} />)}
        </div>
        <button style={{
            backgroundColor: `rgba(70,165,253,0.1)`,
            color: PRIMARY,
            fontWeight: 700,
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s',
        }}>
            Pokaż cały skład (22)
        </button>
    </section>
);

export default SquadSection;
