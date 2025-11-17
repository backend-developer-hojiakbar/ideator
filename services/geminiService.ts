import { GoogleGenAI, Type } from "@google/genai";
import type { Language, IdeaConfiguration, StartupIdea, ChatMessage, CompetitiveAnalysis, TargetAudiencePersonas, MonetizationStrategy, OptimizedMonetizationSuggestion, PricingTier, StrategicReview, PitchDeckSlide, PitchDeckSlideSuggestion, KanbanTask, AISlideAnalysis, AIPitchHealthCheck, AnswerFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const languageNames: Record<Language, string> = {
    'uz-Latn': "o'zbek (lotin)",
    'uz-Cyrl': "o'zbek (kirill)",
    'ru': "rus",
    'en': "ingliz"
};

const riskLikelihoods: Record<Language, string[]> = {
    'uz-Latn': ['Past', 'O\'rta', 'Yuqori'],
    'uz-Cyrl': ['Паст', 'Ўрта', 'Юқори'],
    'ru': ['Низкая', 'Средняя', 'Высокая'],
    'en': ['Low', 'Medium', 'High'],
}

const getSchema = (lang: Language) => ({
    type: Type.OBJECT,
    properties: {
        projectName: { type: Type.STRING, description: "Loyiha uchun qisqa, esda qolarli va jozibali nom." },
        description: { type: Type.STRING, description: "Loyiha haqida 1-2 jumlada batafsil tavsif." },
        projectCharter: {
            type: Type.OBJECT,
            properties: {
                mission: { type: Type.STRING, description: "Loyihaning asosiy missiyasi." },
                vision: { type: Type.STRING, description: "3-5 yillik istiqboldagi tasavvur (vision)." },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "SMART maqsadlar ro'yxati." },
                scope: { type: Type.STRING, description: "Dastlabki bosqichda qamrov va chegaralar (scope)." },
                successMetrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Muvaffaqiyat metrikalari (KPI)." },
                governance: { type: Type.STRING, description: "Nizom, boshqaruv va qarorlar qabul qilish tamoyillari." },
                values: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Asosiy qadriyatlar." },
                stakeholders: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Asosiy manfaatdor tomonlar (stakeholders)." },
                assumptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Asosiy farazlar (assumptions)." },
                constraints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cheklovlar (constraints)." },
                outOfScope: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Qamrovga kirmaydigan ishlar (out of scope)." },
                dependencies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bog'liqliklar (dependencies)." },
                budgetOverview: { type: Type.STRING, description: "Byudjetning umumiy ko'rinishi." },
                successCriteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Muvaffaqiyat mezonlari." },
            },
            required: ['mission', 'vision', 'objectives', 'scope', 'successMetrics', 'governance', 'values', 'stakeholders', 'assumptions', 'constraints', 'outOfScope', 'dependencies', 'budgetOverview', 'successCriteria']
        },
        leanCanvas: {
            type: Type.OBJECT,
            properties: {
                problem: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mijoz duch keladigan 1-3 ta asosiy muammo." },
                solution: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Har bir muammo uchun 1-3 ta yechim." },
                keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Biznes muvaffaqiyatini o'lchaydigan 2-4 ta asosiy ko'rsatkich." },
                uniqueValueProposition: { type: Type.STRING, description: "Mijozlarga taklif qilinadigan, raqobatchilardan ajralib turadigan noyob qiymat." },
                unfairAdvantage: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Raqobatchilar osonlikcha ko'chira olmaydigan 2-3 ta ustunlik." },
                channels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mijozlarga yetib borish uchun 3-5 ta kanal." },
                customerSegments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Maqsadli auditoriyaning 2-4 ta segmenti." },
                costStructure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Biznesni yuritish uchun 3-5 ta asosiy xarajatlar." },
                revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pul ishlashning 2-4 ta usuli." },
            },
            required: ['problem', 'solution', 'keyMetrics', 'uniqueValueProposition', 'unfairAdvantage', 'channels', 'customerSegments', 'costStructure', 'revenueStreams']
        },
        swotAnalysis: {
            type: Type.OBJECT,
            properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['strengths', 'weaknesses', 'opportunities', 'threats']
        },
        pestleAnalysis: {
            type: Type.OBJECT,
            properties: {
                political: { type: Type.ARRAY, items: { type: Type.STRING } },
                economic: { type: Type.ARRAY, items: { type: Type.STRING } },
                social: { type: Type.ARRAY, items: { type: Type.STRING } },
                technological: { type: Type.ARRAY, items: { type: Type.STRING } },
                legal: { type: Type.ARRAY, items: { type: Type.STRING } },
                environmental: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['political', 'economic', 'social', 'technological', 'legal', 'environmental']
        },
        financialProjections: {
            type: Type.OBJECT,
            properties: {
                revenueForecast: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            year: { type: Type.INTEGER },
                            revenue: { type: Type.NUMBER, description: "Yillik daromad, O'zbekiston so'mida." },
                        },
                        required: ['year', 'revenue']
                    }
                },
                breakEvenAnalysis: { type: Type.STRING },
                keyAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['revenueForecast', 'breakEvenAnalysis', 'keyAssumptions']
        },
        marketingStrategy: {
            type: Type.OBJECT,
            properties: {
                targetAudience: { type: Type.STRING },
                channels: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyMessage: { type: Type.STRING },
            },
            required: ['targetAudience', 'channels', 'keyMessage']
        },
        projectRoadmap: {
            type: Type.OBJECT,
            properties: {
                phases: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            tasks: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        name: { type: Type.STRING },
                                        startDate: { type: Type.STRING, description: "YYYY-MM-DD formatida" },
                                        durationDays: { type: Type.INTEGER },
                                        dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    },
                                    required: ['id', 'name', 'startDate', 'durationDays']
                                }
                            }
                        },
                        required: ['name', 'tasks']
                    }
                }
            },
            required: ['phases']
        },
        pitchDeck: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.ARRAY, items: { type: Type.STRING } },
                    visualSuggestion: { type: Type.STRING, description: "Slaydni kuchaytirish uchun qisqa, aniq vizual tavsiya (masalan, 'LTV vs CAC bar grafigi', 'Konversiya voronkasi diagrammasi'). Bu ixtiyoriy." },
                },
                required: ['title', 'content']
            }
        },
        legalTemplates: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ['name', 'description']
            }
        },
        brandingGuide: {
            type: Type.OBJECT,
            properties: {
                colorPalette: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            hex: { type: Type.STRING },
                            name: { type: Type.STRING },
                        },
                        required: ['hex', 'name']
                    }
                },
                typography: {
                    type: Type.OBJECT,
                    properties: {
                        fontFamily: { type: Type.STRING },
                        usage: { type: Type.STRING },
                    },
                    required: ['fontFamily', 'usage']
                },
            },
            required: ['colorPalette', 'typography']
        },
        actionableChecklist: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            completed: { type: Type.BOOLEAN },
                        },
                        required: ['id', 'text', 'completed']
                    }
                },
            },
            required: ['title', 'items']
        },
        competitiveAnalysis: {
            type: Type.OBJECT,
            properties: {
                competitors: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                            strategyToBeat: { type: Type.STRING, description: "Ularni qanday yengish mumkinligi haqida strategiya." }
                        },
                        required: ['name', 'strengths', 'weaknesses', 'strategyToBeat']
                    }
                },
                marketPositioningStatement: { type: Type.STRING, description: "Bozorda o'z o'rnini qanday egallashi haqida qisqa bayonot." }
            },
            required: ['competitors', 'marketPositioningStatement']
        },
        targetAudiencePersonas: {
            type: Type.OBJECT,
            properties: {
                personas: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            demographics: { type: Type.STRING, description: "Yoshi, jinsi, kasbi, yashash joyi." },
                            goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                            painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Asosiy 'og'riqli nuqtalari'." },
                            story: { type: Type.STRING, description: "Uning hayotidan qisqa hikoya." }
                        },
                        required: ['name', 'demographics', 'goals', 'painPoints', 'story']
                    }
                },
                summary: { type: Type.STRING, description: "Maqsadli auditoriya haqida umumiy xulosa." }
            },
            required: ['personas', 'summary']
        },
        monetizationStrategy: {
            type: Type.OBJECT,
            properties: {
                primaryModel: { type: Type.STRING, description: "Asosiy pul ishlash modeli (masalan, Obuna)." },
                description: { type: Type.STRING },
                pricingTiers: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Tarif rejasi nomi (masalan, Bepul, Pro)." },
                            price: { type: Type.STRING, description: "Narxi (masalan, 'Oyiga 50,000 so'm')." },
                            features: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['name', 'price', 'features']
                    }
                },
                justification: { type: Type.STRING, description: "Nima uchun bu model tanlanganligi haqida asos." }
            },
            required: ['primaryModel', 'description', 'pricingTiers', 'justification']
        },
        teamStructure: {
            type: Type.OBJECT,
            properties: {
                roles: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING, description: "Lavozim (masalan, CEO, CTO)." },
                            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['role', 'responsibilities', 'requiredSkills']
                    }
                },
                hiringPriorities: { type: Type.STRING, description: "Birinchi navbatda kimlarni ishga olish kerakligi." }
            },
            required: ['roles', 'hiringPriorities']
        },
        riskAnalysis: {
            type: Type.OBJECT,
            properties: {
                risks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            likelihood: { type: Type.STRING, enum: riskLikelihoods[lang] },
                            impact: { type: Type.STRING, enum: riskLikelihoods[lang] },
                            mitigation: { type: Type.STRING, description: "Riskni kamaytirish strategiyasi." }
                        },
                        required: ['description', 'likelihood', 'impact', 'mitigation']
                    }
                },
                summary: { type: Type.STRING, description: "Asosiy risklar haqida xulosa." }
            },
            required: ['risks', 'summary']
        }
    },
    required: ['projectName', 'description', 'projectCharter', 'leanCanvas', 'swotAnalysis', 'pestleAnalysis', 'financialProjections', 'marketingStrategy', 'projectRoadmap', 'pitchDeck', 'legalTemplates', 'brandingGuide', 'actionableChecklist', 'competitiveAnalysis', 'targetAudiencePersonas', 'monetizationStrategy', 'teamStructure', 'riskAnalysis']
});

