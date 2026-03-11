import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "./SeniorSection";

const PRIMARY = '#46a5fd';

const GIRLS_TEAMS = [
    {
        id: 'seniorki',
        name: 'Seniorki',
        years: 'Zespół Open',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASpXkXCGvxX2ItQB-yeo3nezw2tI15Isz13G3dv1NzPZpJMxu0hZ3M4pDgaOvAP_z75cbVUX1wnBL2En5Iv5hd0tOLdFTvqhJCGLRNpgpE4zNJ4LzKlwBeb8LE_5nwA2uO8kIvvxOaUSslEXK7PqR8Z8o3rvgpXf9Y8nxQETqcKWWcYGyCU4Xr0MVWdwFm9KZ3md2WGL0l0Y3wEa8P1h3-hGC_fibU-MAo51t2A9vJaK7s-IRAxrRjeZtjoT-wXyQCPTtgbz-UU-s',
    },
    {
        id: 'mlodziczki',
        name: 'Młodziczki',
        years: 'Rocznik 2011-2013',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1JLXjMdyyjhrB1qzulwsIUsm_WK00fRGM3H9y-sOMK33N_FEMzG7kMUlxdyd3dSdMaTLY7sDX1wAjm-zkRHAruxY6tg6RcKBsg58avj8LYRJu2eslDB05sFtHf8A2fjuiC_CVAe99HOqaBh31yR-kO7JgSs5JMq3dm2_2UTanB54gMEp3v3xiLt6JWwPftpf-IPHXzuZ9IT7QFIquucoLXFBGi6A-3AaE_tcOLjbLFzKvl2CMW-9s5usmbIL7jYThlOynMt8h4s',
    },
    {
        id: 'orliczki',
        name: 'Orliczki',
        years: 'Rocznik 2014-2016',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuiCWIseHnXKZUY06GC03kvgRiXAP3Ll-PNzfJgy4ePr4i2qBsYJA0NZoytOSKXHguVogYOLlh1nVI4D04DHuN26hgh-EHTsOpMwy2UTs8P-er2V9h_COWo98J9t_oW9yB4tOpojRFH9153jbaQLQ_kIFrv051smAL5VeOd8UnHx0tjrEMrpCkPfErejnXuXrAeL3Kqad9PEbJmyXZ8dHafS17w7UJ9lLwMbJrDZqyOUS3fy8_O7J7Y2-7AkqO6RDoQCxjiOkO1SA',
    },
];

const GirlsCard = ({ id, name, years, image }: typeof GIRLS_TEAMS[0]) => {
    const [hovered, setHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: '#fff',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
            }}
        >
            <div style={{ aspectRatio: '16 / 10', overflow: 'hidden' }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.5s ease',
                }} />
            </div>
            <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>{name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 1rem' }}>{years}</p>
                <button
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    onClick={() => navigate(`/teams/${id}`)}
                    style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: btnHovered ? PRIMARY : '#f1f5f9',
                        color: btnHovered ? '#fff' : '#0f172a',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s, color 0.2s',
                    }}
                >
                    Zobacz drużynę
                </button>
            </div>
        </div>
    );
};

const GirlsSection = () => (
    <section style={{ marginBottom: '4rem' }} id="girls">
        <SectionHeader title="Kotan Girls" />
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
        }}>
            {GIRLS_TEAMS.map((team) => (
                <GirlsCard key={team.name} {...team} />
            ))}
        </div>
    </section>
);

export default GirlsSection;
