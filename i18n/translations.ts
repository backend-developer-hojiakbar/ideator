

export const translations = {
  'uz-Latn': {
    // GENERAL
    back: 'Orqaga',
    error: 'Xatolik',
    loading: 'Yuklanmoqda...',
    generate: 'Yaratish',
    close: 'Yopish',
    apply: 'Qo\'llash',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    optional: '(ixtiyoriy)',
    all: 'Barchasi',
    notifications: 'Bildirishnomalar',
    noNotifications: 'Hozircha bildirishnomalar yo\'q',
    markAsRead: 'Barchasini o\'qilgan deb belgilash',


    // AUTH PAGE
    auth: {
      title: "G'oya Mashinasi",
      subtitle: "Startap olamiga xush kelibsiz!",
      loginTab: "Kirish",
      registerTab: "Ro'yxatdan o'tish",
      emailLabel: 'Telefon raqam',
      passwordLabel: 'Parol',
      loginButton: "Kirish",
      registerButton: "Ro'yxatdan o'tish",
      footer: ["© 2025 | Ishlab chiqargan ", " • Qo'llab-quvvatlovchi ", ""]
    },
    
    // TOP UP PAGE
    topUp: {
      title: "Hisobni to'ldirish",
      currentBalance: "Joriy hisobingiz: {0} so'm",
      selectAmount: "To'ldirish summasini tanlang:",
      paymentDetailsTitle: "To'lov Tafsilotlari",
      uploadReceipt: "Chekni yuklang",
      uploadButton: "Fayl tanlang",
      noFileSelected: "Fayl tanlanmadi",
      confirmPayment: "Men to'lov qildim, Tasdiqlash",
      pendingConfirmationTitle: "Tasdiqlash kutilmoqda",
      pendingConfirmationMessage: "To'lovingiz qabul qilindi va hozirda adminlar tomonidan tekshirilmoqda. Tasdiqlangandan so'ng hisobingizga pul o'tkaziladi va sizga bildirishnoma yuboriladi. Rahmat!",
      goBackToDashboard: "Boshqaruv paneliga qaytish",
      
      instructionCardNumber: "KARTA RAQAMI:",
      instructionAmount: "O'TKAZMA SUMMASI:",
      instructionCopy: "Nusxalash",
      copied: "Nusxalandi!",
      promoCodeLabel: "Promo-kod",
      promoCodePlaceholder: "Masalan: START10",

      warningTitle: "DIQQAT!!!",
      warning1: "Platforma sizga aytgan summani oxirgi raqamlari bilan birga to'liq o'tkazing!",
      warning2: "Ko'p ham, kam ham o'tkazmang. Aks holda, to'lov avtomatik tarzda o'tmaydi.",
      warning3: "Quyidagi kartaga o'tkazganingizdan so'ng, to'lov chekini yuklang va tasdiqlash tugmasini bosing.",
      warning4: "Agar xato qilib, boshqa summani o‘tkazsangiz, pulingiz 7 bank ish kuni ichida qaytariladi!",
      warningExampleWrong: "BUNI O'TKAZMANG: {0} UZS ❌",
      warningExampleCorrect: "BUNI O'TKAZING: {0} UZS ✅",
      
      successfulTopUp: "{0} so'm hisobingizga qo'shildi!",
      
      notificationTitle: "Hisobingiz to'ldirildi!",
      notificationMessage: "{0} so'm muvaffaqiyatli qabul qilindi. Bonus sifatida sizga {1} so'm cashback berildi. Umumiy: {2} so'm.",
    },

    // MAIN LAYOUT
    mainLayout: {
      navDashboard: "Mening G'oyalarim",
      navMarketplace: "Startaperlar Dunyosi",
      navPartners: "Hamkorlar",
      navLister: "Loyihani Joylash",
      logout: "Chiqish",
      balance: "{0} so'm",
      topUp: "Hisobni to'ldirish",
    },

    // DASHBOARD PAGE
    dashboard: {
        title: "Mening G'oyalarim",
        newIdeaButton: "Yangi G'oya",
        noProjectsTitle: "Hozircha g'oyalaringiz yo'q",
        noProjectsSubtitle: "Birinchi startap g'oyangizni yaratish uchun yuqoridagi tugmani bosing!"
    },

    // INVESTOR MARKETPLACE
    marketplace: {
        title: "Startaperlar Dunyosi",
        subtitle: "O'zbekistonning eng istiqbolli startaplarini kashf eting.",
        searchPlaceholder: "Loyiha nomi bo'yicha qidirish...",
        filterIndustry: "Soha",
        filterFunding: "Sarmoya miqdori",
        fundingRanges: ["Barchasi", "100M so'mgacha", "100M - 500M so'm", "500M - 1B so'm", "1B+ so'm"],
        noProjectsFound: "Hech qanday loyiha topilmadi",
        noProjectsFoundDesc: "Qidiruv yoki filtr sozlamalarini o'zgartirib ko'ring.",
        noProjectsTitle: "Hozircha ochiq loyihalar yo'q",
        noProjectsSubtitle: "Bozorga yangi startaplar qo'shilishi bilan bu yerda paydo bo'ladi.",
        fundingSought: "Sarmoya",
        equityOffered: "Taklif (ulush)",
        contact: "Bog'lanish"
    },

    partners: {
      title: "Hamkor Tashkilotlar",
      subtitle: "Biz bilan hamkorlik qilayotgan kompaniyalar",
      contactPerson: "Mas'ul shaxs",
      contact: "Kontakt",
      website: "Veb-sayt"
    },

    // LIST PROJECT PAGE
    listProject: {
        title: "Loyihani Investitsiyaga Chiqarish",
        subtitle: "Startapingizni investorlarga taqdim eting va keyingi bosqichga o'tish uchun sarmoya jalb qiling.",
        formTitle: "Listing Ma'lumotlari",
        previewTitle: "Ko'rib chiqish",
        noProjects: "Joylash uchun loyihalar yo'q",
        noProjectsDesc: "Avval \"Mening G'oyalarim\" bo'limida yangi loyiha yarating.",
        selectProject: "Loyiha tanlang",
        selectProjectPlaceholder: "Qaysi loyihani joylamoqchisiz?",
        fundingLabel: "So'ralayotgan sarmoya (so'm)",
        equityLabel: "Taklif qilinayotgan ulush (%)",
        pitchLabel: "Qisqacha Pitch (Investor uchun)",
        pitchPlaceholder: "Loyiha, jamoa va bozor imkoniyatlari haqida qisqacha yozing...",
        errorAllFields: "Iltimos, barcha maydonlarni to'ldiring.",
        errorNotFound: "Loyiha topilmadi.",
        errorAlreadyListed: "Bu loyiha allaqachon investorlar markaziga joylangan.",
        successMessage: "\"{0}\" loyihasi Investorlar Markaziga muvaffaqiyatli joylandi!",
        submitButton: "Loyihani Joylashtirish",
    },
    
    // CONFIG STEP
    configStep: {
      title: "G'oya Parametrlari",
      subtitle: "AI'ga o'zingizning ideal startapingizni yaratishda yordam bering.",
      insufficientFunds: "G'oya yaratish uchun hisobingizda yetarli mablag' (10,000 so'm) mavjud emas. Iltimos, hisobingizni to'ldiring.",
      generationError: "G'oya yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      industryLabel: "Soha",
      industryPlaceholder: "Namuna: E-tijorat, AgroTex, FinTex",
      topicLabel: "G'oya mavzusi",
      topicPlaceholder: "Namuna: O'zbekistonda yasalgan qo'l mehnati mahsulotlari uchun onlayn bozor",
      infoLabel: "Qisqacha ma'lumot",
      infoPlaceholder: "Namuna: Samarqandlik hunarmandlarni global xaridorlar bilan bog'laydigan platforma. Asosiy e'tibor - haqiqiylik va hikoyalar.",
      investmentLabel: "Boshlang'ich Sarmoya",
      investmentPlaceholder: "Namuna: $1000 - $5000",
      complexityLabel: "Texnik Murakkablik",
      complexityLevels: ['Oson MVP', 'O\'rta murakkablik', 'Murakkab texnologiya'],
      businessModelLabel: "Biznes Model",
      businessModels: ['B2C (Mijoz uchun)', 'B2B (Biznes uchun)', 'Obuna', 'Marketpleys', 'SaaS (Dasturiy xizmat)', 'Freemium', 'Reklama', 'Tranzaksiya to\'lovlari'],
      goldenTicketLabel: "Oltin Bilet",
      goldenTicketDesc: "O'zbekistondagi yirik kompaniyalarning real muammolariga yechim taklif qiling.",
      generateButton: "G'oya Yaratish (10,000 so'm)",
    },
    
    // GENERATING STEP
    generatingStep: {
        title: "G'oyangiz tayyorlanmoqda...",
        steps: [
            "Bozor tendensiyalari tahlil qilinmoqda...",
            "Noyob qiymat taklifi aniqlanmoqda...",
            "Raqobatchilar tahlil qilinmoqda...",
            "Mijozlar portreti yaratilmoqda...",
            "'Lean Canvas' tuzilmasi shakllantirilmoqda...",
            "SWOT va PESTLE tahlillari o'tkazilmoqda...",
            "Moliyaviy modellar tuzilmoqda...",
            "Marketing va sotuv strategiyasi yaratilmoqda...",
            "Loyiha yo'l xaritasi (Gantt) chizilmoqda...",
            "Investorlar uchun taqdimot tayyorlanmoqda...",
            "Yuridik andozalar generatsiya qilinmoqda...",
            "Brending to'plami dizayn qilinmoqda...",
            "Yakuniy hujjatlar birlashtirilmoqda..."
        ]
    },

    // WORKSPACE
    workspace: {
        projectUpdated: "Loyiha muvaffaqiyatli yangilandi!",
        downloadTooltip: "Biznes-rejani yuklab olish (.docx)",
        shareTooltip: "Ulashish (tez kunda)",
        chatTooltip: "AI Mentor bilan suhbat",
        // Sidebar
        nav: {
            dashboard: "Boshqaruv Paneli",
            kanban: "Loyiha Markazi",
            legal: "Yuridik Hujjatlar",
            accelerator: "Akselerator",
            pitch: "AI Investor Simulyatori",
            investorPrep: "Investorga Tayyorgarlik",
            radar: "Bozor Radari",
        },
        // Dashboard Content
        dashboardContent: {
            strategicReviewTitle: "AI Strategik Tahlil",
            strategicReviewDesc: "Bozor tendensiyalari va raqobatchilar tahliliga asoslanib, AI dan biznes-rejangizni yaxshilash uchun strategik tavsiyalar oling. Bu jarayon bir daqiqagacha vaqt olishi mumkin.",
            startStrategicReview: "Strategik Tahlilni Boshlash",
            uvpTitle: "Noyob Qiymat Taklifi (UVP)",
            personasTitle: "Maqsadli Auditoriya Personajlari",
            competitorAnalysisTitle: "Raqobatchilar Tahlili",
            monetizationTitle: "Monetizatsiya Strategiyasi",
            optimizePrice: "Narxni Optimizatsiya",
            swotTitle: "SWOT Tahlili",
            financialsTitle: "Moliyaviy Prognozlar",
            teamTitle: "Jamoa Tuzilmasi",
            roadmapTitle: "Loyiha Yo'l Xaritasi",
            risksTitle: "Risklar Tahlili",
            checklistTitle: "Birinchi Qadamlar ro'yxati",
            brandingTitle: "Brending Asoslari"
        }
    },

  },
  'uz-Cyrl': {
    // GENERAL
    back: 'Орқага',
    error: 'Хатолик',
    loading: 'Юкланмоқда...',
    generate: 'Яратиш',
    close: 'Ёпиш',
    apply: 'Қўллаш',
    cancel: 'Бекор қилиш',
    save: 'Сақлаш',
    optional: '(ихтиёрий)',
    all: 'Барчаси',
    notifications: 'Билдиришномалар',
    noNotifications: 'Ҳозирча билдиришномалар йўқ',
    markAsRead: 'Барчасини ўқилган деб белгилаш',

    // AUTH PAGE
    auth: {
      title: "Ғоя Машинаси",
      subtitle: "Стартап оламига хуш келибсиз!",
      loginTab: "Кириш",
      registerTab: "Рўйхатдан ўтиш",
      emailLabel: 'Телефон рақами',
      passwordLabel: 'Парол',
      loginButton: "Кириш",
      registerButton: "Рўйхатдан ўтиш",
      footer: ["© 2025 | Ишлаб чиқарган ", " • Қўллаб-қувватловчи ", ""]
    },
    
    // TOP UP PAGE
    topUp: {
      title: "Ҳисобни тўлдириш",
      currentBalance: "Жорий ҳисобингиз: {0} сўм",
      selectAmount: "Тўлдириш суммасини танланг:",
      paymentDetailsTitle: "Тўлов Тафсилотлари",
      uploadReceipt: "Чекни юкланг",
      uploadButton: "Файл танланг",
      noFileSelected: "Файл танланмади",
      confirmPayment: "Мен тўлов қилдим, Тасдиқлаш",
      pendingConfirmationTitle: "Тасдиқлаш кутилмоқда",
      pendingConfirmationMessage: "Тўловингиз қабул қилинди ва ҳозирда админлар томонидан текширилмоқда. Тасдиқлангандан сўнг ҳисобингизга пул ўтказилади ва сизга билдиришнома юборилади. Раҳмат!",
      goBackToDashboard: "Бошқарув панелига қайтиш",

      instructionCardNumber: "КАРТА РАҚАМИ:",
      instructionAmount: "ЎТКАЗМА СУММАСИ:",
      instructionCopy: "Нусхалаш",
      copied: "Нусхаланди!",

      warningTitle: "ДИҚҚАТ!!!",
      warning1: "Платформа сизга айтган суммани охирги рақамлари билан бирга тўлиқ ўтказинг!",
      warning2: "Кўп ҳам, кам ҳам ўтказманг. Акс ҳолда, тўлов автоматик тарзда ўтмайди.",
      warning3: "Қуйидаги картага ўтказганингиздан сўнг, тўлов чекини юкланг ва тасдиқлаш тугмасини босинг.",
      warning4: "Агар хато қилиб, бошқа суммани ўтказсангиз, пулингиз 7 банк иш куни ичида қайтарилади!",
      warningExampleWrong: "БУНИ ЎТКАЗМАНГ: {0} UZS ❌",
      warningExampleCorrect: "БУНИ ЎТКАЗИНГ: {0} UZS ✅",

      successfulTopUp: "{0} сўм ҳисобингизга қўшилди!",

      notificationTitle: "Ҳисобингиз тўлдирилди!",
      notificationMessage: "{0} сўм муваффақиятли қабул қилинди. Бонус сифатида сизга {1} сўм cashback берилди. Умумий: {2} сўм.",
    },
    
    // MAIN LAYOUT
    mainLayout: {
      navDashboard: "Менинг Ғояларим",
      navMarketplace: "Стартаперлар Дунёси",
      navPartners: "Ҳамкорлар",
      navLister: "Лойиҳани Жойлаш",
      logout: "Чиқиш",
      balance: "{0} сўм",
      topUp: "Ҳисобни тўлдириш",
    },

    // DASHBOARD PAGE
    dashboard: {
        title: "Менинг Ғояларим",
        newIdeaButton: "Янги Ғоя",
        noProjectsTitle: "Ҳозирча ғояларингиз йўқ",
        noProjectsSubtitle: "Биринчи стартап ғоянгизни яратиш учун юқоридаги тугмани босинг!"
    },

    // INVESTOR MARKETPLACE
    marketplace: {
        title: "Стартаперлар Дунёси",
        subtitle: "Ўзбекистоннинг энг истиқболли стартапларини кашф этинг.",
        searchPlaceholder: "Лойиҳа номи бўйича қидириш...",
        filterIndustry: "Соҳа",
        filterFunding: "Сармоя миқдори",
        fundingRanges: ["Барчаси", "100М сўмгача", "100М - 500М сўм", "500М - 1Б сўм", "1Б+ сўм"],
        noProjectsFound: "Ҳеч қандай лойиҳа топилмади",
        noProjectsFoundDesc: "Қидирув ёки фильтр созламаларини ўзгартириб кўринг.",
        noProjectsTitle: "Ҳозирча очиқ лойиҳалар йўқ",
        noProjectsSubtitle: "Бозорга янги стартаплар қўшилиши билан бу ерда пайдо бўлади.",
        fundingSought: "Сармоя",
        equityOffered: "Таклиф (улуш)",
        contact: "Боғланиш"
    },

    partners: {
      title: "Ҳамкор Ташкилотлар",
      subtitle: "Биз билан ҳамкорлик қилаётган компаниялар",
      contactPerson: "Мас'ул шахс",
      contact: "Контакт",
      website: "Веб-сайт"
    },

     // LIST PROJECT PAGE
    listProject: {
        title: "Лойиҳани Инвестицияга Чиқариш",
        subtitle: "Стартапингизни инвесторларга тақдим этинг ва кейинги босқичга ўтиш учун сармоя жалб қилинг.",
        formTitle: "Листинг Маълумотлари",
        previewTitle: "Кўриб чиқиш",
        noProjects: "Жойлаш учун лойиҳалар йўқ",
        noProjectsDesc: "Аввал \"Менинг Ғояларим\" бўлимида янги лойиҳа яратинг.",
        selectProject: "Лойиҳа танланг",
        selectProjectPlaceholder: "Қайси лойиҳани жойламоқчисиз?",
        fundingLabel: "Сўралаётган сармоя (сўм)",
        equityLabel: "Таклиф қилинаётган улуш (%)",
        pitchLabel: "Қисқача Питч (Инвестор учун)",
        pitchPlaceholder: "Лойиҳа, жамоа ва бозор имкониятлари ҳақида қисқача ёзинг...",
        errorAllFields: "Илтимос, барча майдонларни тўлдиринг.",
        errorNotFound: "Лойиҳа топилмади.",
        errorAlreadyListed: "Бу лойиҳа аллақачон инвесторлар марказига жойланган.",
        successMessage: "\"{0}\" лойиҳаси Инвесторлар Марказига муваффақиятли жойланди!",
        submitButton: "Лойиҳани Жойлаштириш",
    },

    // CONFIG STEP
    configStep: {
      title: "Ғоя Параметрлари",
      subtitle: "AI'га ўзингизнинг идеал стартапингизни яратишда ёрдам беринг.",
      insufficientFunds: "Ғоя яратиш учун ҳисобингизда етарли маблағ (10,000 сўм) мавжуд эмас. Илтимос, ҳисобингизни тўлдиринг.",
      generationError: "Ғоя яратишда хатолик юз берди. Илтимос, қайта уриниб кўринг.",
      industryLabel: "Соҳа",
      industryPlaceholder: "Намуна: Э-тижорат, АгроТех, ФинТех",
      topicLabel: "Ғоя мавзуси",
      topicPlaceholder: "Намуна: Ўзбекистонда ясалган қўл меҳнати маҳсулотлари учун онлайн бозор",
      infoLabel: "Қисқача маълумот",
      infoPlaceholder: "Намуна: Самарқандлик ҳунармандларни глобал харидорлар билан боғлайдиган платформа. Асосий эътибор - ҳақиқийлик ва ҳикоялар.",
      investmentLabel: "Бошланғич Сармоя",
      investmentPlaceholder: "Намуна: $1000 - $5000",
      complexityLabel: "Техник Мураккаблик",
      complexityLevels: ['Осон MVP', 'Ўрта мураккаблик', 'Мураккаб технология'],
      businessModelLabel: "Бизнес Модел",
      businessModels: ['B2C (Мижоз учун)', 'B2B (Бизнес учун)', 'Обуна', 'Маркетплейс', 'SaaS (Дастурий хизмат)', 'Freemium', 'Реклама', 'Транзакция тўловлари'],
      goldenTicketLabel: "Олтин Билет",
      goldenTicketDesc: "Ўзбекистондаги йирик компанияларнинг реал муаммоларига ечим таклиф қилинг.",
      generateButton: "Ғоя Яратиш (10,000 сўм)",
    },

    // GENERATING STEP
    generatingStep: {
        title: "Ғоянгиз тайёрланмоқда...",
        steps: [
            "Бозор тенденциялари таҳлил қилинмоқда...",
            "Ноёб қиймат таклифи аниқланмоқда...",
            "Рақобатчилар таҳлил қилинмоқда...",
            "Мижозлар портрети яратилмоқда...",
            "'Lean Canvas' тузилмаси шакллантирилмоқда...",
            "SWOT ва PESTLE таҳлиллари ўтказилмоқда...",
            "Молиявий моделлар тузилмоқда...",
            "Маркетинг ва сотув стратегияси яратилмоқда...",
            "Лойиҳа йўл харитаси (Gantt) чизилмоқда...",
            "Инвесторлар учун тақдимот тайёрланмоқда...",
            "Юридик андозалар генерация қилинмоқда...",
            "Брендинг тўплами дизайн қилинмоқда...",
            "Якуний ҳужжатлар бирлаштирилмоқда..."
        ]
    },

    // WORKSPACE
    workspace: {
        projectUpdated: "Лойиҳа муваффақиятли янгиланди!",
        downloadTooltip: "Бизнес-режани юклаб олиш (.docx)",
        shareTooltip: "Улашиш (тез кунда)",
        chatTooltip: "AI Ментор билан суҳбат",
        // Sidebar
        nav: {
            dashboard: "Бошқарув Панели",
            kanban: "Лойиҳа Маркази",
            legal: "Юридик Ҳужжатлар",
            accelerator: "Акселератор",
            pitch: "AI Инвестор Симулятори",
            investorPrep: "Инвесторга Тайёргарлик",
            radar: "Бозор Радари",
        },
        // Dashboard Content
        dashboardContent: {
            strategicReviewTitle: "AI Стратегик Таҳлил",
            strategicReviewDesc: "Бозор тенденциялари ва рақобатчилар таҳлилига асосланиб, AI дан бизнес-режангизни яхшилаш учун стратегик тавсиялар олинг. Бу жараён бир дақиқагача вақт олиши мумкин.",
            startStrategicReview: "Стратегик Таҳлилни Бошлаш",
            uvpTitle: "Ноёб Қиймат Таклифи (UVP)",
            personasTitle: "Мақсадли Аудитория Персоналари",
            competitorAnalysisTitle: "Рақобатчилар Таҳлили",
            monetizationTitle: "Монетизация Стратегияси",
            optimizePrice: "Нархни Оптимизация",
            swotTitle: "SWOT Таҳлили",
            financialsTitle: "Молиявий Прогнозлар",
            teamTitle: "Жамоа Тузилмаси",
            roadmapTitle: "Лойиҳа Йўл Харитаси",
            risksTitle: "Рисклар Таҳлили",
            checklistTitle: "Биринчи Қадамлар рўйхати",
            brandingTitle: "Брендинг Асослари"
        }
    },
  },
  'ru': {
    // GENERAL
    back: 'Назад',
    error: 'Ошибка',
    loading: 'Загрузка...',
    generate: 'Создать',
    close: 'Закрыть',
    apply: 'Применить',
    cancel: 'Отмена',
    save: 'Сохранить',
    optional: '(необязательно)',
    all: 'Все',
    notifications: 'Уведомления',
    noNotifications: 'Пока нет уведомлений',
    markAsRead: 'Отметить все как прочитанные',

    // AUTH PAGE
    auth: {
      title: "Машина Идей",
      subtitle: "Добро пожаловать в мир стартапов!",
      loginTab: "Вход",
      registerTab: "Регистрация",
      emailLabel: 'Телефон',
      passwordLabel: 'Пароль',
      loginButton: "Войти",
      registerButton: "Зарегистрироваться",
      footer: ["© 2025 | Разработано ", " • При поддержке ", ""]
    },
    
    // TOP UP PAGE
    topUp: {
      title: "Пополнить счет",
      currentBalance: "Текущий баланс: {0} сум",
      selectAmount: "Выберите сумму пополнения:",
      paymentDetailsTitle: "Детали Платежа",
      uploadReceipt: "Загрузите квитанцию",
      uploadButton: "Выбрать файл",
      noFileSelected: "Файл не выбран",
      confirmPayment: "Я оплатил, Подтвердить",
      pendingConfirmationTitle: "Ожидание подтверждения",
      pendingConfirmationMessage: "Ваш платеж получен и в настоящее время проверяется администраторами. После подтверждения средства будут зачислены на ваш счет, и вы получите уведомление. Спасибо!",
      goBackToDashboard: "Вернуться на панель управления",

      instructionCardNumber: "НОМЕР КАРТЫ:",
      instructionAmount: "СУММА ПЕРЕВОДА:",
      instructionCopy: "Копировать",
      copied: "Скопировано!",
      promoCodeLabel: "Промокод",
      promoCodePlaceholder: "Напр.: START10",

      warningTitle: "ВНИМАНИЕ!!!",
      warning1: "Переводите точную сумму, указанную платформой, включая копейки!",
      warning2: "Не переводите больше или меньше. В противном случае платеж не будет обработан автоматически.",
      warning3: "После перевода на указанную ниже карту, загрузите квитанцию об оплате и нажмите кнопку подтверждения.",
      warning4: "Если вы ошибочно переведете другую сумму, мы вернем вам деньги в течение 7 банковских дней!",
      warningExampleWrong: "НЕ ПЕРЕВОДИТЕ ЭТО: {0} UZS ❌",
      warningExampleCorrect: "ПЕРЕВЕДИТЕ ЭТО: {0} UZS ✅",

      successfulTopUp: "{0} сум добавлено на ваш счет!",

      notificationTitle: "Ваш счет пополнен!",
      notificationMessage: "{0} сум успешно получено. В качестве бонуса мы начислили вам {1} сум кэшбэка. Итого: {2} сум.",
    },
    
    // MAIN LAYOUT
    mainLayout: {
      navDashboard: "Мои Идеи",
      navMarketplace: "Мир Стартаперов",
      navPartners: "Партнеры",
      navLister: "Разместить Проект",
      logout: "Выйти",
      balance: "{0} сум",
      topUp: "Пополнить",
    },

    // DASHBOARD PAGE
    dashboard: {
        title: "Мои Идеи",
        newIdeaButton: "Новая Идея",
        noProjectsTitle: "У вас пока нет идей",
        noProjectsSubtitle: "Нажмите кнопку выше, чтобы создать свою первую стартап-идею!"
    },
    
    // INVESTOR MARKETPLACE
    marketplace: {
        title: "Мир Стартаперов",
        subtitle: "Откройте для себя самые перспективные стартапы Узбекистана.",
        searchPlaceholder: "Поиск по названию проекта...",
        filterIndustry: "Сфера",
        filterFunding: "Сумма инвестиций",
        fundingRanges: ["Все", "До 100М сум", "100М - 500М сум", "500М - 1Б сум", "1Б+ сум"],
        noProjectsFound: "Проектов не найдено",
        noProjectsFoundDesc: "Попробуйте изменить параметры поиска или фильтров.",
        noProjectsTitle: "Пока нет активных проектов",
        noProjectsSubtitle: "Новые стартапы появятся здесь по мере их добавления на рынок.",
        fundingSought: "Инвестиции",
        equityOffered: "Предложение (доля)",
        contact: "Связаться"
    },

    partners: {
      title: "Партнерские Организации",
      subtitle: "Компании, сотрудничающие с нами",
      contactPerson: "Контактное лицо",
      contact: "Контакт",
      website: "Веб-сайт"
    },
    
    // LIST PROJECT PAGE
    listProject: {
        title: "Разместить Проект для Инвестиций",
        subtitle: "Представьте свой стартап инвесторам и привлеките финансирование для перехода на следующий уровень.",
        formTitle: "Информация для Листинга",
        previewTitle: "Предпросмотр",
        noProjects: "Нет проектов для размещения",
        noProjectsDesc: "Сначала создайте новый проект в разделе \"Мои Идеи\".",
        selectProject: "Выберите проект",
        selectProjectPlaceholder: "Какой проект вы хотите разместить?",
        fundingLabel: "Запрашиваемые инвестиции (сум)",
        equityLabel: "Предлагаемая доля (%)",
        pitchLabel: "Краткий Питч (для инвестора)",
        pitchPlaceholder: "Кратко опишите проект, команду и рыночные возможности...",
        errorAllFields: "Пожалуйста, заполните все поля.",
        errorNotFound: "Проект не найден.",
        errorAlreadyListed: "Этот проект уже размещен на рынке инвесторов.",
        successMessage: "Проект \"{0}\" успешно размещен на Рынке Инвесторов!",
        submitButton: "Разместить Проект",
    },

    // CONFIG STEP
    configStep: {
      title: "Параметры Идеи",
      subtitle: "Помогите ИИ создать ваш идеальный стартап.",
      insufficientFunds: "Недостаточно средств на счете для создания идеи (10,000 сум). Пожалуйста, пополните баланс.",
      generationError: "Произошла ошибка при создании идеи. Пожалуйста, попробуйте еще раз.",
      industryLabel: "Сфера",
      industryPlaceholder: "Пример: E-commerce, AgroTex, FinTex",
      topicLabel: "Тема идеи",
      topicPlaceholder: "Пример: Онлайн-рынок для изделий ручной работы из Узбекистана",
      infoLabel: "Краткая информация",
      infoPlaceholder: "Пример: Платформа, соединяющая ремесленников из Самарканда с глобальными покупателями. Акцент на аутентичности и историях.",
      investmentLabel: "Начальные инвестиции",
      investmentPlaceholder: "Пример: $1000 - $5000",
      complexityLabel: "Техническая сложность",
      complexityLevels: ['Простой MVP', 'Средняя сложность', 'Сложная технология'],
      businessModelLabel: "Бизнес-модель",
      businessModels: ['B2C (Для клиента)', 'B2B (Для бизнеса)', 'Подписка', 'Маркетплейс', 'SaaS (ПО как услуга)', 'Freemium', 'Реклама', 'Транзакционные сборы'],
      goldenTicketLabel: "Золотой Билет",
      goldenTicketDesc: "Предложите решение реальных проблем крупных компаний Узбекистана.",
      generateButton: "Создать Идею (10,000 сум)",
    },
    
     // GENERATING STEP
    generatingStep: {
        title: "Ваша идея готовится...",
        steps: [
            "Анализ рыночных тенденций...",
            "Определение уникального ценностного предложения...",
            "Анализ конкурентов...",
            "Создание портрета клиента...",
            "Формирование 'Lean Canvas'...",
            "Проведение SWOT и PESTLE анализа...",
            "Построение финансовых моделей...",
            "Создание маркетинговой и сбытовой стратегии...",
            "Разработка дорожной карты проекта (Gantt)...",
            "Подготовка презентации для инвесторов...",
            "Генерация юридических шаблонов...",
            "Разработка набора для брендинга...",
            "Сведение итоговых документов..."
        ]
    },
    
    // WORKSPACE
    workspace: {
        projectUpdated: "Проект успешно обновлен!",
        downloadTooltip: "Скачать бизнес-план (.docx)",
        shareTooltip: "Поделиться (скоро)",
        chatTooltip: "Чат с AI Ментором",
        // Sidebar
        nav: {
            dashboard: "Панель Управления",
            kanban: "Центр Проекта",
            legal: "Юридические Документы",
            accelerator: "Акселератор",
            pitch: "AI Симулятор Инвестора",
            investorPrep: "Подготовка к Инвестору",
            radar: "Рыночный Радар",
        },
        // Dashboard Content
        dashboardContent: {
            strategicReviewTitle: "AI Стратегический Обзор",
            strategicReviewDesc: "Получите стратегические рекомендации от ИИ для улучшения вашего бизнес-плана на основе анализа рыночных тенденций и конкурентов. Этот процесс может занять до минуты.",
            startStrategicReview: "Начать Стратегический Обзор",
            uvpTitle: "Уникальное Ценностное Предложение (УЦП)",
            personasTitle: "Портреты Целевой Аудитории",
            competitorAnalysisTitle: "Анализ Конкурентов",
            monetizationTitle: "Стратегия Монетизации",
            optimizePrice: "Оптимизировать Цены",
            swotTitle: "SWOT-анализ",
            financialsTitle: "Финансовые Прогнозы",
            teamTitle: "Структура Команды",
            roadmapTitle: "Дорожная Карта Проекта",
            risksTitle: "Анализ Рисков",
            checklistTitle: "Чек-лист Первых Шагов",
            brandingTitle: "Основы Брендинга"
        }
    },

  },
  'en': {
    // GENERAL
    back: 'Back',
    error: 'Error',
    loading: 'Loading...',
    generate: 'Generate',
    close: 'Close',
    apply: 'Apply',
    cancel: 'Cancel',
    save: 'Save',
    optional: '(optional)',
    all: 'All',
    notifications: 'Notifications',
    noNotifications: 'No notifications yet',
    markAsRead: 'Mark all as read',

    // AUTH PAGE
    auth: {
      title: "Idea Machine",
      subtitle: "Welcome to the world of startups!",
      loginTab: "Login",
      registerTab: "Register",
      emailLabel: 'Phone number',
      passwordLabel: 'Password',
      loginButton: "Login",
      registerButton: "Register",
      footer: ["© 2025 | Developed by ", " • Supported by ", ""]
    },
    
     // TOP UP PAGE
    topUp: {
      title: "Top Up Balance",
      currentBalance: "Current balance: {0} UZS",
      selectAmount: "Select top-up amount:",
      paymentDetailsTitle: "Payment Details",
      uploadReceipt: "Upload Receipt",
      uploadButton: "Choose file",
      noFileSelected: "No file chosen",
      confirmPayment: "I have paid, Confirm",
      pendingConfirmationTitle: "Pending Confirmation",
      pendingConfirmationMessage: "Your payment has been received and is now being reviewed by administrators. Once confirmed, the funds will be added to your account, and you will receive a notification. Thank you!",
      goBackToDashboard: "Go back to Dashboard",

      instructionCardNumber: "CARD NUMBER:",
      instructionAmount: "TRANSFER AMOUNT:",
      instructionCopy: "Copy",
      copied: "Copied!",
      promoCodeLabel: "Promo code",
      promoCodePlaceholder: "e.g. START10",
      
      warningTitle: "ATTENTION!!!",
      warning1: "Transfer the exact amount specified by the platform, including the final digits!",
      warning2: "Do not transfer more or less. Otherwise, the payment will not be processed automatically.",
      warning3: "After transferring to the card below, upload the payment receipt and click the confirm button.",
      warning4: "If you mistakenly transfer a different amount, your money will be refunded within 7 banking days!",
      warningExampleWrong: "DO NOT TRANSFER THIS: {0} UZS ❌",
      warningExampleCorrect: "TRANSFER THIS: {0} UZS ✅",

      successfulTopUp: "{0} UZS has been added to your account!",

      notificationTitle: "Your balance has been topped up!",
      notificationMessage: "{0} UZS successfully received. As a bonus, we've given you {1} UZS cashback. Total: {2} UZS.",
    },
    
    // MAIN LAYOUT
    mainLayout: {
      navDashboard: "My Ideas",
      navMarketplace: "Startup World",
      navPartners: "Partners",
      navLister: "List Project",
      logout: "Logout",
      balance: "{0} UZS",
      topUp: "Top Up",
    },

    // DASHBOARD PAGE
    dashboard: {
        title: "My Ideas",
        newIdeaButton: "New Idea",
        noProjectsTitle: "You have no ideas yet",
        noProjectsSubtitle: "Click the button above to generate your first startup idea!"
    },

    // INVESTOR MARKETPLACE
    marketplace: {
        title: "Startup World",
        subtitle: "Discover the most promising startups in Uzbekistan.",
        searchPlaceholder: "Search by project name...",
        filterIndustry: "Industry",
        filterFunding: "Funding Amount",
        fundingRanges: ["All", "Up to 100M UZS", "100M - 500M UZS", "500M - 1B UZS", "1B+ UZS"],
        noProjectsFound: "No Projects Found",
        noProjectsFoundDesc: "Try changing your search or filter settings.",
        noProjectsTitle: "No listed projects yet",
        noProjectsSubtitle: "New startups will appear here as they are added to the marketplace.",
        fundingSought: "Funding Sought",
        equityOffered: "Equity Offered",
        contact: "Contact"
    },

    partners: {
      title: "Partner Organizations",
      subtitle: "Companies partnering with us",
      contactPerson: "Contact person",
      contact: "Contact",
      website: "Website"
    },

    // LIST PROJECT PAGE
    listProject: {
        title: "List Project for Investment",
        subtitle: "Present your startup to investors and raise capital to get to the next level.",
        formTitle: "Listing Information",
        previewTitle: "Live Preview",
        noProjects: "No projects to list",
        noProjectsDesc: "First, create a new project in the \"My Ideas\" section.",
        selectProject: "Select a project",
        selectProjectPlaceholder: "Which project do you want to list?",
        fundingLabel: "Funding sought (UZS)",
        equityLabel: "Equity offered (%)",
        pitchLabel: "Short Pitch (for the investor)",
        pitchPlaceholder: "Briefly write about the project, team, and market opportunity...",
        errorAllFields: "Please fill out all fields.",
        errorNotFound: "Project not found.",
        errorAlreadyListed: "This project is already listed on the investor marketplace.",
        successMessage: "Project \"{0}\" has been successfully listed on the Investor Marketplace!",
        submitButton: "List Project",
    },
    // Dashboard Content
    dashboardContent: {
        strategicReviewTitle: "AI Strategic Review",
        strategicReviewDesc: "Get strategic recommendations from the AI to improve your business plan based on market trends and competitor analysis. This process may take up to a minute.",
        startStrategicReview: "Start Strategic Review",
        uvpTitle: "Unique Value Proposition (UVP)",
        personasTitle: "Target Audience Personas",
        competitorAnalysisTitle: "Competitor Analysis",
        monetizationTitle: "Monetization Strategy",
        optimizePrice: "Optimize Pricing",
        swotTitle: "SWOT Analysis",
        financialsTitle: "Financial Projections",
        teamTitle: "Team Structure",
        roadmapTitle: "Project Roadmap",
        risksTitle: "Risk Analysis",
        checklistTitle: "First Steps Checklist",
        brandingTitle: "Branding Basics"
    }
  },
};