const generateBriefIdeaConcept = async (config: IdeaConfiguration, lang: Language): Promise<string> => {
    const prompt = `
        O'zbekiston bozori uchun quyidagi parametrlarga mos keladigan, bir jumladan iborat, aniq va original startap g'oyasi konsepsiyasini yarat:
        - Soha: ${config.industry}
        ${config.ideaTopic ? `- G'oya mavzusi: ${config.ideaTopic}` : ''}
        ${config.briefInfo ? `- Qisqacha ma'lumot: ${config.briefInfo}` : ''}
        - Boshlang'ich sarmoya: ${config.investment}
        - Murakkablik darajasi: ${config.complexity}
        - Biznes modeli: ${config.businessModel.join(', ')}
        
        Agar "G'oya mavzusi" yoki "Qisqacha ma'lumot" berilgan bo'lsa, g'oyani shu mavzu atrofida qur. Agar berilmagan bo'lsa, ijodiy yondash.

        Misol: "Sun'iy intellekt yordamida fermerlarga ekin kasalliklarini aniqlashda yordam beradigan mobil ilova."
        
        Javobingda faqat g'oya konsepsiyasining o'zini ${languageNames[lang]} tilida yoz. Boshqa hech narsa qo'shma.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            temperature: 0.9, // Increase creativity for diverse concepts
        },
    });

    return response.text.trim();
};


