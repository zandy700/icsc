/* =============================================================
   Interlake ICSC — shared site script (every page)
   - EN / ES / 中文 translations (any element with data-i18n)
   - Language switcher (remembered across pages)
   - Mobile menu
   - Old one-page links (/#signup …) forward to the new pages
   ============================================================= */

// ---------- Translations ----------
const I18N = {
  en: {
    "bar.text": "Studying for the civics test? Practice all 128 questions free on CivicPreps.com",
    "bar.cta": "Start practicing →",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.how": "How It Works",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",
    "nav.practice": "Practice Test",
    "nav.signup": "Sign Up",
    "nav.menu": "Menu",

    "footer.tag": "A free, student-run tutoring program at Interlake High School.",
    "footer.pages": "Pages",
    "footer.study": "Study on your own",
    "footer.study.body": "CivicPreps — free practice for all 128 civics questions, reading, writing and speaking, in 7 languages.",
    "footer.study.cta": "Go to CivicPreps.com →",
    "footer.contact": "Contact",

    "cp.badge": "Free practice website",
    "cp.title": "Practice anytime with CivicPreps",
    "cp.lead": "Between tutoring sessions, study on your own at CivicPreps.com — a free practice website for the U.S. citizenship interview.",
    "cp.f1": "All 128 official civics questions — missed ones come back until you know them",
    "cp.f2": "Speak your answers out loud and get pronunciation feedback",
    "cp.f3": "Short lessons in 7 languages that explain the answers",
    "cp.f4": "A full mock interview: speaking, reading and writing",
    "cp.cta": "Practice free on CivicPreps.com",
    "cp.note": "Free · opens in a new tab",
    "cp.more": "Learn more about CivicPreps",

    "home.eyebrow": "Interlake Citizenship Services Club",
    "home.title": "Free tutoring for the U.S. citizenship test",
    "home.lede": "Interlake High School students help you prepare for your naturalization interview — civics, reading, writing and speaking — in friendly 1-on-1 Zoom sessions.",
    "home.cta1": "Sign Up — It's Free",
    "home.cta2": "How It Works",
    "home.b1": "Always free",
    "home.b2": "1 or 2 tutors per student",
    "home.b3": "30 minutes a week on Zoom",
    "home.card.title": "We help with every part of the test",
    "home.cover.title": "What we cover",
    "home.cover.lead": "Your tutors prepare you for all four parts of the naturalization test.",
    "home.how.title": "How it works",
    "home.how.more": "See the full process →",
    "home.rev.title": "What students say",
    "home.rev.more": "Read all reviews →",

    "cover.civics.t": "Civics",
    "cover.civics.b": "Practice the official USCIS questions on U.S. history and government.",
    "cover.reading.t": "Reading",
    "cover.reading.b": "Read sentences with the official USCIS vocabulary, clearly and confidently.",
    "cover.writing.t": "Writing",
    "cover.writing.b": "Master sentence dictation from the USCIS writing word list.",
    "cover.speaking.t": "Speaking",
    "cover.speaking.b": "Get comfortable answering interview questions out loud with a real person.",

    "how.s1.t": "Sign up",
    "how.s1.b": "Fill out a short form with your email and the times that work for you.",
    "how.s2.t": "Get matched",
    "how.s2.b": "We pair you with 1 or 2 high school tutors who fit your schedule.",
    "how.s3.t": "Meet on Zoom",
    "how.s3.b": "Join a friendly 30-minute Zoom session each week.",
    "how.s4.t": "Pass the test",
    "how.s4.b": "Walk into your USCIS interview ready and confident.",

    "cta.title": "Ready to start?",
    "cta.body": "Sign up in about 2 minutes. A tutor coordinator will reach out within a few days to set up your first Zoom session.",
    "cta.btn": "Sign Up — It's Free",

    "rev.r1": "“I am very grateful to these guys for their great help and willingness.”",
    "rev.r2": "“This program and tutor support is a must for anyone doing the citizenship test. The three tutors met with me for months to help me prepare for the English and civics test. Every time they made me memorize but also gave me the theory behind the questions.”",
    "rev.who": "ICSC student",

    "about.title": "About the Club",
    "about.sub": "A student-run program at Interlake High School",
    "about.body": "Interlake Citizenship Services Club (ICSC) is a student-run program that pairs aspiring U.S. citizens with trained high school tutors. We provide friendly, patient support in the English language skills essential for passing the citizenship interview — completely free of charge.",
    "about.who.t": "Who we are",
    "about.who.b": "Our tutors are trained Interlake High School students. Each student is matched with 1 or 2 tutors, who meet with them on Zoom every week until their interview.",
    "about.stats.a": "tutors per student",
    "about.stats.b": "minutes per weekly session",
    "about.stats.c": "free — no cost, ever",

    "howp.title": "How It Works",
    "howp.sub": "From sign-up to your interview in four simple steps",
    "howp.times.t": "When we meet",
    "howp.times.b": "Sessions are 30 minutes on Zoom. You choose the times that work for you (Pacific Time):",
    "howp.times.wk": "Monday – Friday",
    "howp.times.we": "Saturday – Sunday",
    "howp.faq.t": "Questions",
    "faq.q1": "Does it cost anything?",
    "faq.a1": "No. ICSC tutoring is completely free.",
    "faq.q2": "Who are the tutors?",
    "faq.a2": "Trained Interlake High School students. You'll be matched with 1 or 2 tutors.",
    "faq.q3": "How do sessions work?",
    "faq.a3": "You meet your tutor on Zoom for 30 minutes each week, at a time you choose.",
    "faq.q4": "What do I need to sign up?",
    "faq.a4": "Only an email address. Everything else on the form is optional.",
    "faq.q5": "Where can I practice on my own?",
    "faq.a5": "On CivicPreps.com — free practice for all 128 civics questions, plus reading, writing and speaking.",

    "revp.title": "Reviews",
    "revp.sub": "What students say about ICSC tutoring",

    "prac.title": "Practice with CivicPreps",
    "prac.sub": "Free online practice for the U.S. citizenship test — anytime, at your own pace",
    "prac.tips.t": "How to use it with your tutor",
    "prac.tip1.t": "Practice what you missed",
    "prac.tip1.b": "CivicPreps brings back the questions you get wrong until you know them.",
    "prac.tip2.t": "Bring questions to Zoom",
    "prac.tip2.b": "Anything confusing? Ask your ICSC tutor about it in your next session.",
    "prac.tip3.t": "Try the mock interview",
    "prac.tip3.b": "Before your USCIS appointment, run the full speaking, reading and writing practice.",
    "prac.tutor.t": "Want a real person to practice with?",
    "prac.tutor.b": "ICSC tutors meet with you 1-on-1 on Zoom every week — for free.",

    "contact.title": "Contact Us",
    "contact.sub": "Questions before signing up? We'd love to hear from you.",
    "contact.email.t": "Email",
    "contact.links.t": "All our links",
    "contact.qr": "Scan to visit our website",

    "signup.title": "Sign Up for Free Tutoring",
    "signup.lead": "Four quick steps — about 2 minutes. Only your email is required; skip anything you'd rather not answer.",
    "signup.next.t": "What happens next",
    "signup.next.1": "We receive your signup by email.",
    "signup.next.2": "A tutor coordinator reaches out within a few days.",
    "signup.next.3": "You meet your tutor on Zoom.",
    "signup.cp.t": "Start practicing today",
    "signup.cp.b": "You don't have to wait for your first session — practice the civics questions now on CivicPreps.com.",

    "form.email": "Email address *",
    "form.lang": "Native language",
    "form.testdate": "Citizenship test date",
    "form.phone": "Phone number",
    "form.sched.title": "Preferred meeting times (Pacific Time)",
    "form.sched.hint": "Pick each day that works, then choose your times for that day. Sessions are 30 minutes.",
    "form.sched.skip": "Skip — I haven't decided yet",
    "form.day.mon": "Monday",
    "form.day.tue": "Tuesday",
    "form.day.wed": "Wednesday",
    "form.day.thu": "Thursday",
    "form.day.fri": "Friday",
    "form.day.sat": "Saturday",
    "form.day.sun": "Sunday",
    "form.notes": "Anything else we should know? (optional)",
    "form.submit": "Submit Signup",
    "form.foot": "By submitting, you consent to be contacted at the email or phone number provided.",
    "form.na": "N/A — prefer not to say",
    "form.na.date": "N/A — not scheduled yet",

    "su.s1": "Contact", "su.s2": "About you", "su.s3": "Schedule", "su.s4": "Review",
    "su.p1": "How can we reach you?", "su.p2": "Tell us a little about you",
    "su.p3": "When can you meet?", "su.p4": "Almost done — check your details",
    "su.next": "Next →", "su.back": "← Back", "su.stepof": "Step {n} of 4",
    "su.err.email": "Please enter a valid email address.",
    "su.edit": "Edit", "su.none": "Not provided", "su.sched.none": "Not decided yet",
    "su.slots": "{n} time slots selected", "su.slot1": "1 time slot selected",
    "su.sending": "Sending…", "su.rv.email": "Email", "su.rv.sched": "Schedule", "su.rv.test": "Test date",

    "thanks.title": "Thank you!",
    "thanks.body": "We received your signup. An ICSC tutor coordinator will reach out within a few days to confirm your match and your first Zoom session.",
    "thanks.spam.t": "Don't see our email?",
    "thanks.spam.b": "Please check your Spam or Junk folder. Emails from interlakecitizenshipclub@gmail.com sometimes land there — mark it as “Not spam” so future messages reach your inbox.",
    "thanks.cp.t": "While you wait, start practicing",
    "thanks.cp.b": "Get a head start on CivicPreps.com — free practice for all 128 civics questions, reading, writing and speaking.",
    "thanks.home": "← Back to homepage",

    "nf.title": "Page not found",
    "nf.body": "Sorry — that page doesn't exist. Try one of these:"
  },

  es: {
    "bar.text": "¿Estudia para el examen de cívica? Practique las 128 preguntas gratis en CivicPreps.com",
    "bar.cta": "Empezar a practicar →",

    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.how": "Cómo Funciona",
    "nav.reviews": "Opiniones",
    "nav.contact": "Contacto",
    "nav.practice": "Examen de Práctica",
    "nav.signup": "Inscribirse",
    "nav.menu": "Menú",

    "footer.tag": "Un programa de tutoría gratuito dirigido por estudiantes de Interlake High School.",
    "footer.pages": "Páginas",
    "footer.study": "Estudie por su cuenta",
    "footer.study.body": "CivicPreps — práctica gratuita de las 128 preguntas de cívica, lectura, escritura y conversación, en 7 idiomas.",
    "footer.study.cta": "Ir a CivicPreps.com →",
    "footer.contact": "Contacto",

    "cp.badge": "Sitio de práctica gratuito",
    "cp.title": "Practique cuando quiera con CivicPreps",
    "cp.lead": "Entre sesiones de tutoría, estudie por su cuenta en CivicPreps.com — un sitio de práctica gratuito para la entrevista de ciudadanía de EE. UU.",
    "cp.f1": "Las 128 preguntas oficiales de cívica — las que falla vuelven hasta que las domine",
    "cp.f2": "Responda en voz alta y reciba comentarios sobre su pronunciación",
    "cp.f3": "Lecciones cortas en 7 idiomas que explican las respuestas",
    "cp.f4": "Una entrevista simulada completa: conversación, lectura y escritura",
    "cp.cta": "Practique gratis en CivicPreps.com",
    "cp.note": "Gratis · se abre en una pestaña nueva",
    "cp.more": "Más sobre CivicPreps",

    "home.eyebrow": "Club de Servicios de Ciudadanía de Interlake",
    "home.title": "Tutoría gratuita para el examen de ciudadanía de EE. UU.",
    "home.lede": "Estudiantes de Interlake High School le ayudan a prepararse para su entrevista de naturalización — cívica, lectura, escritura y conversación — en amables sesiones individuales por Zoom.",
    "home.cta1": "Inscríbase — Es Gratis",
    "home.cta2": "Cómo Funciona",
    "home.b1": "Siempre gratis",
    "home.b2": "1 o 2 tutores por estudiante",
    "home.b3": "30 minutos por semana en Zoom",
    "home.card.title": "Le ayudamos con cada parte del examen",
    "home.cover.title": "Lo que cubrimos",
    "home.cover.lead": "Sus tutores le preparan para las cuatro partes del examen de naturalización.",
    "home.how.title": "Cómo funciona",
    "home.how.more": "Ver el proceso completo →",
    "home.rev.title": "Lo que dicen los estudiantes",
    "home.rev.more": "Leer todas las opiniones →",

    "cover.civics.t": "Cívica",
    "cover.civics.b": "Practique las preguntas oficiales de USCIS sobre historia y gobierno de EE. UU.",
    "cover.reading.t": "Lectura",
    "cover.reading.b": "Lea oraciones con el vocabulario oficial de USCIS, con claridad y confianza.",
    "cover.writing.t": "Escritura",
    "cover.writing.b": "Domine el dictado de oraciones con la lista oficial de palabras de USCIS.",
    "cover.speaking.t": "Conversación",
    "cover.speaking.b": "Siéntase cómodo respondiendo preguntas de la entrevista en voz alta con una persona real.",

    "how.s1.t": "Inscríbase",
    "how.s1.b": "Complete un formulario corto con su correo y los horarios que le convienen.",
    "how.s2.t": "Le asignamos tutores",
    "how.s2.b": "Le asignamos 1 o 2 tutores de secundaria que se ajusten a su horario.",
    "how.s3.t": "Reúnase por Zoom",
    "how.s3.b": "Participe en una amable sesión de 30 minutos por Zoom cada semana.",
    "how.s4.t": "Apruebe el examen",
    "how.s4.b": "Llegue a su entrevista de USCIS preparado y con confianza.",

    "cta.title": "¿Listo para empezar?",
    "cta.body": "Inscríbase en unos 2 minutos. Un coordinador de tutores se comunicará en unos días para programar su primera sesión por Zoom.",
    "cta.btn": "Inscríbase — Es Gratis",

    "rev.r1": "“Estoy muy agradecido con estos chicos por su gran ayuda y disposición.”",
    "rev.r2": "“Este programa y el apoyo de los tutores son imprescindibles para cualquiera que tome el examen de ciudadanía. Los tres tutores se reunieron conmigo durante meses para ayudarme a preparar el examen de inglés y cívica. Siempre me hacían memorizar, pero también me explicaban la teoría detrás de las preguntas.”",
    "rev.who": "Estudiante de ICSC",

    "about.title": "Sobre el Club",
    "about.sub": "Un programa dirigido por estudiantes de Interlake High School",
    "about.body": "El Club de Servicios de Ciudadanía de Interlake (ICSC) es un programa dirigido por estudiantes que une a futuros ciudadanos de EE. UU. con tutores de secundaria capacitados. Ofrecemos apoyo amable y paciente en las habilidades de inglés esenciales para aprobar la entrevista de ciudadanía — totalmente gratis.",
    "about.who.t": "Quiénes somos",
    "about.who.b": "Nuestros tutores son estudiantes capacitados de Interlake High School. A cada estudiante se le asignan 1 o 2 tutores, que se reúnen con él por Zoom cada semana hasta su entrevista.",
    "about.stats.a": "tutores por estudiante",
    "about.stats.b": "minutos por sesión semanal",
    "about.stats.c": "gratis — sin costo, nunca",

    "howp.title": "Cómo Funciona",
    "howp.sub": "De la inscripción a su entrevista en cuatro pasos sencillos",
    "howp.times.t": "Cuándo nos reunimos",
    "howp.times.b": "Las sesiones duran 30 minutos por Zoom. Usted elige los horarios que le convienen (hora del Pacífico):",
    "howp.times.wk": "Lunes – Viernes",
    "howp.times.we": "Sábado – Domingo",
    "howp.faq.t": "Preguntas",
    "faq.q1": "¿Tiene algún costo?",
    "faq.a1": "No. La tutoría de ICSC es completamente gratuita.",
    "faq.q2": "¿Quiénes son los tutores?",
    "faq.a2": "Estudiantes capacitados de Interlake High School. Se le asignarán 1 o 2 tutores.",
    "faq.q3": "¿Cómo funcionan las sesiones?",
    "faq.a3": "Se reúne con su tutor por Zoom 30 minutos cada semana, en el horario que usted elija.",
    "faq.q4": "¿Qué necesito para inscribirme?",
    "faq.a4": "Solo un correo electrónico. Todo lo demás en el formulario es opcional.",
    "faq.q5": "¿Dónde puedo practicar por mi cuenta?",
    "faq.a5": "En CivicPreps.com — práctica gratuita de las 128 preguntas de cívica, además de lectura, escritura y conversación.",

    "revp.title": "Opiniones",
    "revp.sub": "Lo que dicen los estudiantes sobre la tutoría de ICSC",

    "prac.title": "Practique con CivicPreps",
    "prac.sub": "Práctica gratuita en línea para el examen de ciudadanía — cuando quiera, a su propio ritmo",
    "prac.tips.t": "Cómo usarlo con su tutor",
    "prac.tip1.t": "Practique lo que falló",
    "prac.tip1.b": "CivicPreps le vuelve a mostrar las preguntas que falla hasta que las domine.",
    "prac.tip2.t": "Lleve sus dudas a Zoom",
    "prac.tip2.b": "¿Algo confuso? Pregúntele a su tutor de ICSC en la próxima sesión.",
    "prac.tip3.t": "Haga la entrevista simulada",
    "prac.tip3.b": "Antes de su cita con USCIS, haga la práctica completa de conversación, lectura y escritura.",
    "prac.tutor.t": "¿Quiere practicar con una persona real?",
    "prac.tutor.b": "Los tutores de ICSC se reúnen con usted individualmente por Zoom cada semana — gratis.",

    "contact.title": "Contáctenos",
    "contact.sub": "¿Preguntas antes de inscribirse? Nos encantaría saber de usted.",
    "contact.email.t": "Correo electrónico",
    "contact.links.t": "Todos nuestros enlaces",
    "contact.qr": "Escanee para visitar nuestro sitio web",

    "signup.title": "Inscríbase para Tutoría Gratis",
    "signup.lead": "Cuatro pasos rápidos — unos 2 minutos. Solo el correo es obligatorio; omita lo que prefiera no responder.",
    "signup.next.t": "Qué pasa después",
    "signup.next.1": "Recibimos su inscripción por correo.",
    "signup.next.2": "Un coordinador de tutores se comunica en unos días.",
    "signup.next.3": "Se reúne con su tutor por Zoom.",
    "signup.cp.t": "Empiece a practicar hoy",
    "signup.cp.b": "No tiene que esperar a su primera sesión — practique las preguntas de cívica ahora en CivicPreps.com.",

    "form.email": "Correo electrónico *",
    "form.lang": "Idioma nativo",
    "form.testdate": "Fecha del examen de ciudadanía",
    "form.phone": "Número de teléfono",
    "form.sched.title": "Horarios preferidos (hora del Pacífico)",
    "form.sched.hint": "Elija cada día que le convenga y luego marque sus horas para ese día. Las sesiones duran 30 minutos.",
    "form.sched.skip": "Omitir — todavía no he decidido",
    "form.day.mon": "Lunes",
    "form.day.tue": "Martes",
    "form.day.wed": "Miércoles",
    "form.day.thu": "Jueves",
    "form.day.fri": "Viernes",
    "form.day.sat": "Sábado",
    "form.day.sun": "Domingo",
    "form.notes": "¿Algo más que debamos saber? (opcional)",
    "form.submit": "Enviar Inscripción",
    "form.foot": "Al enviar, usted acepta ser contactado por el correo o teléfono proporcionado.",
    "form.na": "N/A — prefiero no decir",
    "form.na.date": "N/A — aún no programado",

    "su.s1": "Contacto", "su.s2": "Sobre usted", "su.s3": "Horario", "su.s4": "Revisar",
    "su.p1": "¿Cómo podemos contactarle?", "su.p2": "Cuéntenos un poco sobre usted",
    "su.p3": "¿Cuándo puede reunirse?", "su.p4": "Casi listo — revise sus datos",
    "su.next": "Siguiente →", "su.back": "← Atrás", "su.stepof": "Paso {n} de 4",
    "su.err.email": "Ingrese un correo electrónico válido.",
    "su.edit": "Editar", "su.none": "No indicado", "su.sched.none": "Aún no decidido",
    "su.slots": "{n} horarios seleccionados", "su.slot1": "1 horario seleccionado",
    "su.sending": "Enviando…", "su.rv.email": "Correo", "su.rv.sched": "Horario", "su.rv.test": "Fecha del examen",

    "thanks.title": "¡Gracias!",
    "thanks.body": "Recibimos su inscripción. Un coordinador de tutores de ICSC se comunicará en unos días para confirmar su tutor y su primera sesión por Zoom.",
    "thanks.spam.t": "¿No ve nuestro correo?",
    "thanks.spam.b": "Revise su carpeta de spam o correo no deseado. Los correos de interlakecitizenshipclub@gmail.com a veces llegan allí — márquelo como “No es spam” para recibir los próximos mensajes.",
    "thanks.cp.t": "Mientras espera, empiece a practicar",
    "thanks.cp.b": "Adelántese en CivicPreps.com — práctica gratuita de las 128 preguntas de cívica, lectura, escritura y conversación.",
    "thanks.home": "← Volver al inicio",

    "nf.title": "Página no encontrada",
    "nf.body": "Lo sentimos — esa página no existe. Pruebe una de estas:"
  },

  zh: {
    "bar.text": "正在准备公民考试？在 CivicPreps.com 免费练习全部 128 道公民题",
    "bar.cta": "开始练习 →",

    "nav.home": "首页",
    "nav.about": "关于我们",
    "nav.how": "运作方式",
    "nav.reviews": "学员评价",
    "nav.contact": "联系我们",
    "nav.practice": "模拟练习",
    "nav.signup": "立即报名",
    "nav.menu": "菜单",

    "footer.tag": "Interlake 高中学生运营的免费辅导项目。",
    "footer.pages": "页面",
    "footer.study": "自主学习",
    "footer.study.body": "CivicPreps — 免费练习全部 128 道公民题以及阅读、写作和口语，支持 7 种语言。",
    "footer.study.cta": "前往 CivicPreps.com →",
    "footer.contact": "联系方式",

    "cp.badge": "免费练习网站",
    "cp.title": "随时用 CivicPreps 练习",
    "cp.lead": "在辅导课之间，您可以在 CivicPreps.com 自主学习 — 这是一个为美国入籍面试准备的免费练习网站。",
    "cp.f1": "全部 128 道官方公民题 — 答错的题会反复出现，直到您掌握为止",
    "cp.f2": "大声说出答案，获得发音反馈",
    "cp.f3": "7 种语言的简短课程，讲解答案背后的原因",
    "cp.f4": "完整的模拟面试：口语、阅读和写作",
    "cp.cta": "在 CivicPreps.com 免费练习",
    "cp.note": "免费 · 在新标签页打开",
    "cp.more": "了解 CivicPreps",

    "home.eyebrow": "Interlake 公民服务社",
    "home.title": "美国公民考试免费辅导",
    "home.lede": "由 Interlake 高中学生通过友好的一对一 Zoom 课程，帮助您准备入籍面试 — 公民知识、阅读、写作和口语。",
    "home.cta1": "立即免费报名",
    "home.cta2": "运作方式",
    "home.b1": "永久免费",
    "home.b2": "每位学员 1–2 名导师",
    "home.b3": "每周 Zoom 30 分钟",
    "home.card.title": "我们帮助您准备考试的每个部分",
    "home.cover.title": "辅导内容",
    "home.cover.lead": "您的导师会帮助您准备入籍考试的全部四个部分。",
    "home.how.title": "运作方式",
    "home.how.more": "查看完整流程 →",
    "home.rev.title": "学员评价",
    "home.rev.more": "阅读全部评价 →",

    "cover.civics.t": "公民知识",
    "cover.civics.b": "练习 USCIS 官方的美国历史与政府题目。",
    "cover.reading.t": "阅读",
    "cover.reading.b": "清晰自信地朗读包含 USCIS 官方词汇的句子。",
    "cover.writing.t": "写作",
    "cover.writing.b": "熟练掌握 USCIS 官方词表中的句子听写。",
    "cover.speaking.t": "口语",
    "cover.speaking.b": "与真人练习，自如地用英语回答面试问题。",

    "how.s1.t": "报名",
    "how.s1.b": "填写简短表格，留下您的邮箱和方便的时间。",
    "how.s2.t": "导师配对",
    "how.s2.b": "我们为您配对 1–2 名时间合适的高中导师。",
    "how.s3.t": "Zoom 上课",
    "how.s3.b": "每周参加一次友好的 30 分钟 Zoom 课程。",
    "how.s4.t": "通过考试",
    "how.s4.b": "自信满满地参加 USCIS 面试。",

    "cta.title": "准备好开始了吗？",
    "cta.body": "大约 2 分钟即可完成报名。导师协调员会在几天内与您联系，安排第一次 Zoom 课程。",
    "cta.btn": "立即免费报名",

    "rev.r1": "“非常感谢这些同学的热心帮助。”",
    "rev.r2": "“对于准备入籍考试的人来说，这个项目和导师的帮助必不可少。三位导师连续几个月和我见面，帮我准备英语和公民考试。他们每次都让我背题，同时也给我讲解题目背后的道理。”",
    "rev.who": "ICSC 学员",

    "about.title": "关于我们",
    "about.sub": "Interlake 高中学生运营的项目",
    "about.body": "Interlake 公民服务社（ICSC）是一个由学生运营的项目，为希望成为美国公民的人配对经过培训的高中导师。我们以友好、耐心的方式，帮助学员掌握通过入籍面试所需的英语技能 — 完全免费。",
    "about.who.t": "我们是谁",
    "about.who.b": "我们的导师是经过培训的 Interlake 高中学生。每位学员配对 1–2 名导师，每周通过 Zoom 上课，直到面试为止。",
    "about.stats.a": "每位学员的导师人数",
    "about.stats.b": "每周课程分钟数",
    "about.stats.c": "免费 — 永不收费",

    "howp.title": "运作方式",
    "howp.sub": "从报名到面试，只需四个简单步骤",
    "howp.times.t": "上课时间",
    "howp.times.b": "每节课 30 分钟，通过 Zoom 进行。您可以选择方便的时间（太平洋时间）：",
    "howp.times.wk": "周一至周五",
    "howp.times.we": "周六至周日",
    "howp.faq.t": "常见问题",
    "faq.q1": "需要付费吗？",
    "faq.a1": "不需要。ICSC 辅导完全免费。",
    "faq.q2": "导师是谁？",
    "faq.a2": "经过培训的 Interlake 高中学生。您将被配对 1–2 名导师。",
    "faq.q3": "课程如何进行？",
    "faq.a3": "您每周和导师在 Zoom 上见面 30 分钟，时间由您选择。",
    "faq.q4": "报名需要什么？",
    "faq.a4": "只需要一个电子邮箱。表格中的其他内容都是选填。",
    "faq.q5": "我可以在哪里自己练习？",
    "faq.a5": "在 CivicPreps.com — 免费练习全部 128 道公民题，以及阅读、写作和口语。",

    "revp.title": "学员评价",
    "revp.sub": "学员如何评价 ICSC 辅导",

    "prac.title": "使用 CivicPreps 练习",
    "prac.sub": "美国公民考试免费在线练习 — 随时随地，按您自己的节奏",
    "prac.tips.t": "如何配合导师使用",
    "prac.tip1.t": "练习答错的题",
    "prac.tip1.b": "CivicPreps 会让您答错的题反复出现，直到您掌握为止。",
    "prac.tip2.t": "把问题带到 Zoom 课上",
    "prac.tip2.b": "有不明白的地方？在下一节课问您的 ICSC 导师。",
    "prac.tip3.t": "尝试模拟面试",
    "prac.tip3.b": "在 USCIS 面试之前，完成一次完整的口语、阅读和写作练习。",
    "prac.tutor.t": "想和真人一起练习吗？",
    "prac.tutor.b": "ICSC 导师每周通过 Zoom 与您一对一上课 — 完全免费。",

    "contact.title": "联系我们",
    "contact.sub": "报名前有疑问？欢迎与我们联系。",
    "contact.email.t": "电子邮箱",
    "contact.links.t": "我们的所有链接",
    "contact.qr": "扫码访问我们的网站",

    "signup.title": "免费辅导报名",
    "signup.lead": "四个简单步骤，大约 2 分钟。只有电子邮箱是必填项，其他都可以跳过。",
    "signup.next.t": "接下来会发生什么",
    "signup.next.1": "我们通过邮件收到您的报名。",
    "signup.next.2": "导师协调员会在几天内与您联系。",
    "signup.next.3": "您在 Zoom 上与导师见面。",
    "signup.cp.t": "今天就开始练习",
    "signup.cp.b": "不必等到第一节课 — 现在就在 CivicPreps.com 练习公民题。",

    "form.email": "电子邮箱 *",
    "form.lang": "母语",
    "form.testdate": "入籍考试日期",
    "form.phone": "电话号码",
    "form.sched.title": "希望上课的时间（太平洋时间）",
    "form.sched.hint": "先勾选方便的日期，再为该日期选择时间。每节课 30 分钟。",
    "form.sched.skip": "跳过 — 我还没决定",
    "form.day.mon": "周一",
    "form.day.tue": "周二",
    "form.day.wed": "周三",
    "form.day.thu": "周四",
    "form.day.fri": "周五",
    "form.day.sat": "周六",
    "form.day.sun": "周日",
    "form.notes": "还有其他想告诉我们的事吗？（选填）",
    "form.submit": "提交报名",
    "form.foot": "提交即表示同意我们通过您提供的邮箱或电话与您联系。",
    "form.na": "N/A — 不愿透露",
    "form.na.date": "N/A — 尚未安排",

    "su.s1": "联系方式", "su.s2": "个人信息", "su.s3": "时间安排", "su.s4": "确认",
    "su.p1": "我们如何联系您？", "su.p2": "简单介绍一下您自己",
    "su.p3": "您什么时候方便上课？", "su.p4": "快完成了 — 请确认您的信息",
    "su.next": "下一步 →", "su.back": "← 上一步", "su.stepof": "第 {n} 步，共 4 步",
    "su.err.email": "请输入有效的电子邮箱地址。",
    "su.edit": "修改", "su.none": "未填写", "su.sched.none": "尚未决定",
    "su.slots": "已选 {n} 个时段", "su.slot1": "已选 1 个时段",
    "su.sending": "提交中…", "su.rv.email": "邮箱", "su.rv.sched": "上课时间", "su.rv.test": "考试日期",

    "thanks.title": "谢谢！",
    "thanks.body": "我们已收到您的报名。ICSC 导师协调员将在几天内与您联系，确认导师配对和第一次 Zoom 课程。",
    "thanks.spam.t": "没收到我们的邮件？",
    "thanks.spam.b": "请检查垃圾邮件文件夹。来自 interlakecitizenshipclub@gmail.com 的邮件有时会被归入其中 — 请标记为“不是垃圾邮件”，以便之后的邮件正常送达。",
    "thanks.cp.t": "等待期间，先开始练习吧",
    "thanks.cp.b": "在 CivicPreps.com 抢先练习 — 免费练习全部 128 道公民题以及阅读、写作和口语。",
    "thanks.home": "← 返回首页",

    "nf.title": "找不到页面",
    "nf.body": "抱歉，该页面不存在。您可以试试这些页面："
  }
};

// ---------- Apply translations ----------
function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll(".lang-switch button").forEach(b => {
    const on = b.dataset.lang === lang;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("icsc_lang", lang); } catch (e) {}
  document.dispatchEvent(new CustomEvent("icsc:lang", { detail: lang }));
}

document.querySelectorAll(".lang-switch button").forEach(btn => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

// Restore saved language, else auto-detect from the browser
(() => {
  let saved = null;
  try { saved = localStorage.getItem("icsc_lang"); } catch (e) {}
  if (saved && I18N[saved]) return applyLang(saved);
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("es")) applyLang("es");
  else if (nav.startsWith("zh")) applyLang("zh");
  else applyLang("en");
})();

// ---------- Mobile menu ----------
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  if (!toggle || !header) return;
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && header.classList.contains("menu-open")) {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();

// ---------- Old one-page links (e.g. /#signup) go to the new pages ----------
(() => {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  const map = {
    "#signup": "/signup/", "#about": "/about/", "#coverage": "/about/",
    "#how": "/how-it-works/", "#reviews": "/reviews/", "#contact": "/contact/"
  };
  if (map[location.hash]) location.replace(map[location.hash]);
})();

// ---------- Footer year ----------
document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
