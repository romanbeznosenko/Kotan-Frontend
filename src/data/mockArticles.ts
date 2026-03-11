export type ArticleCategory = 'senior' | 'junior' | 'mlodzik' | 'orlik' | 'zak' | 'girls';

export interface ArticleBody {
    type: 'paragraph' | 'quote' | 'heading';
    text: string;
}

export interface MockArticle {
    id: string;
    category: ArticleCategory;
    badge: string;
    badgeColor: string;
    date: string;
    title: string;
    excerpt: string;
    image: string;
    heroImage: string;
    body: ArticleBody[];
    gallery: string[];
}

const IMAGES = {
    match1:   'https://lh3.googleusercontent.com/aida-public/AB6AXuAD6VPoolvwvGSkiCruQAnqQPr3PMAYBXbTZ1JvBmjx0QOOHB68_lRQNpz4AYh7vG2-Tb4obFwV6fdMmEeqfIqeyPtIn71ZD5TIZ9DGJ9D2-D7stfxOvXQN4siHH-xjjG5rd0tNS8VAt5UxTtOOdDn_5Q2HWK33gY-5hgydw3FvMrT-PlHAVNICcG5g9GyIVGwC70iSlS1dTK7FjQz7nIK5EV_tAb0OvieKIIbcOBhfZRL2Eh34wbw6utLbeAN149gKXIs5TxT7XCQ',
    match2:   'https://lh3.googleusercontent.com/aida-public/AB6AXuCa_tuYsVd6kdIVZHOx5C2Z1QO7XYlZwhBmv51wFJUgy0DblEtVsqr7-5DIP-ucvoqthTBRqIrMwaHF0ujhISOGDphWRRdaOu38U_fF5JPqhpwnPDxvzfa7keePnCkb0HsuPxCthr84YYr3Ig8he1KZt1Wa_SZdvF4Dtljyg4Pn6hdNth9tmmSMpps456u8iCu3N-Z0S8BoubW6CDmJVo7TDnuEhbhNnF0zrWErPEISc54EtZGRwC0jpnG0mt35OgzU-znXKcDYxoI',
    academy:  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXeaWg5zIxDwYB2J0xL6dQYQ4mzJ19W5UsfbopunEvvMJAo37CVTrE5t5mn_3sA6_3wOYndXp6Rstq0u-QjKlASp1tN8TQdW4l3Ji_opwm46aVigf8G1iv3xysQqua2hAkbp6X5Aaq_nvKbm4b6nGKTa9ciHDXT_DZyrpEy4XbMptt4yNZk0a1NpP3ZFJ-8Ev5yb8Zacyk0w8mfjOCOrKBVrka_EwlPPzvURVp6b18JnXXz3Ot98ajcA2vWljle33nyNjaTl-Zyfo',
    stadium:  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4lkS0d7BJj9yBFx5_LhoACSg1u1eu9TvqAgz-bEsHcNhOloum9lyjTQ8-ed4zkXwbKtZVlsnUUhj1jvW4KaEPIOljDcy0mxmPqPt9wmKdXNuDlyx5i1WzVZXp_Nb1MyG3lLxk9dKgo5IdubTdEwkVxr-EsdM7jmbcsuiWA7UaAKilwolNXbJ4HTjqEipscLY6HX9ZstSEjrJdHgUmeCExLT63EeIeREQ4DtOGAKrcTt0_LW8UjvaAVfb7S8ot4mS_fb3FIhnI_KQ',
    kids1:    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_TUmCuhu_9JC2gTdgo2BDXalMFYfFHW73S3W5_YH8IxUUFgPLwVXSzKPng-mf-IDBK4q3mymtIv_7zpWNzobiFDzd-T_1_yWNVdbLfqSyabnLlrneAq8HEjPgcMuvqycfqUaPtvDeBAsxUmx-Lw8Q8__kWlGszrMfb3fr6JgGWKs8D7GcCABL5b_gQWVlfgsWLJwoOKX5yTBiH5VCQFG2u22CkDflaOSoOnPLZg1F5yyJgOy5c7RHS8tHO0jYlEty2Di89qqATic',
    coach:    'https://lh3.googleusercontent.com/aida-public/AB6AXuDezTz4GkluU97z7SUofqo4vPlNHF1T1oLju2DdCVHJwPRvRYQcYqBdK-i5BxJfdgoN_CccIQlI_0Dhhaqmrh2lhuB0jgKQjIZz_A3U9Wh1bwn_-ouxxdnnl5XcAFbtn5XeerZp1t4Tifkj-r_7CLdIV80jN8v8eZfV951kiOfVWF_QE2VNbiLs3MFlR5GRQblBjLybZkmwskI0YM0pUbiS0n7qW3xoRlCSy3Zip72SNsO6qb0ktUa85lkgd5cjIvd029b_U4sfowk',
    girls:    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7uWo0Z9k7kUEiON-iePVhU1ywSTIthhGS6ph9BO_IGwUmMccp3VWKDWSq39lJDBCVD4K7UDYzx3VaT2tTmc6wUGNegB-Or7_ZsSQYLaZq6RTejx0Roi8iDj7W8tOi38yEQtuu8a6FQSa5_n7p2RZ2YkTy9sZF3aPEKWSrxi_Qqtglmr9mFh_8d1YWLs6iSAbStrRg_gvjafwYuS8y6kpv5miaGzmN_wNjty399wODqnzwj1hBWFyk08hTjehu-wSzNFcGO82ieXY',
    gallery1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3JBpNOXnlapK5VLbADzW0tCO-GucAW33oEs5EcgoDNRWB10_EDVS4fCB08PkITKAiN3UykcMHoi_1tVYRfggowfhasLx6G5PUmHGBeVt4N0tWvwYt7fUUEjuiSE1SaRo0SmqpdRvhUhlIXfLCk4JFyeKJXFGw7s6HfU0EiPblH7ZLW1fWoAWHDOCzfRfGSvj8S8nnYRnP1IGNz73toe7o4R69CK-k6b9fZ9Mh7dRTWTsNWt8ni79ujs1GnT9NhzKDqVCYclwugRQ',
    gallery2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1k0u8tjJS_Ahy2yj4glCKkU1PuPERKCPjSRAW-EZZOjrWnBPhYNilXIdu-J7NmjoCTlHEftGhRknloejtRWTKCiZgEHzMg9Pt1QfYYwQpyROGp-zTPkL48MOW83M9ZvYVoyYXQ9TEzjOUtfhG_sZKZQ--mzQsNMbspLXfYoTc1WwmNKmihAPOJU7SflFhoED9oeF-12tKspd20a4DpEp3v11l-ifU7wruUn9ARszUmoSXufa0kqq_XFO8MinlzSNDF9eLE8wVU-k',
    gallery3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFu4TQkZ_iflGduxAKiOfhN9K57KBYQO4-tEk6nWUC5rAG7vXZt2CsZRQDd3vcezb-kKaHifBCfchnkOmfr9bexXEMYOd_YNVpVrpI27ezkKlRnGgEaq_Edo8pwnbhUqDi7a9ba4gCtJdouroP079iEnSbi5eT5D9Ifm6TpM3mzOKZ4DmuYfweqIL7delLWj2h7fhzzUiQiOJhLnF1Uhi7_gh64oX3dSTRZkO2PgCj0VYKcOTMYnt8aZQF4whG_oPTG1ypEmKKa1o',
    gallery4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNjLqu1GaJ9ip8T-9635xCv7ZpnTuee1bP7Lygk6JdLQ0-VWBH9alB2cHy6cDL4z275J-0tpw1_E3JRri8_ISIzKNH5LBWZb0pOtXgoRAY7ldnhCGBU-RN5LSieK6gm_zwhHAbtUcHlk5iYtyHIKd9kxPK41prFtuAtjwIBDyl3cpaCGg7TO1w1t8Vq7t6ZCemmtkD536xa3dlMjs27_s5vLyJ-pqJ3YrAKq7WbJq-j9l1qb_Qw6LO95_YlYqeEYMLSEudhRp_rBY',
    hero2:    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHDt5efCgfCHRZrcu9JiPtISDvIYaReO8wVSm-E84xp-Et0tA7s7t--rbWuOcz8JeJ0LsFcTKUE4FQ3pxasNWCcEEI5mBYYERWETtN0syIIMHWLWNwsYSeKnHj-DEGBn9xEApU7W6sfWrCd4tuFtZ92qsqGtvnn-2jw41aneWqdyW-I1OCOo9FmU4yuV0bmxm15c-5sjoTgTCfoferFknUVvyePa8IegtdwNqISr-da3QdBwccNNdFOag3lKaW0XtLx2KGkgPj9Sg',
};