const isIdeaUniqueInUzbekistan = async (ideaConcept: string): Promise<boolean> => {
    const prompt = `
        O'zbekiston bozori uchun Google Qidiruv ma'lumotlariga asoslanib, quyidagi konsepsiyaga juda o'xshash, allaqachon mavjud bo'lgan, taniqli va faoliyat yuritayotgan startap bormi?
        Konseptsiya: "${ideaConcept}"
        Javobingda faqat "HA" yoki "YO'Q" so'zlarini ishlat. Boshqa hech narsa yozma.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0,
            },
        });

        const textResponse = response.text.trim().toUpperCase();
        console.log(`Uniqueness check for "${ideaConcept}": AI responded with "${textResponse}"`);
        
        return !textResponse.includes("HA");

    } catch (error) {
        console.error("Uniqueness check failed:", error);
        return true; // Fail safe - assume it's unique if the check fails.
    }
};

export const generateStartupIdea = async (config: IdeaConfiguration, lang: Language): Promise<StartupIdea> => {
    const MAX_RETRIES = 5;
    let retries = 0;
    let uniqueIdeaConcept = "";

    while (retries < MAX_RETRIES) {
        console.log(`Attempt ${retries + 1} to generate a unique idea concept...`);
        const concept = await generateBriefIdeaConcept(config, lang);
        console.log(`Generated concept: "${concept}"`);

        if (!concept) {
            console.log("Generated concept was empty. Retrying...");
            retries++;
            continue;
        }

        console.log(`Checking uniqueness for concept...`);
        const isUnique = await isIdeaUniqueInUzbekistan(concept);

        if (isUnique) {
            console.log("Concept is unique. Proceeding with full generation.");
            uniqueIdeaConcept = concept;
            break; 
        } else {
            console.log("Concept is not unique. Retrying...");
            retries++;
        }
    }

    if (!uniqueIdeaConcept) {
        throw new Error(`Could not generate a unique startup idea after ${MAX_RETRIES} attempts. Please try different parameters.`);
    }
    
    const goldenTicketPrompt = config.isGoldenTicket 
        ? "DIQQAT! Bu 'Oltin Bilet' g'oyasi. Sen O'zbekistondagi Uzum, Korzinka, Click, PayMe kabi texnologik gigantlarning birining top-menejerisan. Ularning mavjud ekotizimidagi strategik bo'shliqni top va shu bo'shliqni to'ldiradigan, ular sotib olishga yoki katta sarmoya kiritishga tayyor bo'ladigan yangi kompaniya g'oyasini yarat. Bu shunchaki hamkor emas, balki ularning keyingi katta o'sish nuqtasi bo'lishi kerak."
        : "";

    const prompt = `
        Sen Kremniy Vodiysidagi eng nufuzli venchur fondining bosh hamkorisan. Sening ixtisosliging — O‘zbekiston kabi rivojlanayotgan bozorlarda "yakkashox" (unicorn) bo‘lish potentsialiga ega bo‘lgan startaplarni topish va inkubatsiya qilish. Sening vazifang — nafaqat g‘oya, balki 100 million dollarlik A seriya raundini yopa oladigan, har bir detali puxta o‘ylangan, o‘ta kuchli biznes-reja yaratish.

        **Generatsiya qilingan unikal g'oya konsepsiyasi:** "${uniqueIdeaConcept}"

        Bu g'oya quyidagi foydalanuvchi kiritgan parametrlarga asoslanib KENGAYTIRILISHI kerak:
        - Soha: ${config.industry}
        - Boshlang'ich sarmoya: ${config.investment}
        - Murakkablik darajasi: ${config.complexity}
        - Biznes modeli: ${config.businessModel.join(', ')}
        ${config.ideaTopic ? `- Asosiy mavzu: "${config.ideaTopic}"` : ''}
        ${config.briefInfo ? `- Qisqacha ma'lumot: "${config.briefInfo}"` : ''}
        ${goldenTicketPrompt}

        SUPER-MUHIM TALABLAR (chuqurlikni qat'iy ta'minla):
        1)  MOATS (XANDAQLAR): har bo'limda (ayniqsa "unfairAdvantage", "marketingStrategy", "competitiveAnalysis") nusxa ko'chirishni qiyinlashtiradigan himoyalar (tarmoq effekti, eksklyuziv hamkorliklar, ma'lumotlarga asoslangan ustunlik, brend, o'ziga xos IP) qanday qurilishi va 12—24 oyda qanday mustahkamlanishi bosqichma-bosqich yozilsin.
        2)  GIPERMAHALLIYLASHTIRISH + GLOBAL MASSHTAB: O'zbekistonga moslashtirish (to'lov/loyiha jarayonlari, til, qonunchilik) va Markaziy Osiyo/Globalga chiqish strategiyasi aniq yozilsin. "projectRoadmap"da ichki -> mintaqaviy -> global fazalar ko'rsatilishi shart.
        3)  GROWTH HACKING: Telegram/Instagram/mahalliy influencerlar, referral dastur, hamjamiyatlar va offline hamkorliklar bo'yicha aniq, byudjetga sezgir (uzluksiz) taktikalar rejalari keltirilsin.
        4)  RAQAMLI CHUQUQLIK: Har bo'limda raqamlar, foizlar, segment ulushlari, taxminlar, KPI va o'lchovlar bilan yoz. Fikrlarni umumiy emas, amaliy va o'lchanadigan qil.
        5)  MONETIZATSIYA: LTV > 3x CAC tamoyiliga mos, har bir tarifda (kamida 3 ta) LTV va CAC bo'yicha taxminiy qiymatlar va ularni kamaytirish/oshirish taktikasi berilsin. Expansion Revenue imkoniyatlari yozilsin.

        MINIMAL TALABLAR (har biri bajarilishi shart):
        - leanCanvas.problem: kamida 5 aniq muammo
        - leanCanvas.solution: muammolarga mos kamida 5 yechim
        - leanCanvas.keyMetrics: kamida 6 KPI (MAU, MRR, ARPU, LTV, CAC, NPS va h.k.)
        - leanCanvas.customerSegments: kamida 5 segment (bitta segmentga nom + 1 jumla tavsif)
        - swotAnalysis: har bir toifa (S/W/O/T) kamida 6 band
        - competitiveAnalysis.competitors: kamida 5 raqib; har biri uchun kuchli/zaif tomonlar va "strategyToBeat" aniq bo'lsin
        - targetAudiencePersonas.personas: kamida 4 persona, har biri uchun demografiya, maqsadlar (≥5), pain points (≥5), hikoya
        - monetizationStrategy.pricingTiers: kamida 3 tarif (Free/Standard/Pro yoki mos), narx, funksiyalar (≥8 har birida), justification’da LTV/CAC hisob mantig'i bo‘lsin
        - financialProjections.revenueForecast: kamida 5 yil, yilma-yil ongli, bosqichma-bosqich o‘sish raqamlari FAQAT UZS (so'm)da; raqamlar NUMBER bo‘lsin (matn emas); 1–2-yillarda konservativ (2x–5x) o‘sish, keyin sekinlashish (1.5x–3x); har yil uchun ARPU, konversiyalar, churn/retention va foydalanuvchi soni bo‘yicha asos keltirilgan bo‘lsin; breakEvenAnalysis’da BEP oy/nuqta va asosiy farazlar aniq keltirilsin
        - marketingStrategy: targetAudience, kanallar (≥8), keyMessage; kanallar bo‘yicha 90 kunlik ijro rejasi
        - projectRoadmap.phases: kamida 4—6 faza; umumiy tasklar soni ≥ 20; task.id’lar unikal; dependencies ishlatilgan; sanalar realistik
        - riskAnalysis.risks: kamida 10 risk (likelihood/impact to'ldirilgan), mitigation amaliy va o‘lchanadigan
        - pitchDeck: kamida 15 slayd; har birida 5—8 bullet; "visualSuggestion" iloji bo'lsa qo‘shilsin
        - actionableChecklist: 12—20 bandli birinchi qadamlar

        PROJECT CHARTER (NIZOM) bo'limida quyidagilar aniq, UZOQ va keng ko'lamli bo'lsin (qisqa yozma):
        - mission: ijtimoiy/iqtisodiy ta'sir bilan; kamida 2 paragraf, aniq muammo va yechimga bog‘langan
        - vision: 3—5 yillik yo'l xaritasi; kamida 2 paragraf; hududiy (UZB → MO → Global) va mahsulot kengayishi bosqichma-bosqich
        - objectives: yillik (≥5) va choraklik (≥5) SMART maqsadlar; har birida o‘lchov, mas'ul va muddat
        - scope/outOfScope: aniq chegaralar; har biri (scope va outOfScope) ≥6 band; "must-do" va "not-now" ro‘yxatlari ajratilgan
        - successMetrics: KPI ro‘yxati (≥8) va ularning hisob formulalari/ma'lumot manbalari
        - governance/values/stakeholders/assumptions/constraints/dependencies/budgetOverview/successCriteria: har biri bo‘yicha amaliy, o‘lchanadigan, aniq matn; budgetOverview’da asosiy xarajat toifalari va taqsimot % lari

        FORMAT TALABLARI:
        - Natija JSON bo‘lsin va berilgan sxemaga mos kelishi shart.
        - Barcha matnlar ${languageNames[lang]} tilida.
        - Roadmap dagi task.id’lar unikal bo‘lsin.
        - ActionableChecklist dagi item.id’lar unikal bo‘lsin.
        - Matnda umumiy gaplardan qoch; har band amaliy va o‘lchanadigan bo‘lsin.
        - PitchDeck kamida 15 slayd bo‘lsin.
        - Valyuta: barcha moliyaviy raqamlar (daromad, ARPU va h.k.) UZS (so'm)da bo‘lsin; revenueForecast.revenue NUMBER bo‘lsin (matn emas, vergul/bo‘shliq qo‘ymang).
        - Realistiklik: yilma-yil o‘sishlar asoslangan bo‘lsin (bozor hajmi, konversiya, ARPU, churn/retention); fantastik 100x sakrashlardan qoch.
        - Unit economics: LTV, CAC, CAC payback (≤12 oy) va gross margin bo‘yicha qisqa hisob-mantiq keltirilsin.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: getSchema(lang),
        },
    });

    const jsonText = response.text;
    try {
        return JSON.parse(jsonText) as StartupIdea;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("Could not parse startup idea from Gemini response.");
    }
};


