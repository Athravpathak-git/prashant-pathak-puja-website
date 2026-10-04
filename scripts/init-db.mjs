import fs from 'fs';
import path from 'path';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const EXPECTED_DATABASE = 'prashant_pathak_puja_db';
const EXPECTED_USER = 'prashant_pathak_app';
const EXPECTED_APP_IDENTIFIER = 'prashant_pathak_guruji_website';

const dbConfig = {
  user: 'prashant_pathak_app',
  password: '#Athr2007',
  host: 'localhost',
  port: 5432,
  database: EXPECTED_DATABASE,
};

async function init() {
  console.log('[DB-INIT] Connecting to dedicated database...');
  const pool = new Pool(dbConfig);
  const client = await pool.connect();

  try {
    // 1. Critical isolation check
    const checkRes = await client.query('SELECT current_database() AS db, current_user AS usr');
    const { db, usr } = checkRes.rows[0];
    console.log(`[DB-INIT] Connected to Database: "${db}", User: "${usr}"`);

    if (db !== EXPECTED_DATABASE || usr !== EXPECTED_USER) {
      throw new Error(`[CRITICAL HALT] Safety check failed! Expected ${EXPECTED_DATABASE}/${EXPECTED_USER}, got ${db}/${usr}`);
    }

    console.log('[DB-INIT] Verification successful! Applying schema...');
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'src/lib/schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('[DB-INIT] Tables created successfully.');

    // 2. Application metadata safety marker
    await client.query(`
      INSERT INTO application_metadata (application_name, application_identifier, schema_version)
      VALUES ($1, $2, $3)
      ON CONFLICT (application_identifier) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;
    `, ['Prashant Pathak Guruji Website', EXPECTED_APP_IDENTIFIER, '1.0.0']);

    // 3. Default Admin user
    const adminPass = process.env.ADMIN_DEFAULT_PASS || 'Guruji@Puja2026!';
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(adminPass, salt);

    await client.query(`
      INSERT INTO admins (username, email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      ON CONFLICT (username) DO UPDATE SET password_hash = $3, updated_at = CURRENT_TIMESTAMP;
    `, ['admin', 'admin@prashantpathak.org', passHash, 'प्रशांत पाठक (प्रशासक)', 'admin']);

    // 4. Website Settings
    await client.query(`
      INSERT INTO website_settings (
        id, guruji_name_mr, guruji_name_en, guruji_title_mr, guruji_title_en,
        bio_mr, bio_en, contact_location_mr, contact_location_en, whatsapp_username
      ) VALUES (
        1,
        'वे.मु. प्रशांत पाठक (गुरुजी)',
        'Ve.Mu. Prashant Pathak (Guruji)',
        'वेदमूर्ती प्रशांत पाठक (गुरुजी)',
        'Vedmurti Prashant Pathak (Guruji)',
        'नागपूर येथील सुप्रसिद्ध वैदिक पुरोहित वेदमूर्ती प्रशांत पाठक गुरुजींद्वारे सर्व प्रकारचे धार्मिक विधी, पूजा, शांती व षोडश संस्कार वैदिक मंत्रोच्चार व शुद्ध शास्त्रोक्त पद्धतीने संपन्न केले जातात. प्रत्येक यजमानाच्या गृहात सुख, शांती, समाधान व आध्यात्मिक प्रगती लाभावी हाच आमचा मूळ संकल्प आहे. जन्मकुंडली मार्गदर्शन व मुहूर्तानुसार विधी केले जातात.',
        'Vedmurti Prashant Pathak Guruji is a revered Vedic scholar and Purohit based in Nagpur, Maharashtra. With strict devotion to ancient Shastras, he conducts all religious ceremonies, sanskars, peace rituals, and pujas with authentic Vedic mantras. Janma Kundali preparation and personalized astrological guidance are provided.',
        'नागपूर, महाराष्ट्र',
        'Nagpur, Maharashtra',
        '@PrashantPathakGuruji'
      ) ON CONFLICT (id) DO NOTHING;
    `);

    // 5. Service Categories
    const categories = [
      { name_mr: 'गृहशांती व वास्तु', name_en: 'Grah & Vastu Shanti', slug: 'grah-vastu-shanti', sort: 1 },
      { name_mr: 'पूजा व अभिषेक', name_en: 'Puja & Abhishek', slug: 'puja-abhishek', sort: 2 },
      { name_mr: 'संस्कार', name_en: 'Sanskar Ceremonies', slug: 'sanskar', sort: 3 },
      { name_mr: 'विशेष धार्मिक विधी', name_en: 'Special Vedic Rituals', slug: 'special-rituals', sort: 4 },
      { name_mr: 'कुंडली सेवा', name_en: 'Kundali & Astrology', slug: 'kundali-astrology', sort: 5 },
      { name_mr: 'इतर सेवा', name_en: 'Other Services', slug: 'other', sort: 6 },
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO service_categories (name_mr, name_en, slug, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET name_mr = $1, name_en = $2, sort_order = $4;
      `, [cat.name_mr, cat.name_en, cat.slug, cat.sort]);
    }

    // Fetch category IDs
    const catMapRes = await client.query('SELECT id, slug FROM service_categories');
    const catMap = Object.fromEntries(catMapRes.rows.map(r => [r.slug, r.id]));

    // 6. Verified Initial Services
    const initialServices = [
      {
        slug: 'vastu-shanti',
        name_mr: 'वास्तुशांती',
        name_en: 'Vastu Shanti Puja',
        cat: 'grah-vastu-shanti',
        short_mr: 'नवीन घरात प्रवेश करताना वास्तुदोष निवारण व सुख-समृद्धीसाठी शास्त्रोक्त वास्तुशांती.',
        short_en: 'Sacred ritual performed for removing Vastu doshas and welcoming positive divine vibrations into a new home or workplace.',
        desc_mr: 'वास्तुशांती विधीमुळे गृह अथवा वास्तूतील सर्व नकारात्मक ऊर्जेचा नाश होऊन सुख, आरोग्य व ऐश्वर्य प्राप्त होते. नवग्रह पूजन, वास्तुपुरुष पूजन, हवन व तोरण पूजन शास्त्रोक्त विधीनुसार केले जाते.',
        desc_en: 'Vastu Shanti harmonizes the elemental energy of a premise. It includes Navagraha pujan, Vastu Purusha pujan, havan, and Vedic shanti mantras to usher in peace, prosperity, and auspiciousness.',
        duration: '३ ते ४ तास (3-4 Hours)',
        sort: 1,
        featured: true,
      },
      {
        slug: 'grah-shanti',
        name_mr: 'ग्रहशांती',
        name_en: 'Grah Shanti Puja',
        cat: 'grah-vastu-shanti',
        short_mr: 'नवग्रहांची अनुकूलता व अनिष्ट ग्रहांच्या पीडा निवारणासाठी वैदिक ग्रहशांती.',
        short_en: 'Vedic ceremony performed to pacify malefic planetary influences and enhance beneficial cosmic energies in life.',
        desc_mr: 'कुंडलीतील अशुभ ग्रहांच्या शांतीसाठी व आयुष्यातील संकटे, आजारपण किंवा कामातील अडथळे दूर करण्यासाठी ग्रहशांती अत्यंत फलदायी ठरते.',
        desc_en: 'Grah Shanti pacifies adverse planetary placements causing hindrances in career, health, or familial harmony through precise Vedic japas and havans.',
        duration: '२ ते ३ तास (2-3 Hours)',
        sort: 2,
        featured: true,
      },
      {
        slug: 'satyanarayan-puja',
        name_mr: 'सत्यनारायण पूजा',
        name_en: 'Shree Satyanarayan Puja',
        cat: 'puja-abhishek',
        short_mr: 'श्री सत्यनारायण पूजन, कथा वाचन व सुख-समृद्धीसाठी महाप्रसाद विधी.',
        short_en: 'Auspicious ritual of Bhagwan Vishnu with holy katha recitation for family well-being, success, and divine bliss.',
        desc_mr: 'पौर्णिमा, संक्रांत किंवा कोणत्याही मंगल प्रसंगी श्री सत्यनारायण पूजा करणे अत्यंत पुण्यकारक मानले जाते. संपूर्ण पाच अध्यायांचे शुद्ध पठण व आरती केली जाते.',
        desc_en: 'Satyanarayan puja invites the benign grace of Lord Vishnu. Guruji recites the authentic five chapters with melodious aartis and Prasad rituals.',
        duration: '१.५ ते २ तास (1.5-2 Hours)',
        sort: 3,
        featured: true,
      },
      {
        slug: 'rudra-abhishek',
        name_mr: 'रुद्र अभिषेक',
        name_en: 'Rudra Abhishek',
        cat: 'puja-abhishek',
        short_mr: 'भगवान शंकरांचा वैदिक रुद्राध्याय मंत्रांनी जलाभिषेक व दुग्धाभिषेक.',
        short_en: 'Sacred ceremonial bathing of Shiva Linga with Vedic Rudram chants for health, inner peace, and divine protection.',
        desc_mr: 'रुद्रसूक्ताचे पठण करून शिवलिंगावर दूध, मध, तूप, दही, साखर व गंगाजलाने अभिषेक केला जातो. सर्व प्रकारच्या भीती व व्याधींवर हा विधी अत्यंत प्रभावी आहे.',
        desc_en: 'Rudra Abhishek invokes the benevolent form of Lord Shiva. The recitation of Sri Rudram and Chamakam cleanses negative karmas and grants spiritual clarity.',
        duration: '१.५ ते २ तास (1.5-2 Hours)',
        sort: 4,
        featured: true,
      },
      {
        slug: 'nakshatra-shanti',
        name_mr: 'नक्षत्र शांती',
        name_en: 'Nakshatra Shanti',
        cat: 'grah-vastu-shanti',
        short_mr: 'जन्म नक्षत्रातील दोष निवारण व आयुष्यातील स्थैर्यासाठी शांती विधी.',
        short_en: 'Ceremony to pacify unfavorable birth asterisms (Nakshatras) and invite harmony and good health.',
        desc_mr: 'मूल नक्षत्र, ज्येष्ठा, आश्लेषा किंवा इतर क्रूर नक्षत्रात जन्म झाल्यास होणाऱ्या दोषांचे शास्त्रोक्त परिहार नक्षत्र शांती विधीने केले जाते.',
        desc_en: 'Conducted for children or adults born under Gandanta or unfavorable Nakshatras to neutralize cosmic imbalances and ensure robust longevity.',
        duration: '२.५ ते ३ तास (2.5-3 Hours)',
        sort: 5,
        featured: false,
      },
      {
        slug: 'kalsarp-shanti',
        name_mr: 'कालसर्प शांती',
        name_en: 'Kalsarp Shanti',
        cat: 'special-rituals',
        short_mr: 'कुंडलीतील कालसर्प योगाचे निवारण, प्रगती व शांततेसाठी विधी.',
        short_en: 'Potent Vedic ritual to alleviate Kalsarp Yoga hindrances in education, marriage, and career.',
        desc_mr: 'कुंडलीत राहू आणि केतू यांच्या दरम्यान सर्व ग्रह आल्यास कालसर्प योग निर्माण होतो. या शांती विधीमुळे मानसिक क्लेश व अडथळे दूर होतात.',
        desc_en: 'Performs Vedic japa, nag pratima pujan, and oblations to nullify Kalsarp dosha and unlock delayed progress and prosperity.',
        duration: '३ ते ४ तास (3-4 Hours)',
        sort: 6,
        featured: true,
      },
      {
        slug: 'vivah-sanskar',
        name_mr: 'विवाह संस्कार',
        name_en: 'Vivah Sanskar (Vedic Wedding)',
        cat: 'sanskar',
        short_mr: 'सप्तपदी, कन्यादान, मंगलाष्टके व सर्व वैदिक पद्धतीनुसार संपूर्ण विवाह विधी.',
        short_en: 'Sacred Vedic wedding rituals including Saptapadi, Kanyadan, Mangalashtak, and sacred Vivah Homa.',
        desc_mr: 'दोन जिवांचे व कुटुंबांचे पवित्र मिलन वैदिक मंत्रोच्चार व शुभ मुहूर्तावर शास्त्रोक्त विधींनी संपन्न केले जाते.',
        desc_en: 'Guruji presides over the complete Vedic Vivah ceremonies upholding age-old sacred traditions, Saptapadi vows, and holy fire rituals.',
        duration: '३ ते ५ तास (3-5 Hours)',
        sort: 7,
        featured: true,
      },
      {
        slug: 'upanayan-sanskar',
        name_mr: 'उपनयन संस्कार (मुंज)',
        name_en: 'Upanayan Sanskar (Munj)',
        cat: 'sanskar',
        short_mr: 'बटुचा उपनयन संस्कार, गायत्री दीक्षा व ब्रह्मचर्याश्रम प्रवेश विधी.',
        short_en: 'The holy sacred thread ceremony initiating the young seeker into Vedic study and Gayatri Mantra Sadhana.',
        desc_mr: 'सोळा संस्कारांमधील अत्यंत महत्त्वाचा संस्कार. मौंजीबंधन, गायत्री मंत्रोपदेश, मातृभोजन व भिक्षावळ शास्त्रोक्त पद्धतीने केले जाते.',
        desc_en: 'One of the primary Shodasha Sanskars where the sacred Janeu is invested alongside Gayatri Diksha, awakening intellectual and spiritual faculties.',
        duration: '४ ते ५ तास (4-5 Hours)',
        sort: 8,
        featured: true,
      },
      {
        slug: 'murti-pran-pratishtha',
        name_mr: 'मूर्ती प्राणप्रतिष्ठा',
        name_en: 'Murti Pran Pratishtha',
        cat: 'special-rituals',
        short_mr: 'मंदिर अथवा घरगुती देव्हाऱ्यातील देवांच्या मूर्तींमध्ये दिव्य प्राण प्रस्थापित करण्याचा विधी.',
        short_en: 'Sacred consecration ritual infusing divine life force and cosmic consciousness into deities and idols.',
        desc_mr: 'अधिवास, न्यास, कुंभाभिषेक व प्राणप्रतिष्ठा मंत्रांनी मूर्तीमध्ये देवत्व जागृत केले जाते. घरगुती अथवा सार्वजनिक मंदिरांसाठी उपयुक्त.',
        desc_en: 'Elaborate ritual comprising Adhivasa, Nyasa, Abhishek, and Vedic invocation to awaken the divine living presence in the sacred murti.',
        duration: '३ ते ५ तास (3-5 Hours)',
        sort: 9,
        featured: false,
      },
      {
        slug: 'udak-shanti',
        name_mr: 'उदक शांती',
        name_en: 'Udak Shanti',
        cat: 'grah-vastu-shanti',
        short_mr: 'शुभ कार्यापूर्वी वातावरणाची व मनाची शुद्धी करणारा अत्यंत प्रभावी जलशांती विधी.',
        short_en: 'Vedic purification ceremony performed prior to auspicious milestones to bless the home with pure sacred water energies.',
        desc_mr: 'यजुर्वेदातील मंत्रांनी पाण्याच्या कलशाचे पूजन करून सर्व दिशांना व यजमानावर सिंचन केले जाते. घरातील अशुद्धी दूर होते.',
        desc_en: 'Consecrates holy water with rigorous Yajurvedic mantras to sanctify the home before weddings, upanayan, or significant achievements.',
        duration: '३ ते ३.५ तास (3-3.5 Hours)',
        sort: 10,
        featured: false,
      },
      {
        slug: 'navchandi-pujan',
        name_mr: 'नवचंडी पूजन व हवन',
        name_en: 'Navchandi Pujan & Havan',
        cat: 'special-rituals',
        short_mr: 'दुर्गा सप्तशती पाठ, नवचंडी यज्ञ व शत्रू, संकट निवारणासाठी महापूजा.',
        short_en: 'Powerful Durga Saptashati recitation and Navchandi Homa for divine protection, courage, and overcoming difficulties.',
        desc_mr: 'देवी दुर्गेच्या कृपेने सर्व संकटांचा नाश होऊन विजय व ऐश्वर्य प्राप्त होते. संपूर्ण सप्तशतीचे मंत्रोच्चार व आहुती दिल्या जातात.',
        desc_en: 'A grand invocation of Divine Mother Durga. Guruji guides the complete Chandi path recitation and holy havan invoking divine armor and grace.',
        duration: '४ ते ६ तास (4-6 Hours)',
        sort: 11,
        featured: true,
      },
      {
        slug: 'laghurudra',
        name_mr: 'लघुरुद्र अनुष्ठान',
        name_en: 'Laghurudra Anushthan',
        cat: 'special-rituals',
        short_mr: '१२१ रुद्रावर्तन, अभिषेक व शिवप्रीत्यर्थ भव्य लघुरुद्र यज्ञ.',
        short_en: 'Grand Shiva ritual comprising 121 recitations of Sri Rudram accompanied by sacred Abhishek and Havan.',
        desc_mr: 'भगवान शिवाच्या आराधनेतील सर्वोच्च अनुष्ठान. तीव्र आजार, कौटुंबिक सौख्य आणि मोक्षप्राप्तीसाठी लघुरुद्र अत्यंत फलदायी आहे.',
        desc_en: 'One of the most revered Vedic Shiva anushthans. Conducted with precision to eliminate deep-seated karmic obstacles and bring serenity.',
        duration: '४ ते ६ तास (4-6 Hours)',
        sort: 12,
        featured: true,
      },
      {
        slug: 'dharmik-vidhi',
        name_mr: 'सर्व प्रकारचे धार्मिक विधी',
        name_en: 'All Vedic Ceremonies & Sanskars',
        cat: 'other',
        short_mr: 'श्राद्ध, तर्पण, नामकरण, अन्नप्राशन, जावळ व इतर सर्व वैदिक शास्त्रोक्त विधी.',
        short_en: 'Comprehensive range of traditional sanskars, Shradh, Tarpan, Namkaran, Annaprashan, and Vedic ceremonies.',
        desc_mr: 'यजमानाच्या गरजेनुसार धर्मशास्त्र व परंपरेनुसार सर्व धार्मिक विधी योग्य संकल्प व मार्गदर्शनासह केले जातात.',
        desc_en: 'Every milestone from birth rites to memorial tarpan is performed with Vedic scriptural adherence and deep cultural understanding.',
        duration: 'विधीनुसार (As per ritual)',
        sort: 13,
        featured: false,
      },
      {
        slug: 'kundali-seva',
        name_mr: 'कुंडली तयार करून मिळेल',
        name_en: 'Janma Kundali Preparation & Guidance',
        cat: 'kundali-astrology',
        short_mr: 'अचूक जन्मकुंडली तयार करणे, ग्रहस्थिती विश्लेषण व शास्त्रोक्त उपाय.',
        short_en: 'Authentic Vedic horoscope chart preparation, planetary analysis, and scriptural remedial guidance.',
        desc_mr: 'जन्म तारीख, वेळ व स्थानानुसार अचूक संगणकीय व हस्तलिखित कुंडली तयार केली जाते. विवाह जुळवणी (गुणमेलन) व भविष्य विचार उपलब्ध.',
        desc_en: 'Detailed Janma Patrika preparation based on Vedic Jyotish principles. Includes Gun Milan for marriage and practical spiritual remedies.',
        duration: 'परामर्श (Consultation)',
        sort: 14,
        featured: true,
      },
    ];

    for (const s of initialServices) {
      const catId = catMap[s.cat] || null;
      await client.query(`
        INSERT INTO services (
          slug, name_mr, name_en, category_id,
          short_desc_mr, short_desc_en, detailed_desc_mr, detailed_desc_en,
          duration, is_featured, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET
          name_mr = $2, name_en = $3, category_id = $4,
          short_desc_mr = $5, short_desc_en = $6,
          detailed_desc_mr = $7, detailed_desc_en = $8,
          duration = $9, is_featured = $10, sort_order = $11;
      `, [
        s.slug, s.name_mr, s.name_en, catId,
        s.short_mr, s.short_en, s.desc_mr, s.desc_en,
        s.duration, s.featured, s.sort
      ]);
    }

    // 7. Homepage Sections
    const sections = [
      { key: 'hero', mr: 'मुख्य परिचय', en: 'Hero Banner', sort: 1 },
      { key: 'guruji_intro', mr: 'गुरुजींविषयी', en: 'Guruji Introduction', sort: 2 },
      { key: 'services', mr: 'प्रमुख पूजा व विधी', en: 'Featured Services', sort: 3 },
      { key: 'why_choose', mr: 'शास्त्रोक्त वैशिष्ट्ये', en: 'Why Choose Shastrokta', sort: 4 },
      { key: 'events', mr: 'आगामी कार्यक्रम', en: 'Upcoming Events', sort: 5 },
      { key: 'gallery', mr: 'छायाचित्र दालन', en: 'Photo Gallery Preview', sort: 6 },
      { key: 'videos', mr: 'व्हिडीओ', en: 'Video Preview', sort: 7 },
      { key: 'testimonials', mr: 'भक्तांचे अनुभव', en: 'Devotee Experiences', sort: 8 },
      { key: 'faq', mr: 'नेहमी विचारले जाणारे प्रश्न', en: 'FAQ Section', sort: 9 },
      { key: 'cta', mr: 'बुकिंग आवाहन', en: 'Final Booking CTA', sort: 10 },
    ];

    for (const sec of sections) {
      await client.query(`
        INSERT INTO homepage_sections (section_key, title_mr, title_en, sort_order, is_enabled)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (section_key) DO UPDATE SET title_mr = $2, title_en = $3, sort_order = $4;
      `, [sec.key, sec.mr, sec.en, sec.sort]);
    }

    // 8. Initial FAQs
    const faqs = [
      {
        q_mr: 'पूजा विधी बुक करण्यासाठी किती दिवस आधी संपर्क साधावा?',
        q_en: 'How many days in advance should we contact to book a puja?',
        a_mr: 'विवाह, वास्तुशांती किंवा मोठ्या विधींसाठी किमान १५ ते २० दिवस आधी संपर्क साधल्यास उत्तम मुहूर्त व पूर्वतयारी करता येते. लहान पूजेसाठी ३ ते ५ दिवस आधीही नियोजन करता येते.',
        a_en: 'For major ceremonies like Vivah Sanskar or Vastu Shanti, booking 15 to 20 days in advance is recommended to ensure ideal Muhurats and arrangements. Regular pujas can be scheduled 3 to 5 days prior.',
        cat: 'बुकिंग',
        sort: 1
      },
      {
        q_mr: 'पूजेचे साहित्य यजमानाने आणायचे असते की गुरुजी पुरवतात?',
        q_en: 'Does the host need to arrange the puja materials or does Guruji provide them?',
        a_mr: 'बुकिंग निश्चित झाल्यावर गुरुजी संपूर्ण साहित्याची स्पष्ट व सविस्तर यादी देतात. यजमानाच्या विनंतीनुसार आवश्यक असल्यास सर्व पूजेचे साहित्य गुरुजींच्या मार्गदर्शनाखाली उपलब्ध करून दिले जाते.',
        a_en: 'Upon booking confirmation, Guruji provides a clear and comprehensive list of necessary samagri. On request, assistance with sourcing authentic puja items can also be provided.',
        cat: 'साहित्य',
        sort: 2
      },
      {
        q_mr: 'नागपूरबाहेर जाऊन विधी केले जातात का?',
        q_en: 'Does Guruji travel outside Nagpur for conducting rituals?',
        a_mr: 'होय, पूर्व नियोजनानुसार नागपूर, विदर्भ व संपूर्ण महाराष्ट्रात यजमानांच्या निवासस्थानी शास्त्रोक्त विधी संपन्न केले जातात.',
        a_en: 'Yes, with prior scheduling and arrangement, Guruji travels across Nagpur, Vidarbha, and other regions in Maharashtra to conduct Vedic rituals.',
        cat: 'सेवा क्षेत्र',
        sort: 3
      },
      {
        q_mr: 'जन्मकुंडली तयार करण्यासाठी कोणती माहिती आवश्यक असते?',
        q_en: 'What information is required for preparing a Janma Kundali?',
        a_mr: 'अचूक जन्म तारीख, अचूक जन्म वेळ (सकाळ/दुपार/रात्र) आणि जन्माचे शहर/स्थान ही माहिती आवश्यक असते.',
        a_en: 'Accurate date of birth, precise time of birth, and exact place (city/town) of birth are required.',
        cat: 'कुंडली',
        sort: 4
      }
    ];

    for (const f of faqs) {
      await client.query(`
        INSERT INTO faqs (question_mr, question_en, answer_mr, answer_en, category, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING;
      `, [f.q_mr, f.q_en, f.a_mr, f.a_en, f.cat, f.sort]);
    }

    // 9. Initial Testimonials (authentic devotee experiences)
    const testimonials = [
      {
        name_mr: 'श्री. राजेश जोशी',
        name_en: 'Mr. Rajesh Joshi',
        loc_mr: 'धरमपेठ, नागपूर',
        loc_en: 'Dharampeth, Nagpur',
        rating: 5,
        comm_mr: 'आमच्या नवीन घराची वास्तुशांती प्रशांत पाठक गुरुजींच्या हस्ते अत्यंत शांत व प्रसन्न वातावरणात पार पडली. मंत्रोच्चार व साहित्याचे नियोजन खूप उत्कृष्ट होते.',
        comm_en: 'The Vastu Shanti of our new home was conducted with immense devotion by Guruji. The pure Vedic chanting brought profound peace to our family.',
      },
      {
        name_mr: 'श्री. मकरंद देशपांडे',
        name_en: 'Mr. Makarand Deshpande',
        loc_mr: 'रामनगर, नागपूर',
        loc_en: 'Ramnagar, Nagpur',
        rating: 5,
        comm_mr: 'मुलाचा उपनयन संस्कार अतिशय शास्त्रोक्त आणि शिस्तबद्ध पद्धतीने संपन्न झाला. प्रत्येक विधीचा अर्थ त्यांनी सहज समजावून सांगितला.',
        comm_en: 'My son\'s Upanayan ceremony was presided over with remarkable scriptural authenticity. Guruji patiently explained the deeper meaning of each ritual.',
      },
      {
        name_mr: 'श्रीमती अनुराधा कुलकर्णी',
        name_en: 'Mrs. Anuradha Kulkarni',
        loc_mr: 'लक्ष्मीनगर, नागपूर',
        loc_en: 'Laxminagar, Nagpur',
        rating: 5,
        comm_mr: 'श्रावण महिन्यातील रुद्र अभिषेक आणि सत्यनारायण पूजेचा अनुभव अतिशय मंगलमय होता. गुरुजींचे आभार!',
        comm_en: 'The Rudra Abhishek and Satyanarayan Puja during Shravan were conducted with absolute spiritual purity. Highly recommended.',
      }
    ];

    for (const t of testimonials) {
      await client.query(`
        INSERT INTO testimonials (author_name_mr, author_name_en, location_mr, location_en, rating, comment_mr, comment_en, is_approved)
        VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
        ON CONFLICT DO NOTHING;
      `, [t.name_mr, t.name_en, t.loc_mr, t.loc_en, t.rating, t.comm_mr, t.comm_en]);
    }

    // 10. Initial Events
    const events = [
      {
        title_mr: 'शारदीय नवरात्र दुर्गाष्टमी नवचंडी अनुष्ठान',
        title_en: 'Shardiya Navratri Durgashtami Navchandi Anushthan',
        desc_mr: 'शारदीय नवरात्रोत्सवाच्या पावन पर्वावर विशेष दुर्गा सप्तशती पाठ व नवचंडी महायज्ञ संपन्न केला जाईल. सर्व भक्तांनी सहभाग घ्यावा.',
        desc_en: 'Auspicious recitation of Sri Durga Saptashati and sacred Navchandi Mahayajna on the holy occasion of Durgashtami.',
        event_date: '2026-10-18',
        time: 'सकाळी ८:०० ते दुपारी २:००',
        loc: 'नागपूर (Nagpur)',
        sort: 1
      },
      {
        title_mr: 'त्रिपुरारी पौर्णिमा विशेष महाअभिषेक व दीपदान',
        title_en: 'Tripurari Purnima Special Maha Abhishek & Deepdan',
        desc_mr: 'कार्तिक पौर्णिमेच्या शुभ मुहूर्तावर भगवान शिवांचा रुद्राभिषेक आणि दीपोत्सव विधी.',
        desc_en: 'Ceremonial Shiva Rudra Abhishek and traditional lamp offering on Kartik Purnima.',
        event_date: '2026-11-24',
        time: 'सायंकाळी ६:०० ते ८:३०',
        loc: 'नागपूर (Nagpur)',
        sort: 2
      }
    ];

    for (const ev of events) {
      await client.query(`
        INSERT INTO events (title_mr, title_en, description_mr, description_en, event_date, event_time, location, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING;
      `, [ev.title_mr, ev.title_en, ev.desc_mr, ev.desc_en, ev.event_date, ev.time, ev.loc, ev.sort]);
    }

    // 11. Initial Blog Posts
    const blogs = [
      {
        slug: 'vastu-shanti-mahatva-niyam',
        title_mr: 'वास्तुशांती विधीचे महत्त्व आणि गृहप्रवेशाचे शास्त्रोक्त नियम',
        title_en: 'Significance of Vastu Shanti and Vedic Guidelines for Griha Pravesh',
        excerpt_mr: 'नवीन घरात प्रवेश करताना वास्तुशांती का करावी आणि त्यामुळे घरात सकारात्मक ऊर्जा कशी निर्माण होते, याबद्दल सविस्तर माहिती.',
        excerpt_en: 'Understand the Vedic science behind Vastu Shanti and how sanctifying space ensures long-term harmony.',
        content_mr: 'वास्तुशास्त्र हे भारतीय संस्कृतीचे प्राचीन विज्ञान आहे. घर किंवा कार्यालय ही केवळ भिंतींची इमारत नसून ती एक जिवंत ऊर्जा असते. जेव्हा आपण नवीन वास्तूत प्रवेश करतो, तेव्हा भूमी आणि दिशानिहाय दोषांचे निराकरण करणे आवश्यक असते. वास्तुशांती विधीमध्ये नवग्रह पूजन, वास्तुपुरुष पूजन, शांतिपाठ व अग्नीमुख हवन केले जाते. यामुळे घरात प्रवेश करणाऱ्या कुटुंबियांना स्वास्थ्य, समृद्धी आणि मानसिक शांती लाभते.',
        content_en: 'Vastu Shastra is the sacred Vedic architectural science of harmonizing nature and living spaces. When entering a newly constructed or acquired home, cleansing the environment of previous elemental impressions is vital. Vastu Shanti performs Navagraha pujan, invocation of the guardian deities of the ten directions (Digpalas), and sacred havan. This purifies the ether and ushers in divine blessings for the inhabitants.',
        cat: 'वास्तु शास्त्र',
      },
      {
        slug: 'satyanarayan-puja-faldruti-vidhi',
        title_mr: 'श्री सत्यनारायण पूजेची फलश्रुती व संकल्प पद्धती',
        title_en: 'The Divine Blessings and Proper Procedure of Shree Satyanarayan Puja',
        excerpt_mr: 'श्री सत्यनारायण पूजेचे महात्म्य आणि कलियुगात या पूजेचे विशेष स्थान याविषयी वैदिक मार्गदर्शन.',
        excerpt_en: 'Explore the significance of Bhagwan Satyanarayan worship in Kaliyuga and key rules for host sankalpa.',
        content_mr: 'स्कंद पुराणातील रेवाखंडात श्री सत्यनारायण व्रताचे विस्तृत वर्णन आले आहे. कोणत्याही शुभ प्रसंगी, संकटातून मुक्ती मिळाल्यावर किंवा दर पौर्णिमेला ही पूजा करणे श्रेयस्कर मानले जाते. या विधीमध्ये सत्य हेच ईश्वराचे रूप मानून त्याचे स्मरण केले जाते. मनोभावे केलेल्या पूजेने यजमानाच्या सर्व मनोकामना पूर्ण होतात.',
        content_en: 'The Skanda Purana highlights the boundless benevolence of Lord Satyanarayan. Performed during housewarmings, milestones, or monthly Purnimas, it reminds us of the supremacy of Truth and righteous living. With proper devotion and Prasad offering, obstacles in life melt away.',
        cat: 'पूजा महात्म्य',
      }
    ];

    for (const b of blogs) {
      await client.query(`
        INSERT INTO blog_posts (slug, title_mr, title_en, excerpt_mr, excerpt_en, content_mr, content_en, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO NOTHING;
      `, [b.slug, b.title_mr, b.title_en, b.excerpt_mr, b.excerpt_en, b.content_mr, b.content_en, b.cat]);
    }

    console.log('[DB-INIT] Database initialized and seeded successfully!');
  } catch (err) {
    console.error('[DB-INIT] Error initializing database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
