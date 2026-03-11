import { useState } from "react";

const PRIMARY = '#46a5fd';

const PHOTOS = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBlssNyB1-Qeemmr7Nw2rTQ49KzFbOTKJcMFQM9rl9eSztIMxQuly67uSGwhDyuaz3VyH07ryLnNpTuBzKHMnWtosSWfkmMJcaWilp1VtjGV2R7KocplvEMK9OmyZyubc6dop3B0Qu7T1ucEgUycaIT9yDMLeOwcQYiw9cMOTxHauaBYYe0hzZyGNnUeXmn9nHPyMASF7N4facUAJBcwQ7KRli-1F6w1lszKRsZa88JMtLsRL3HRDZnRv86ujKFXC8ETfou5rfPoyo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCX9UFH5ieGsEzchuWTuBTPTQ13exnqPOYHfT_JFO8aDDwq-HVNQ4Ssb9vAExAISxa6SAacR0fYBKKoCRS_oiLQCXDghYRWvTHvfKI6Sq-lVewOA1s9zrKGdhfpwFrzKKp_6Y1ZI7LZOBEV2kGfP5T1QlXlbVQ68JqRUCuxrhAGQRAw2foLQr6wuJbn5MHTRS16rhqXlSj3-wPTJg5c4g9B2M58jyNi6hdLZIbb1sAQdvL0tKltKLd0T_jlQkgUvewkorU69LhMfqs',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUkTLZ9Z6Aw400j8lw5sgI5XcwfwD3Q-8z5tXszchRjNXEg66bwlABdzBGWiKb4KSQ4MMjIIFGSn-opi4QOlQX7FvKIwx1tq8ybw1c8vkAtS7yanfVFXVVn01FVnrgarHSpI4P6BR5yrN1ygrzMPIIa1FTbUf9jGMe5b9MvRRc9R7aMRX-DG53qpvr9iHdk66ArcwJq0KEY1DyEP68rb0ZzzI6OMN1tDVnsujQzTMhaDLaDzNTe3w9O1aP0bGAWzFA8GHUU1ov_o',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA41SXwzjuieoqDRHoKb5NUifel8GKsHyC2M3VPabPxskp4XviMYaF3WRKJehnVN4WpPyUqwl0PFge-JK0X2a0cbrpa75hiiBbuoFlPpw7tOiUHU-_ZJAF-wstCEoUzn0A674GAoiF_KLduMfqIsAIo0UqE5iGNPJOt4SyUDmkFmUOAP9_q2xJn_kILUZwNWfkkS8e1A1IuHhjou2sv4UIYh733x57qj9nksBlMqjLJZVOLHePCVMclzmKpvJ661Cdttd2FflKfM-M',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWIW64bSfolZxZ520cvgm8270OZdNfx8MdW1Fqfdw8TbSfi7qbR_t6aM1BDyw4RFNa05R-kJuJs8M6AMJGNpct5veo6U4vsUnrIlb-Pb0YOFZ5HSCONjo1h_4NlZoq81QfI_UsQC_S1ykx9VU__iDdZaDhtFE1KtEWCOuwgpmAmjBknLHPBL8qF_J5D2WfBGU4TgeZKGy-v_Qk50s3h7oNsCaFZ_KTWNPi5ndQawrHVjNQbuNkPqi43eNuE3K-749K2Y2IkeYOwpE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBlssNyB1-Qeemmr7Nw2rTQ49KzFbOTKJcMFQM9rl9eSztIMxQuly67uSGwhDyuaz3VyH07ryLnNpTuBzKHMnWtosSWfkmMJcaWilp1VtjGV2R7KocplvEMK9OmyZyubc6dop3B0Qu7T1ucEgUycaIT9yDMLeOwcQYiw9cMOTxHauaBYYe0hzZyGNnUeXmn9nHPyMASF7N4facUAJBcwQ7KRli-1F6w1lszKRsZa88JMtLsRL3HRDZnRv86ujKFXC8ETfou5rfPoyo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCX9UFH5ieGsEzchuWTuBTPTQ13exnqPOYHfT_JFO8aDDwq-HVNQ4Ssb9vAExAISxa6SAacR0fYBKKoCRS_oiLQCXDghYRWvTHvfKI6Sq-lVewOA1s9zrKGdhfpwFrzKKp_6Y1ZI7LZOBEV2kGfP5T1QlXlbVQ68JqRUCuxrhAGQRAw2foLQr6wuJbn5MHTRS16rhqXlSj3-wPTJg5c4g9B2M58jyNi6hdLZIbb1sAQdvL0tKltKLd0T_jlQkgUvewkorU69LhMfqs',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUkTLZ9Z6Aw400j8lw5sgI5XcwfwD3Q-8z5tXszchRjNXEg66bwlABdzBGWiKb4KSQ4MMjIIFGSn-opi4QOlQX7FvKIwx1tq8ybw1c8vkAtS7yanfVFXVVn01FVnrgarHSpI4P6BR5yrN1ygrzMPIIa1FTbUf9jGMe5b9MvRRc9R7aMRX-DG53qpvr9iHdk66ArcwJq0KEY1DyEP68rb0ZzzI6OMN1tDVnsujQzTMhaDLaDzNTe3w9O1aP0bGAWzFA8GHUU1ov_o',
];

const PhotoTile = ({ src }: { src: string }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                aspectRatio: '1 / 1',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                cursor: 'pointer',
            }}
        >
            <img
                src={src}
                alt="Gallery photo"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                }}
            />
        </div>
    );
};

const GallerySection = () => (
    <section id="galeria" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Galeria</h2>
            <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: PRIMARY,
                fontWeight: 600,
                padding: 0,
            }}>
                Cała galeria →
            </button>
        </div>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
        }}>
            {PHOTOS.map((src, i) => <PhotoTile key={i} src={src} />)}
        </div>
    </section>
);

export default GallerySection;