export const getAiMentorResponse = async (history: ChatMessage[], userInput: string, idea: StartupIdea, lang: Language): Promise<string> => {
    const ideaContext = JSON.stringify({
        projectName: idea.projectName,
        description: idea.description,
        leanCanvas: idea.leanCanvas,
        swotAnalysis: idea.swotAnalysis,
    }, null, 2);
    const systemInstruction = `Sen тажрибали AI biznes-mentorisan. Sening vazifang - foydalanuvchiga uning startap g'oyasi bo'yicha yordam berish. Foydalanuvchi bilan ${languageNames[lang]} tilida muloqot qil. Javoblaringni qisqa, aniq va amaliy maslahatlar bilan ber. Quyida foydalanuvchining startap g'oyasi haqidagi ma'lumotlar keltirilgan. Savollarga javob berishda shu ma'lumotlardan foydalan:\n\n${ideaContext}`;
    
    const chatHistory = history.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...chatHistory,
            { role: 'user', parts: [{ text: userInput }] }
        ],
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text;
};

export const getAiCoPilotResponse = async (taskContent: string, query: string, lang: Language): Promise<string> => {
    const prompt = `
        Sen AI Co-pilot yordamchisisan. Sening vazifang - startap vazifasini bajarishda yordam berish.
        Foydalanuvchining so'roviga qisqa, aniq va amaliy javob ber. Javobingni formatlashda markdown'dan foydalan.
        Javobni ${languageNames[lang]} tilida ber.

        Vazifa: "${taskContent}"
        Foydalanuvchi so'rovi: "${query}"
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
};

const aiSlideAnalysisSchema: any = {
    type: Type.OBJECT,
    properties: {
        keyMessage: { type: Type.STRING, description: "Slaydning asosiy xabari, investor uchun eng muhim nuqta." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Slaydning 2-3 ta kuchli tomoni." },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Slaydni yaxshilash uchun 2-3 ta aniq taklif." },
        visualSuggestion: { type: Type.STRING, description: "Slaydning vizual qismini kuchaytirish uchun tavsiya." },
        investorQuestion: { type: Type.STRING, description: "Ushbu slayddan kelib chiqib, investor berishi mumkin bo'lgan eng qiyin va kutilmagan savol." }
    },
    required: ['keyMessage', 'strengths', 'improvements', 'visualSuggestion', 'investorQuestion']
};

export const getAiSlideAnalysis = async (persona: string, slideContent: string, ideaContext: string, lang: Language): Promise<AISlideAnalysis> => {
    const prompt = `
        Sen ${persona} rolidagi tajribali investorsan. Quyidagi startap pitch-deck slaydini tahlil qil.
        Loyiha konteksti: ${ideaContext}

        Slayd mazmuni: "${slideContent}"

        Sening vazifang: Slaydni tanqidiy tahlil qilib, investor nuqtai nazaridan fikr-mulohaza berish.
        Javobni JSON formatida, yuqoridagi sxema asosida, ${languageNames[lang]} tilida qaytar.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: aiSlideAnalysisSchema,
        },
    });
    const jsonText = response.text;
    return JSON.parse(jsonText) as AISlideAnalysis;
};

