import fs from 'fs';
import path from 'path';

const updates = {
  mr: {
    guruji_intro: {
      shastrokta_badge: '१००% शुद्ध शास्त्रोक्त परंपरा',
    },
    why_choose: {
      item1_title: 'शुद्ध वैदिक मंत्रोच्चार',
      item1_desc: 'प्रत्येक मंत्राचे अचूक उच्चार व शास्त्रोक्त विधीचे काटेकोर पालन.',
      item2_title: 'संपूर्ण साहित्य यादी व मार्गदर्शन',
      item2_desc: 'यजमानांना विधीपूर्वी सर्व आवश्यक साहित्याची पूर्वतयारी व मार्गदर्शन.',
      item3_title: 'मुहूर्त व संकल्प शुचिता',
      item3_desc: 'योग्य तिथी, नक्षत्र व मुहूर्तावर शुभ कार्याची सुरुवात.',
    },
    booking_flow: {
      title: 'पूजा विधी आयोजन प्रक्रिया',
      subtitle: 'अगदी सोप्या ४ टप्प्यांमध्ये आपल्या घरात वैदिक पूजा संपन्न करा',
      step1_title: '१ — पूजा निवडा',
      step1_desc: 'आपल्या आवश्यकतेनुसार वास्तुशांती, सत्यनारायण किंवा इतर विधी निवडा.',
      step2_title: '२ — माहिती व तारीख द्या',
      step2_desc: 'ऑनलाइन फॉर्ममध्ये आपली माहिती, इच्छित तारीख व वेळ नोंदवा.',
      step3_title: '३ — गुरुजींशी संपर्क',
      step3_desc: 'गुरुजी आपल्याशी चर्चा करून योग्य मुहूर्त व साहित्य यादी निश्चित करतील.',
      step4_title: '४ — पूजा आयोजन',
      step4_desc: 'निश्चित दिवशी पवित्र मंत्रोच्चारात मंगल विधी संपन्न होईल.',
    },
  },
  en: {
    guruji_intro: {
      shastrokta_badge: '100% Authentic Shastrokta Tradition',
    },
    why_choose: {
      item1_title: 'Flawless Vedic Chanting',
      item1_desc: 'Precise mantra pronunciation and strict adherence to Vedic injunctions.',
      item2_title: 'Complete Samagri Guidance',
      item2_desc: 'Comprehensive preparation guidance and item lists provided beforehand.',
      item3_title: 'Muhurat & Sankalpa Purity',
      item3_desc: 'Careful determination of auspicious planetary timing for lasting auspiciousness.',
    },
    booking_flow: {
      title: 'Sacred Ceremony Booking Process',
      subtitle: 'Organize an authentic Vedic ceremony in your home in 4 simple steps',
      step1_title: '1 — Choose Sacred Ritual',
      step1_desc: 'Select Vastu Shanti, Satyanarayan, or any required Vedic ceremony.',
      step2_title: '2 — Provide Details & Date',
      step2_desc: 'Submit your preferred date, location, and family details online.',
      step3_title: '3 — Consultation with Guruji',
      step3_desc: 'Guruji verifies planetary muhurats and provides the preparation checklist.',
      step4_title: '4 — Auspicious Ceremony',
      step4_desc: 'Rituals conducted with holy mantras bringing peace and prosperity.',
    },
  },
  hi: {
    guruji_intro: {
      shastrokta_badge: '१००% शुद्ध शास्त्रोक्त परंपरा',
    },
    why_choose: {
      item1_title: 'शुद्ध वैदिक मंत्रोच्चार',
      item1_desc: 'सटीक मंत्रोच्चारण एवं वैदिक नियमों का निष्ठापूर्वक पालन।',
      item2_title: 'पूर्ण सामग्री सूची एवं मार्गदर्शन',
      item2_desc: 'यजमान को पूजन पूर्व सभी आवश्यक सामग्रियों की सूची और पूर्व तैयारी का मार्गदर्शन।',
      item3_title: 'मुहूर्त एवं संकल्प शुचिता',
      item3_desc: 'उचित तिथि, नक्षत्र एवं शुभ लग्न मुहूर्त में कार्य का शुभारंभ।',
    },
    booking_flow: {
      title: 'पूजा अनुष्ठान आयोजन प्रक्रिया',
      subtitle: 'सरल ४ चरणों में अपने घर पर वैदिक अनुष्ठान संपन्न कराएं',
      step1_title: '१ — अनुष्ठान चुनें',
      step1_desc: 'अपनी आवश्यकतानुसार वास्तुशांति, सत्यनारायण या अन्य पूजा चुनें।',
      step2_title: '२ — विवरण एवं तिथि दें',
      step2_desc: 'ऑनलाइन फॉर्म में अपनी जानकारी, इच्छित तिथि और समय दर्ज करें।',
      step3_title: '३ — गुरुजी से परामर्श',
      step3_desc: 'गुरुजी संपर्क कर शुभ मुहूर्त एवं सामग्री सूची सुनिश्चित करेंगे।',
      step4_title: '४ — मंगल अनुष्ठान',
      step4_desc: 'निर्धारित दिवस पर पावन वेदमंत्रों के साथ अनुष्ठान संपन्न होगा।',
    },
  },
  te: {
    guruji_intro: {
      shastrokta_badge: '100% శాస్త్రోక్త వైదిక సంప్రదాయం',
    },
    why_choose: {
      item1_title: 'స్వచ్ఛమైన వేద మంత్రోచ్ఛారణ',
      item1_desc: 'ప్రతి మంత్రం యొక్క స్పష్టమైన ఉచ్ఛారణ మరియు విధి విధానాల పరిపూర్ణ పాలన.',
      item2_title: 'సామాగ్రి జాబితా మరియు మార్గదర్శనం',
      item2_desc: 'పూజకు ముందే అవసరమైన సామాగ్రి వివరాలు మరియు ముందస్తు సన్నాహాల మార్గదర్శనం.',
      item3_title: 'ముహూర్త పరిశీలన మరియు సంకల్ప శుద్ధి',
      item3_desc: 'శాస్త్రోక్తమైన శుభ ముహూర్తంలో పూజా సంకల్పం.',
    },
    booking_flow: {
      title: 'పూజా నిర్వహణ ప్రక్రియ',
      subtitle: 'సులభమైన 4 దశల్లో మీ ఇంట్లో వైదిక పూజను నిర్వహించండి',
      step1_title: '1 — పూజను ఎంచుకోండి',
      step1_desc: 'మీ అవసరానికి తగిన వాస్తుశాంతి, సత్యనారాయణ లేదా ఇతర పూజను ఎంపిక చేయండి.',
      step2_title: '2 — వివరాలు & తేదీ ఇవ్వండి',
      step2_desc: 'ఆన్‌లైన్ ఫారమ్‌లో మీ వివరాలు, కావలసిన తేదీ మరియు సమయం నమోదు చేయండి.',
      step3_title: '3 — గురూజీతో సంప్రదింపు',
      step3_desc: 'గురూజీ మీతో మాట్లాడి శుభ ముహూర్తం మరియు సామాగ్రి వివరాలు నిర్ణయిస్తారు.',
      step4_title: '4 — మంగళ పూజా నిర్వహణ',
      step4_desc: 'నిర్ణయించిన రోజున పవిత్ర మంత్రోచ్ఛారణలతో పూజా కార్యక్రమం సాగుతుంది.',
    },
  },
  kn: {
    guruji_intro: {
      shastrokta_badge: '100% ಶಾಸ್ತ್ರೋಕ್ತ ವೈದಿಕ ಪರಂಪರೆ',
    },
    why_choose: {
      item1_title: 'ಶುದ್ಧ ವೈದಿಕ ಮಂತ್ರೋಚ್ಛಾರಣೆ',
      item1_desc: 'ಪ್ರತಿಯೊಂದು ಮಂತ್ರದ ನಿಖರ ಉಚ್ಛಾರಣೆ ಹಾಗೂ ನಿಯಮಗಳ ಪರಿಪಾಲನೆ.',
      item2_title: 'ಸಾಮಗ್ರಿ ಪಟ್ಟಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ',
      item2_desc: 'ಪೂಜೆಗೆ ಬೇಕಾಗುವ ಎಲ್ಲಾ ಸಾಮಗ್ರಿಗಳ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶನ.',
      item3_title: 'ಮುಹೂರ್ತ ಮತ್ತು ಸಂಕಲ್ಪ ಶುದ್ಧತೆ',
      item3_desc: 'ಸೂಕ್ತ ತಿಥಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಶುಭ ಲಗ್ನ ಮುಹೂರ್ತದಲ್ಲಿ ಪೂಜಾರಂಭ.',
    },
    booking_flow: {
      title: 'ಪೂಜಾ ಆಯೋಜನೆ ಪ್ರಕ್ರಿಯೆ',
      subtitle: 'ಸರಳ 4 ಹಂತಗಳಲ್ಲಿ ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ವೈದಿಕ ಪೂಜೆಯನ್ನು ನೆರವೇರಿಸಿ',
      step1_title: '1 — ಪೂಜೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      step1_desc: 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ವಾಸ್ತುಶಾಂತಿ, ಸತ್ಯನಾರಾಯಣ ಅಥವಾ ಇತರ ಪೂಜೆಯನ್ನು ಆರಿಸಿ.',
      step2_title: '2 — ವಿವರ ಹಾಗೂ ದಿನಾಂಕ ನೀಡಿ',
      step2_desc: 'ಆನ್‌ಲೈನ್ ಫಾರ್ಮ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಮಾಹಿತಿ, ಅಪೇಕ್ಷಿತ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ದಾಖಲಿಸಿ.',
      step3_title: '3 — ಗುರೂಜಿಯವರ ಸಂಪರ್ಕ',
      step3_desc: 'ಗುರೂಜಿಯವರು ನಿಮ್ಮೊಂದಿಗೆ ಚರ್ಚಿಸಿ ಶುಭ ಮುಹೂರ್ತ ಹಾಗೂ ಸಾಮಗ್ರಿ ಪಟ್ಟಿ ತಿಳಿಸುತ್ತಾರೆ.',
      step4_title: '4 — ಶುಭ ಪೂಜಾ ಆಯೋಜನೆ',
      step4_desc: 'ನಿಗದಿತ ದಿನದಂದು ಪವಿತ್ರ ವೇದಮಂತ್ರಗಳೊಂದಿಗೆ ಮಂಗಳಕರ ವಿಧಿ ಸಾಂಗವಾಗಿ ನೆರವೇರುತ್ತದೆ.',
    },
  },
  ta: {
    guruji_intro: {
      shastrokta_badge: '100% சாஸ்திர வேத பாரம்பரியம்',
    },
    why_choose: {
      item1_title: 'தூய வேத மந்திர உச்சரிப்பு',
      item1_desc: 'துல்லியமான மந்திர உச்சரிப்பு மற்றும் சாஸ்திர விதிகளைப் பின்பற்றுதல்.',
      item2_title: 'முழுமையான பூஜை பொருட்கள் பட்டியல்',
      item2_desc: 'பூஜைக்கு தேவையான அனைத்து பொருட்களின் விரிவான பட்டியல் மற்றும் வழிகாட்டுதல்.',
      item3_title: 'முகூர்த்தம் மற்றும் சங்கல்ப சுத்தி',
      item3_desc: 'உரிய திதி, நட்சத்திரம் மற்றும் சுப லக்ன முகூர்த்தத்தில் தொடங்குதல்.',
    },
    booking_flow: {
      title: 'பூஜை ஏற்பாட்டு நடைமுறை',
      subtitle: 'எளிய 4 படிகளில் உங்கள் இல்லத்தில் வேத பூஜையை நடத்துங்கள்',
      step1_title: '1 — பூஜையை தேர்வு செய்க',
      step1_desc: 'உங்கள் தேவைக்கேற்ப வாஸ்து சாந்தி, சத்யநாராயண அல்லது பிற பூஜையை தேர்வு செய்யவும்.',
      step2_title: '2 — விவரம் & தேதி தருக',
      step2_desc: 'படிவத்தில் உங்கள் விவரங்கள், விரும்பிய தேதி மற்றும் நேரத்தை பதிவு செய்க.',
      step3_title: '3 — குருஜியுடன் கலந்தாலோசனை',
      step3_desc: 'குருஜி தொடர்பு கொண்டு சுப முகூர்த்தம் மற்றும் பொருட்கள் பட்டியலை உறுதி செய்வார்.',
      step4_title: '4 — மங்கள பூஜை வழிபாடு',
      step4_desc: 'குறிப்பிட்ட நாளில் புனித வேத மந்திரங்களுடன் வழிபாடு மங்களகரமாக நடைபெறும்.',
    },
  },
  ml: {
    guruji_intro: {
      shastrokta_badge: '100% ശാസ്ത്രീയ വൈദിക പാരമ്പര്യം',
    },
    why_choose: {
      item1_title: 'ശുദ്ധ വൈദിക മന്ത്രോച്ചാരണം',
      item1_desc: 'കൃത്യമായ മന്ത്രോച്ചാരണവും വൈദിക വിധികളുടെ പരിപാലനവും.',
      item2_title: 'പൂർണ്ണ സാമഗ്രി ലിസ്റ്റും മാർഗ്ഗനിർദ്ദേശവും',
      item2_desc: 'പൂജയ്ക്ക് ആവശ്യമായ എല്ലാ സാമഗ്രികളുടെയും കൃത്യമായ വിവരങ്ങൾ മുൻകൂട്ടി നൽകുന്നു.',
      item3_title: 'മുഹൂർത്ത ശുദ്ധിയും സങ്കൽപ്പവും',
      item3_desc: 'യോജ്യമായ തിഥി, നക്ഷത്രം, ശുഭ മുഹൂർത്തത്തിൽ കർമ്മങ്ങൾ ആരംഭിക്കുന്നു.',
    },
    booking_flow: {
      title: 'പൂജാ കർമ്മങ്ങളുടെ ക്രമം',
      subtitle: 'ലളിതമായ 4 ഘട്ടങ്ങളിലൂടെ നിങ്ങളുടെ ഭവനത്തിൽ വൈദിക പൂജ നടത്തുക',
      step1_title: '1 — പൂജ തെരഞ്ഞെടുക്കുക',
      step1_desc: 'നിങ്ങളുടെ ആവശ്യത്തിനനുസരിച്ച് വാസ്തുശാന്തി, സത്യനാരായണ അല്ലെങ്കിൽ മറ്റ് പൂജകൾ തെരഞ്ഞെടുക്കുക.',
      step2_title: '2 — വിവരങ്ങളും തീയതിയും നൽകുക',
      step2_desc: 'ഓൺലൈൻ ഫോമിൽ നിങ്ങളുടെ വിവരങ്ങളും ആവശ്യമായ തീയതിയും രേഖപ്പെടുത്തുക.',
      step3_title: '3 — ഗുരുജിയുമായി ആശയവിനിമയം',
      step3_desc: 'ഗുരുജി നിങ്ങളുമായി സംസാരിച്ച് ശുഭമുഹൂർത്തവും പൂജാസാമഗ്രികളുടെ ലിസ്റ്റും നിശ്ചയിക്കും.',
      step4_title: '4 — മംഗള പൂജാ ചടങ്ങ്',
      step4_desc: 'നിശ്ചയിച്ച ശുഭദിനത്തിൽ പവിത്ര മന്ത്രോച്ചാരണങ്ങളോടെ പൂജ ഭക്തിപൂർവ്വം നടക്കും.',
    },
  },
};

for (const [lang, data] of Object.entries(updates)) {
  const filePath = path.join('src/lib/locales', `${lang}.json`);
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!current.guruji_intro) current.guruji_intro = {};
  current.guruji_intro.shastrokta_badge = data.guruji_intro.shastrokta_badge;

  if (!current.why_choose) current.why_choose = {};
  Object.assign(current.why_choose, data.why_choose);

  current.booking_flow = data.booking_flow;

  fs.writeFileSync(filePath, JSON.stringify(current, null, 2) + '\n', 'utf8');
  console.log(`Updated locale file: ${filePath}`);
}