export const MOCK_ARTICLES: MockArticle[] = [
    {
        id: 'junior-wygrywa-3-1-z-lks',
        category: 'junior',
        badge: 'Junior',
        badgeColor: '#46a5fd',
        date: '12 maja 2026',
        title: 'Junior wygrywa 3:1 z ŁKS',
        excerpt: 'Nasi juniorzy pokazali klasę w derbowym starciu, dominując na boisku od pierwszej do ostatniej minuty. Znakomita dyspozycja napastników zapewniła nam trzy punkty.',
        image: IMAGES.match1,
        heroImage: IMAGES.hero2,
        gallery: [IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3, IMAGES.gallery4],
        body: [
            { type: 'paragraph', text: 'Niesamowite emocje towarzyszyły dzisiejszemu spotkaniu naszej drużyny Juniorów z łódzkim ŁKS-em. Od pierwszego gwizdka sędziego nasi zawodnicy pokazali ogromną determinację i wolę walki, co szybko przełożyło się na przewagę na boisku.' },
            { type: 'paragraph', text: 'Pierwsza bramka padła już w 15. minucie spotkania po fantastycznym rajdzie lewym skrzydłem i precyzyjnym dośrodkowaniu. Choć rywale zdołali wyrównać tuż przed przerwą, druga połowa należała bezsprzecznie do ekipy Kotana Ozorków. Dwa kolejne trafienia w 60. i 82. minucie przypieczętowały nasze zwycięstwo.' },
            { type: 'quote', text: '"Jestem niezwykle dumny z postawy chłopaków. Realizowali założenia taktyczne od początku do końca, a ich zaangażowanie było kluczem do tego cennego zwycięstwa" – trener drużyny Juniorów.' },
            { type: 'paragraph', text: 'To zwycięstwo umacnia naszą pozycję na drugiej pozycji tabeli i daje ogromny zastrzyk pozytywnej energii przed nadchodzącymi derbami regionu. Dziękujemy wszystkim kibicom, którzy wspierali nas z trybun!' },
        ],
    },
    {
        id: 'mlodzik-wygrana-z-widzewem',
        category: 'mlodzik',
        badge: 'Młodzik',
        badgeColor: '#22c55e',
        date: '11 maja 2026',
        title: 'Młodzik: Wygrana w meczu z Widzewem',
        excerpt: 'Świetna postawa młodych zawodników w starciu z utytułowanym rywalem. Walka do końca się opłaciła.',
        image: IMAGES.match2,
        heroImage: IMAGES.match2,
        gallery: [IMAGES.gallery2, IMAGES.gallery3, IMAGES.gallery1, IMAGES.gallery4],
        body: [
            { type: 'paragraph', text: 'W niedzielne południe nasza drużyna Młodzika stanęła do boju z jednym z faworytów rozgrywek – Widzewem Łódź. Mecz od samego początku zapowiadał się jako zaciętą walkę dwóch dobrze zorganizowanych zespołów.' },
            { type: 'paragraph', text: 'Wyrównane pierwsze półgodziny zakończyły się bramką dla Kotana w 34. minucie – po stałym fragmencie gry i celnym strzale z woleja. Widzew próbował odpowiedzieć, lecz nasza defensywa spisywała się znakomicie, nie dając rywalom szans na wyjście z własnej połowy.' },
            { type: 'quote', text: '"Chłopcy zagrali tak, jak trenujemy. Dyscyplina taktyczna i praca zespołowa na najwyższym poziomie – to przyniosło nam trzy punkty" – skomentował opiekun grupy.' },
            { type: 'paragraph', text: 'Zwycięstwo 2:0 po trafieniu w doliczonym czasie gry umacnia Młodzika na trzecim miejscu tabeli. Następny mecz odbędzie się już w przyszły weekend na naszym boisku.' },
        ],
    },
    {
        id: 'akademia-nabor-rocznik-2018',
        category: 'senior',
        badge: 'Akademia',
        badgeColor: '#2563eb',
        date: '10 maja 2026',
        title: 'Akademia: Nowy nabór do rocznika 2018',
        excerpt: 'Zapraszamy wszystkich chętnych z rocznika 2018 na treningi otwarte. Dołącz do naszej piłkarskiej rodziny.',
        image: IMAGES.academy,
        heroImage: IMAGES.academy,
        gallery: [IMAGES.gallery3, IMAGES.gallery1, IMAGES.gallery4, IMAGES.gallery2],
        body: [
            { type: 'paragraph', text: 'Akademia Kotan Ozorków ogłasza otwarcie naboru do grupy rocznika 2018. Szukamy utalentowanych i chętnych do pracy młodych piłkarzy, którzy chcą rozwijać swoje umiejętności pod okiem doświadczonych trenerów.' },
            { type: 'heading', text: 'Kiedy i gdzie?' },
            { type: 'paragraph', text: 'Treningi otwarte odbędą się w dniach 20–22 maja 2026 r. na Stadionie Miejskim przy ul. Sportowej 1 w Ozorkowie. Każde zajęcia startują o godzinie 10:00 i trwają 90 minut. Wstęp wolny dla wszystkich chętnych.' },
            { type: 'quote', text: '"Stawiamy na wszechstronny rozwój – technikę, taktykę i mentalność. Każde dziecko, które trafi do naszej akademii, ma szansę stać się prawdziwym zawodnikiem" – dyrektor szkolenia.' },
            { type: 'paragraph', text: 'Rodziców zapraszamy do kontaktu pod adresem e-mail akademia@kotanozorkow.pl lub telefonicznie pod numer +48 123 456 789. Liczba miejsc ograniczona – decyduje kolejność zgłoszeń.' },
        ],
    },
    {
        id: 'seniorzy-remis-na-wyjedzie',
        category: 'senior',
        badge: 'Seniorzy',
        badgeColor: '#1e293b',
        date: '09 maja 2026',
        title: 'Seniorzy: Remis na wyjeździe',
        excerpt: 'Cenny punkt wywalczony w trudnych warunkach pogodowych. Drużyna pokazała niesamowity charakter.',
        image: IMAGES.stadium,
        heroImage: IMAGES.stadium,
        gallery: [IMAGES.gallery4, IMAGES.gallery2, IMAGES.gallery1, IMAGES.gallery3],
        body: [
            { type: 'paragraph', text: 'W sobotnim wyjazdowym spotkaniu Klasy Okręgowej nasi seniorzy zmierzyli się z GKS Bełchatów. Warunki atmosferyczne były dalekie od idealnych – silny wiatr i przerywany deszcz utrudniały precyzyjną grę obu drużynom.' },
            { type: 'paragraph', text: 'Mimo trudności zawodnicy Kotana solidnie wypełniali założenia taktyczne. Bramka zdobyta w 71. minucie po indywidualnej akcji skrzydłowego pozwoliła nam wyjść na prowadzenie. Niestety, w ostatnich minutach gospoda zdołali wyrównać po stałym fragmencie gry.' },
            { type: 'quote', text: '"Remis na tym boisku to dobry wynik, biorąc pod uwagę warunki i stan murawy. Wracamy z głową wysoko podniesioną" – kapitan drużyny.' },
            { type: 'paragraph', text: 'Punkt zdobyty na wyjeździe utrzymuje nas w górnej połowie tabeli. Przed nami trzy mecze u siebie, które dają realną szansę na walkę o awans do wyższej klasy rozgrywkowej.' },
        ],
    },
    {
        id: 'orlik-turniej-lodz',
        category: 'orlik',
        badge: 'Orlik',
        badgeColor: '#f97316',
        date: '08 maja 2026',
        title: 'Orlik: Turniej w Łodzi',
        excerpt: 'Nasi najmłodsi rywalizowali z najlepszymi ekipami z regionu. Zbieramy doświadczenie na przyszłość.',
        image: IMAGES.kids1,
        heroImage: IMAGES.kids1,
        gallery: [IMAGES.gallery1, IMAGES.gallery4, IMAGES.gallery3, IMAGES.gallery2],
        body: [
            { type: 'paragraph', text: 'W minioną sobotę nasza drużyna Orlika wzięła udział w Regionalnym Turnieju Piłkarskim organizowanym przez ŁKS Łódź. W zawodach uczestniczyło łącznie 12 drużyn z województwa łódzkiego.' },
            { type: 'paragraph', text: 'Kotan Ozorków wygrał dwa z czterech meczów grupowych, trafiając aż 9 bramek i przepuszczając zaledwie 3. W ćwierćfinale trafiliśmy na bardzo dobrze zorganizowany zespół Zagłębia Lubin, który ostatecznie nas wyeliminował po serii rzutów karnych.' },
            { type: 'quote', text: '"Chłopcy naprawdę dali z siebie wszystko. Turniej to dla nas bezcenne doświadczenie i motywacja do dalszej pracy" – trener grupy Orlik.' },
            { type: 'paragraph', text: 'Mimo że nie zdobyliśmy trofeum, wracamy z Łodzi bogatsi o cenne lekcje i wspomnienia. Już teraz zaczynamy przygotowania do kolejnego turnieju planowanego na czerwiec.' },
        ],
    },
    {
        id: 'zak-trening-pokazowy',
        category: 'zak',
        badge: 'Żak',
        badgeColor: '#eab308',
        date: '07 maja 2026',
        title: 'Żak: Trening pokazowy',
        excerpt: 'Zapraszamy rodziców na trybuny podczas najbliższego treningu. Zobaczcie postępy naszych małych mistrzów.',
        image: IMAGES.coach,
        heroImage: IMAGES.coach,
        gallery: [IMAGES.gallery2, IMAGES.gallery1, IMAGES.gallery4, IMAGES.gallery3],
        body: [
            { type: 'paragraph', text: 'W najbliższą sobotę, 14 maja 2026 r., zapraszamy wszystkich rodziców oraz opiekunów naszych Żaków na specjalny trening pokazowy. To wyjątkowa okazja, by zobaczyć, jak wiele osiągnęły Wasze pociechy od początku sezonu.' },
            { type: 'heading', text: 'Program treningu' },
            { type: 'paragraph', text: 'Zajęcia rozpoczną się o godzinie 9:00 i potrwają do 10:30. W programie: ćwiczenia techniki indywidualnej, gry małostronnicze oraz mini-mecz zamykający trening. Po zajęciach zapraszamy na krótkie spotkanie z trenerami.' },
            { type: 'quote', text: '"To dla nas ważny moment – pokazujemy rodzicom efekty naszej wspólnej pracy. Dzieci są niesamowite i naprawdę ciężko pracują na każdym treningu" – opiekun grupy Żak.' },
            { type: 'paragraph', text: 'Wstęp wolny. Na miejscu będzie dostępny bufet. W razie pytań prosimy o kontakt pod numer +48 123 456 789.' },
        ],
    },
    {
        id: 'girls-teams-sukces-w-pucharze',
        category: 'girls',
        badge: 'Girls Teams',
        badgeColor: '#ec4899',
        date: '06 maja 2026',
        title: 'Girls Teams: Sukces w pucharze',
        excerpt: 'Historyczne zwycięstwo naszej sekcji żeńskiej w turnieju. Dziewczyny pokazały wielką wolę walki.',
        image: IMAGES.girls,
        heroImage: IMAGES.girls,
        gallery: [IMAGES.gallery3, IMAGES.gallery4, IMAGES.gallery1, IMAGES.gallery2],
        body: [
            { type: 'paragraph', text: 'Historyczny dzień dla Kotana Ozorków! Nasza sekcja żeńska po raz pierwszy w historii akademii zdobyła Regionalny Puchar Łódzkiego Związku Piłki Nożnej. To zwieńczenie wielu miesięcy ciężkiej pracy całego sztabu szkoleniowego i zawodniczek.' },
            { type: 'paragraph', text: 'W finale zmierzyłyśmy się z Widzewem Łódź – drużyną uznawaną za faworyta rozgrywek. Mimo presji nasze dziewczyny zagrały mecz życia. Bramka strzelona w 88. minucie przez naszą nową gwiazdę Zofię Wiśniewską zapewniła nam tytuł.' },
            { type: 'quote', text: '"Płakałam ze szczęścia razem z dziewczynami. Wiedzą, ile ta chwila kosztowała i co oznacza dla całego klubu. Jestem z nich niesamowicie dumna" – trenerka sekcji żeńskiej.' },
            { type: 'paragraph', text: 'Puchar trafi na honorowe miejsce w gablocie klubowej. Zapraszamy wszystkich kibiców na świętowanie w sobotę 13 maja na Stadionie Miejskim – startujemy o 12:00!' },
        ],
    },
];

export const FEATURED_ARTICLE = MOCK_ARTICLES[0];