const aiPitchHealthCheckSchema: any = {
    type: Type.OBJECT,
    properties: {
        readinessScore: { type: Type.INTEGER, description: "Taqdimotning investorga tayyorlik darajasi, 100 ballik tizimda." },
        summary: { type: Type.STRING, description: "Taqdimot haqida umumiy xulosa va birinchi taassurot." },
        strongestSlides: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Eng kuchli va ishonarli 2-3 ta slayd sarlavhasi." },
        weakestSlides: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Eng ko'p e'tibor talab qiladigan, zaif 2-3 ta slayd sarlavhasi." },
        strategicRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Taqdimotning umumiy strategiyasini yaxshilash uchun 2-3 ta amaliy maslahat." }
    },
    required: ['readinessScore', 'summary', 'strongestSlides', 'weakestSlides', 'strategicRecommendations']
};

export const getAiPitchHealthCheck = async (fullDeckContent: string, ideaContext: string, lang: Language): Promise<AIPitchHealthCheck> => {
    const prompt = `
        Sen tajribali venchur kapitalistsan. Quyidagi to'liq pitch-deck'ni tahlil qilib, uning "salomatligi" haqida xulosa ber.
        Loyiha konteksti: ${ideaContext}

        To'liq taqdimot mazmuni:
        ---
        ${fullDeckContent}
        ---

        Sening vazifang: Taqdimotni investitsiya jalb qilishga qanchalik tayyor ekanligini baholash.
        Javobni JSON formatida, yuqoridagi sxema asosida, ${languageNames[lang]} tilida qaytar.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: aiPitchHealthCheckSchema,
        },
    });
    const jsonText = response.text;
    return JSON.parse(jsonText) as AIPitchHealthCheck;
};

const pitchDeckSlideSuggestionSchema: any = {
    type: Type.OBJECT,
    properties: {
        rewrittenTitle: { type: Type.STRING, description: "Slayd uchun qayta yozilgan, investorga yo'naltirilgan sarlavha." },
        rewrittenContent: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Slayd mazmuni uchun qayta yozilgan, aniq va qisqa punktlar." },
        visualSuggestion: { type: Type.STRING, description: "Qayta yozilgan mazmunni qo'llab-quvvatlaydigan yangi vizual taklif." },
        justification: { type: Type.STRING, description: "Nima uchun bu o'zgarishlar qilinganligi va ular slaydni qanday kuchaytirishi haqida qisqa izoh." }
    },
    required: ['rewrittenTitle', 'rewrittenContent', 'visualSuggestion', 'justification']
};

export const rewritePitchDeckSlide = async (originalSlide: PitchDeckSlide, ideaContext: string, lang: Language): Promise<PitchDeckSlideSuggestion> => {
    const slideContent = `${originalSlide.title}: ${originalSlide.content.join('; ')}`;
    const prompt = `
        Sen jahon darajasidagi pitch-deck yozuvchisisan. Quyidagi slaydni investor uchun yanada ta'sirli va ishonarli qilib qayta yoz.
        Loyiha konteksti: ${ideaContext}

        Original slayd: "${slideContent}"

        Sening vazifang: Sarlavha va mazmunni qisqa, aniq va kuchli qilish.
        Javobni JSON formatida, yuqoridagi sxema asosida, ${languageNames[lang]} tilida qaytar.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: pitchDeckSlideSuggestionSchema,
        },
    });
    const jsonText = response.text;
    return JSON.parse(jsonText) as PitchDeckSlideSuggestion;
};

