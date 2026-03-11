import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "./SeniorSection";

const PRIMARY = '#46a5fd';

const KIDS_TEAMS = [
    {
        id: 'junior',
        name: 'Junior',
        years: 'Rocznik 2007-2008',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiV9IVDjP4glcpqg5Y_BLRTLppyQketzz4DyVfAltX2emes7kY1QeznLi-VYeEY5WmLs63MdPVO_T3ZpBuTBOIWBVQCSpwgS638axRIfheaf2VGzSccNxB545lfJRkNUB9Ff1ICAlk9OequjVPQRH6G2ED-EBbnfraNB6g6h3QMWO-rsJgPuVhc4Qu8ZvyJK7pActuGLoOhEyMHtINLwwwZNSuXl77Cyj3DkPOHXS3x7_GWJ1ZHwtPdRidHncDeDktobatlG7A9Zw',
    },
    {
        id: 'mlodzik',
        name: 'Młodzik',
        years: 'Rocznik 2011-2012',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMI2HZZ0dzpeFqc5HVO3Dbo9BUN4wFL60OtFMA7qSYl6xHd2RhkJ3cXByTi7g1pNrp7gAQVVqoad-T8bZ5eb6FY5Mzy1Srcqbks4Bmv4UdbFzxryRFH8YekTmCW1W-_Zfckogqf8IgUxBvslgy5EQmd7y0f8LHyfycRxi0VFOt2iqo4MUPuYwDJdDDrw7MQ442tnqDYhMHAle2Qb4ji4tPZERFeOzIHWJ0ZLQlIEgBf_luW11A5Pin-zsnt1_jOdaYePqmTE4dxds',
    },
    {
        id: 'orlik',
        name: 'Orlik',
        years: 'Rocznik 2013-2014',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo5QvfetGb-1OjBW_52JqlYB7kIzG99iJNlbkxkFmGr0Ffo77pxeTlq2iv0mYu7ywhb9-_EqTUFClrPCBT5IYqP8CX2GvVddsBv4CJpd4SHOWYPJJ1OKwAJi6qDaVT50ACTrrcCMnpNDW3w6Oo_8sp3--_mXNu3Bp6y2RYhTBAWMy4YSiR1cTDcNp4vnMYHjJLddxHRCNQBKTWHD8gByuO1xtisGxKlVjDb1Z0LP4QqmS4Vj3oOpVuc2dw4YXlr5eMHfzaOJ4uZT8',
    },
    {
        id: 'zak',
        name: 'Żak',
        years: 'Rocznik 2015-2016',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX2Q4_bb_NV59WfTFz8haOvHYOxG_jn2pkdbsYkSFY5oTIXrSkWshhH7uG-x6zNRjfCSgtFBH-6K0SPEqtw4wTMX8mbXADVpJ47z7GUoVI75bVa-4c9m0394if9i9URtQumgzD6JzYljXze_El0_r4hJcYS_gp6gc7hdbyglAMj2KvhY2OgUhHRhGTdETGT7yiSy2QMMQWsGcorDFPqV-ZHmxVQxtzJJ2kOKfe6nq-PRInzRF9-Vcn98ZKY3kj2MTZe-4q4FSaDuw',
    },
];

const KidsCard = ({ id, name, years, image }: typeof KIDS_TEAMS[0]) => {
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
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
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

const KidsSection = () => (
    <section style={{ marginBottom: '4rem' }} id="kids">
        <SectionHeader title="Kotan Kids" />
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
        }}>
            {KIDS_TEAMS.map((team) => (
                <KidsCard key={team.name} {...team} />
            ))}
        </div>
    </section>
);

export default KidsSection;