export const getMarketTrendAlert = async (ideaContext: string, lang: Language): Promise<string> => {
    const prompt = `
        Sen bozor tahlilchisi bo'lgan AI'san. Quyidagi startap konteksti uchun O'zbekiston bozoridagi eng so'nggi (oxirgi 1-3 oy) yangiliklar, trendlar, imkoniyatlar yoki xavflarni Google Qidiruv yordamida top va qisqa, 2-3 jumlali "Alert" (ogohlantirish) yarat.
        Javobingda faqat shu alert matnini ${languageNames[lang]} tilida yoz. Formatlash uchun markdown'dan foydalan. Masalan, sarlavha uchun **bold**.

        Startap konteksti: ${ideaContext}
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    return response.text.trim();
};

const optimizedMonetizationSuggestionSchema: any = {
    type: Type.OBJECT,
    properties: {
        optimizedTiers: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.STRING },
                    features: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['name', 'price', 'features']
            },
            description: "Qiymatga asoslangan va raqobatchilardan ustun bo'lgan optimallashtirilgan narx rejalari."
        },
        justification: { type: Type.STRING, description: "Bu o'zgarishlar nima uchun qilinganligi va ular daromadni qanday oshirishi haqida batafsil asos." }
    },
    required: ['optimizedTiers', 'justification']
};

export const optimizeMonetizationStrategy = async (
    competitiveAnalysis: CompetitiveAnalysis,
    targetAudience: TargetAudiencePersonas,
    currentStrategy: MonetizationStrategy,
    lang: Language
): Promise<OptimizedMonetizationSuggestion> => {
    const context = JSON.stringify({ competitiveAnalysis, targetAudience, currentStrategy });
    const prompt = `
        Sen narxlash strategiyasi bo'yicha mutaxassis bo'lgan AI'san. O'zbekiston bozori uchun quyidagi startapning monetizatsiya strategiyasini tahlil qil va uni optimallashtir.
        Kontekst: ${context}

        Sening vazifang: Joriy tarif rejalarini (pricing tiers) tahlil qilib, mijoz segmentlari, raqobatchilar va qiymat taklifiga asoslangan holda yangi, optimallashtirilgan tarif rejalarini taklif qilish.
        Javobni JSON formatida, yuqoridagi sxema asosida, ${languageNames[lang]} tilida qaytar.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: optimizedMonetizationSuggestionSchema,
        },
    });
    const jsonText = response.text;
    return JSON.parse(jsonText) as OptimizedMonetizationSuggestion;
};

const strategicReviewSchema: any = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "Biznes-reja va joriy bozor holati haqida umumiy strategik xulosa." },
        suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    area: { type: Type.STRING, description: "Tavsiya tegishli bo'lgan soha (masalan, Marketing, Mahsulot, Jamoa)." },
                    observation: { type: Type.STRING, description: "Google Qidiruv ma'lumotlariga asoslangan holda qilingan kuzatuv yoki topilgan imkoniyat/xavf." },
                    recommendation: { type: Type.STRING, description: "Kuzatuvdan kelib chiqib, biznesni rivojlantirish uchun aniq, amaliy tavsiya." }
                },
                required: ['area', 'observation', 'recommendation']
            }
        }
    },
    required: ['summary', 'suggestions']
};

export const getStrategicReview = async (idea: StartupIdea, lang: Language): Promise<{ review: StrategicReview; sources: any[] }> => {
    const ideaContext = JSON.stringify({
        projectName: idea.projectName,
        description: idea.description,
        industry: idea.leanCanvas.customerSegments.join(', '),
        businessModel: idea.leanCanvas.revenueStreams.join(', '),
    });
    const prompt = `
        Sen strategik maslahatchi bo'lgan AI'san. O'zbekiston bozori uchun quyidagi startap g'oyasini Google Qidiruv yordamida tahlil qil va strategik tavsiyalar ber.
        Kontekst: ${ideaContext}

        Sening vazifang: Eng so'nggi bozor tendensiyalari, yangi texnologiyalar yoki raqobatchilar faoliyatini tahlil qilib, startap uchun o'sish imkoniyatlari yoki potentsial xavflarni aniqlash.
        Har bir tavsiyangni aniq kuzatuv (observation) bilan asosla.
        Javobni JSON formatida, yuqoridagi sxema asosida, ${languageNames[lang]} tilida qaytar.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: strategicReviewSchema,
        },
    });
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || [];
    const jsonText = response.text;
    const review = JSON.parse(jsonText) as StrategicReview;
    return { review, sources };
};

const answerFeedbackSchema: any = {
    type: Type.OBJECT,
    properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Javobning 1-2 ta kuchli, ishonarli tomoni." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Javobning 1-2 ta zaif, investorga yoqmasligi mumkin bo'lgan tomoni." },
        suggestedImprovement: { type: Type.STRING, description: "Javobni yanada kuchliroq qilish uchun aniq, qayta yozilgan variant yoki maslahat." }
    },
    required: ['strengths', 'weaknesses', 'suggestedImprovement']
};

export const getAnswerFeedback = async (question: string, answer: string, ideaContext: string, lang: Language): Promise<AnswerFeedback> => {
    const prompt = `
        Sen tajribali investor va pitch-trener bo'lgan AI'san. Quyidagi savol-javobni tahlil qilib, konstruktiv fikr-mulohaza ber.
        Loyiha konteksti: ${ideaContext}

        Investor savoli: "${question}"
        Startap asoschisining javobi: "${answer}"

        Sening vazifang: Javobni investor nuqtai nazaridan tahlil qilish. U ishonarlimi? Aniqmi? O'ziga ishongan holda aytilganmi?
        Javobni JSON formatida, yuqoridagi sxema asosida, ${languageNames[lang]} tilida qaytar.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: answerFeedbackSchema,
        },
    });
    const jsonText = response.text;
    return JSON.parse(jsonText) as AnswerFeedback;
};