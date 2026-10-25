import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';

// 1. Direct Canonical Exact Matches (Titles, Pujas, Rituals, Sections)
const CANONICAL_EXACT_MAP = new Map<string, string>([
  // Core Pujas & Rituals
  ['कालसर्प दोष', 'Kaal Sarp Dosh'],
  ['कालसर्प दोष निवारण', 'Kaal Sarp Dosh Nivaran'],
  ['कालसर्प शांती', 'Kaal Sarp Shanti'],
  ['कालसर्प शांती पूजा', 'Kaal Sarp Shanti Puja'],
  ['कालसर्प शांती महापूजा', 'Kaal Sarp Shanti Mahapuja'],
  ['कालसर्प योग', 'Kaal Sarp Yoga'],
  ['वास्तुशांती', 'Vastu Shanti'],
  ['वास्तुशांती पूजा', 'Vastu Shanti Puja'],
  ['वास्तुशांती महापूजा', 'Vastu Shanti Mahapuja'],
  ['वास्तुदोष निवारण', 'Vastu Dosh Nivaran'],
  ['गृहप्रवेश', 'Griha Pravesh Puja'],
  ['गृहप्रवेश व वास्तुशांती', 'Griha Pravesh & Vastu Shanti'],
  ['सत्यनारायण', 'Shree Satyanarayan Puja'],
  ['सत्यनारायण पूजा', 'Shree Satyanarayan Puja'],
  ['श्री सत्यनारायण पूजा', 'Shree Satyanarayan Puja'],
  ['श्री सत्यनारायण महापूजा', 'Shree Satyanarayan Mahapuja'],
  ['रुद्र अभिषेक', 'Rudra Abhishek'],
  ['रुद्राभिषेक', 'Rudra Abhishek'],
  ['लघुरुद्र', 'Laghurudra Anushthan'],
  ['लघुरुद्र अनुष्ठान', 'Laghurudra Anushthan'],
  ['महारुद्र', 'Maharudra Anushthan'],
  ['महारुद्र अनुष्ठान', 'Maharudra Anushthan'],
  ['अतिरुद्र', 'Atirudra Mahayajna'],
  ['नवग्रह', 'Navgrah'],
  ['नवग्रह शांती', 'Navgrah Shanti'],
  ['नवग्रह पूजन', 'Navgrah Pujan'],
  ['नवग्रह होम', 'Navgrah Homam'],
  ['ग्रहशांती', 'Grah Shanti'],
  ['नक्षत्र शांती', 'Nakshatra Shanti'],
  ['अश्विनी नक्षत्र शांती', 'Ashwini Nakshatra Shanti'],
  ['मूळ नक्षत्र शांती', 'Mool Nakshatra Shanti'],
  ['ज्येष्ठा नक्षत्र शांती', 'Jyeshtha Nakshatra Shanti'],
  ['विवाह', 'Vivah Sanskar'],
  ['विवाह संस्कार', 'Vivah Sanskar (Sacred Wedding Ceremony)'],
  ['विवाह विधी', 'Vedic Vivah Rituals'],
  ['सप्तपदी', 'Saptapadi (Seven Sacred Steps)'],
  ['सीमांतपूजन', 'Simanta Pujan'],
  ['उपनयन संस्कार', 'Upanayan Sanskar (Sacred Thread Ceremony)'],
  ['मुंज', 'Munj (Upanayan Sanskar)'],
  ['मौंजीबंधन', 'Maunjibandhan Ceremony'],
  ['बटू पूजन', 'Batu Pujan'],
  ['मूर्ती प्राणप्रतिष्ठा', 'Murti Pran Pratishtha'],
  ['प्राणप्रतिष्ठा विधी', 'Murti Pran Pratishtha Ritual'],
  ['उदक शांती', 'Udak Shanti'],
  ['उदक शांती विधी', 'Udak Shanti Rituals'],
  ['नवचंडी', 'Navchandi Yajna'],
  ['नवचंडी यज्ञ', 'Navchandi Yajna'],
  ['नवचंडी पूजन', 'Navchandi Pujan'],
  ['शतचंडी यज्ञ', 'Shatchandi Mahayajna'],
  ['पितृदोष', 'Pitru Dosh'],
  ['पितृदोष शांती', 'Pitru Dosh Shanti'],
  ['पितृदोष निवारण', 'Pitru Dosh Nivaran'],
  ['नारायण नागबली', 'Narayan Nagbali Puja'],
  ['त्रिपिंडी श्राद्ध', 'Tripindi Shradh'],
  ['महामृत्युंजय जप', 'Mahamrityunjaya Japa'],
  ['महामृत्युंजय अनुष्ठान', 'Mahamrityunjaya Anushthan'],
  ['गणेश पूजन', 'Ganesh Pujan'],
  ['श्री गणेश अथर्वशीर्ष अभिषेक', 'Shree Ganesh Atharvashirsha Abhishek'],
  ['अथर्वशीर्ष अभिषेक', 'Atharvashirsha Abhishek'],
  ['संकष्टी चतुर्थी पूजन', 'Sankashti Chaturthi Pujan'],
  ['कालभैरव शांती', 'Kaal Bhairav Shanti'],
  ['कालभैरव पूजन', 'Kaal Bhairav Pujan'],
  ['सुंदरकांड पठण', 'Sundarkand Pathan'],
  ['मारुती अभिषेक', 'Hanuman Abhishek'],
  ['हनुमान चालीसा पठण', 'Hanuman Chalisa Pathan'],
  ['लक्ष्मी पूजन', 'Lakshmi Pujan'],
  ['कुबेर पूजन', 'Kuber Pujan'],
  ['धनत्रयोदशी पूजन', 'Dhantrayodashi Pujan'],
  ['दिवाळी लक्ष्मी पूजन', 'Diwali Lakshmi Pujan'],
  ['षोडश संस्कार', 'Shodash Sanskar (16 Sacred Vedic Samskaras)'],
  ['नामकरण संस्कार', 'Namkaran Sanskar (Naming Ceremony)'],
  ['जावळ संस्कार', 'Jawal Sanskar (Chaul Sanskar)'],
  ['चौल संस्कार', 'Chaul Sanskar (First Haircut Ceremony)'],
  ['अन्नप्राशन संस्कार', 'Annaprashan Sanskar'],
  ['डोहाळे जेवण', 'Dohale Jevan (Simantonnayana)'],
  ['साखरपुडा', 'Sakharpuda (Engagement Ceremony)'],
  ['वाङ्निश्चय', 'Vangnishchaya (Formal Betrothal)'],
  ['वाढदिवस संकल्प व अभिषेक', 'Birthday Sankalpa & Ayushya Homam'],
  ['आयुष्य होम', 'Ayushya Homam'],
  ['शांती विधी', 'Shanti Rituals'],
  ['हवन', 'Havan (Sacred Fire Ritual)'],
  ['यज्ञ', 'Yajna'],
  ['महाआरती', 'Maha Aarti'],
  ['पूजा', 'Puja'],
  ['महापूजा', 'Mahapuja'],

  // Section & Field Titles
  ['साहित्य यादी', 'List of Materials'],
  ['पूजा साहित्य', 'Puja Samagri List'],
  ['लागणारी सामग्री', 'Required Puja Samagri'],
  ['साहित्य सूची', 'Puja Materials List'],
  ['विधी प्रक्रिया', 'Ritual Procedure'],
  ['पूजा विधी क्रम', 'Puja Ritual Procedure'],
  ['विधी पद्धत', 'Ritual Methodology'],
  ['महत्त्व', 'Significance'],
  ['विधी महत्त्व', 'Ritual Significance'],
  ['धार्मिक महत्त्व', 'Spiritual Significance'],
  ['महत्त्व व लाभ', 'Significance & Benefits'],
  ['फलश्रुती', 'Spiritual Blessings & Benefits'],
  ['लाभ व फलप्राप्ती', 'Spiritual Benefits & Merits'],
  ['संक्षिप्त वर्णन', 'Short Description'],
  ['सविस्तर वर्णन', 'Detailed Description'],
  ['सविस्तर माहिती', 'Detailed Information'],
  ['शुभ मुहूर्त', 'Shubh Muhurat (Auspicious Timing)'],
  ['मुहूर्त', 'Shubh Muhurat'],
  ['जन्मकुंडली', 'Janma Kundali'],
  ['कुंडली मार्गदर्शन', 'Janma Kundali & Horoscope Guidance'],
  ['जन्मकुंडली व गुणमिलन', 'Janma Kundali & Gun Milan'],
  ['गुणमिलन', 'Kundali Matching & Gun Milan'],
  ['पत्रिका मिलन', 'Horoscope Matching'],
  ['वे.मु. प्रशांत पाठक', 'Ve.Mu. Prashant Pathak'],
  ['वे.मु. प्रशांत पाठक (गुरुजी)', 'Ve.Mu. Prashant Pathak (Guruji)'],
  ['वेदमूर्ती प्रशांत पाठक (गुरुजी)', 'Vedmurti Prashant Pathak (Guruji)'],
  ['शुल्कासाठी संपर्क करा', 'Contact for Dakshina / Fee'],
  ['नागपूर, महाराष्ट्र', 'Nagpur, Maharashtra'],
  ['यजमान नाव', 'Devotee / Host Name'],
  ['पत्ता', 'Address'],
  ['स्थान', 'Location'],
]);

// 2. Samagri & Specific Items Mapping (Used for lists)
const CANONICAL_SAMAGRI_MAP = new Map<string, string>([
  ['हळद', 'Turmeric (Haldi)'],
  ['हळदी', 'Turmeric (Haldi)'],
  ['कुंकू', 'Kumkum'],
  ['अष्टगंध', 'Ashtagandha'],
  ['गुलाल', 'Gulal'],
  ['रांगोळी', 'Rangoli Colors'],
  ['अक्षता', 'Akshata (Sacred Rice)'],
  ['तांदूळ', 'Rice Grains'],
  ['गहू', 'Wheat Grains'],
  ['तीळ', 'Black / White Sesame Seeds (Til)'],
  ['जव', 'Barley (Jau)'],
  ['विड्याची पाने', 'Betel Leaves (Vidyachi Paan)'],
  ['नागवेलीची पाने', 'Betel Leaves (Nagvel Paan)'],
  ['सुपारी', 'Betel Nuts (Supari)'],
  ['नारळ', 'Coconut (Shriphal)'],
  ['श्रीफळ', 'Shriphal (Sacred Coconut)'],
  ['सुके खोबरे', 'Dry Coconut (Khobare)'],
  ['बदाम', 'Almonds'],
  ['काजू', 'Cashews'],
  ['खारीक', 'Dry Dates (Kharik)'],
  ['तूप', 'Pure Cow Ghee'],
  ['गायीचे तूप', 'Pure Cow Ghee'],
  ['गायीचे शुद्ध तूप', 'Pure Cow Ghee'],
  ['दूध', 'Fresh Milk'],
  ['दही', 'Fresh Curd'],
  ['मध', 'Pure Honey'],
  ['साखर', 'Sugar'],
  ['पंचामृत', 'Panchamrit (Milk, Curd, Ghee, Honey, Sugar)'],
  ['कापूर', 'Camphor (Kapur)'],
  ['भीमसेनी कापूर', 'Bhimseni Camphor'],
  ['धूप', 'Dhoop'],
  ['अगरबत्ती', 'Incense Sticks (Agarbatti)'],
  ['समई', 'Samai (Brass Oil Lamp)'],
  ['निरांजन', 'Niranjan (Oil Lamp)'],
  ['वाती', 'Cotton Wicks (Vati)'],
  ['कापूरआरती', 'Kapur Aarti Lamp'],
  ['ताम्हण', 'Tamhan (Brass Ritual Plate)'],
  ['पळी', 'Pali (Sacred Spoon)'],
  ['पंचपात्र', 'Panchapatra (Sacred Water Vessel)'],
  ['कलश', 'Kalash (Sacred Pot)'],
  ['दुर्वा', 'Durva Grass'],
  ['बेलपत्र', 'Belpatra (Bilva Leaves)'],
  ['बेलाची पाने', 'Belpatra (Bilva Leaves)'],
  ['तुळशीपत्र', 'Tulsi Leaves'],
  ['तुळस', 'Sacred Tulsi'],
  ['फुले', 'Fresh Flowers'],
  ['फुलहार', 'Fresh Flower Garlands'],
  ['हार', 'Garlands'],
  ['जानवे', 'Janeu (Sacred Thread)'],
  ['यज्ञोपवीत', 'Yajnopavita (Sacred Thread)'],
  ['वस्त्र', 'Sacred Cloth (Vastra)'],
  ['धोतर', 'Dhoti'],
  ['उपरणे', 'Angavastra (Uparne)'],
  ['साडी-चोळी', 'Saree & Blouse Piece'],
  ['हवन समिधा', 'Havan Samidha (Sacred Wood)'],
  ['समिधा', 'Samidha'],
  ['गुळ', 'Jaggery'],
  ['पेढे', 'Pedhe (Sacred Sweets)'],
  ['मोदक', 'Modak'],
  ['लाडू', 'Laddus'],
  ['नैवेद्य', 'Naivedya (Sacred Offering)'],
  ['प्रसाद', 'Holy Prasad'],
  ['तीर्थप्रसाद', 'Teertha Prasad'],
  ['आरती', 'Aarti'],
  ['मंत्रपुष्पांजली', 'Mantra Pushpanjali'],
  ['गणपती पूजन', 'Ganpati Pujan'],
  ['कलश स्थापना', 'Kalash Sthapana'],
  ['दीपपूजन', 'Deepa Pujan'],
  ['गुरुवंदना', 'Guru Vandana'],
  ['स्वस्तिवाचन', 'Swasti Vachan'],
  ['षोडशोपचार पूजन', 'Shodashopachara Pujan'],
  ['मुख्य हवन', 'Main Havan'],
  ['पूर्णाहुती', 'Purnahuti'],
]);

// 3. Post-Translation Regex Replacements (Fixes MyMemory / Machine Distortions)
const VEDIC_REPLACEMENTS: [RegExp, string][] = [
  // Absurd machine translations for samagri & ritual terms
  [/\bAbsenteeism\b/gi, 'Akshata (Sacred Rice)'],
  [/\bVidya Leaves\b/gi, 'Betel Leaves (Vidyachi Paan)'],
  [/\bleafy ghee\b/gi, 'betel leaves, ghee'],
  [/\bleafy\b/gi, 'betel leaves'],
  [/\bClash\b/g, 'Kalash (Sacred Pot)'],
  [/\bBallot\b/g, 'Belpatra (Bilva Leaves)'],
  [/\bBellet\b/gi, 'Belpatra (Bilva Leaves)'],
  [/\bNostalgia\b/gi, 'Naivedya (Sacred Food Offering)'],
  [/\bSupeari\b/gi, 'Betel Nuts (Supari)'],
  [/\bKunku\b/gi, 'Kumkum'],
  [/\bPure ghee of the cow\b/gi, 'Pure Cow Ghee'],
  [/\bFulhar\b/gi, 'Flower Garland'],
  [/\bSami\b/g, 'Samai (Brass Oil Lamp)'],
  [/\bTamhan\b/gi, 'Tamhan (Brass Ritual Plate)'],
  [/\bPanchamrut\b/gi, 'Panchamrit'],
  [/\bTirathprasad\b/gi, 'Teertha Prasad'],
  [/\bDurwa\b/gi, 'Durva Grass'],

  // Pujas, Shantis & Doshas
  [/\bCalSurprise Fault\b/gi, 'Kaal Sarp Dosh'],
  [/\bCalSurprise\b/gi, 'Kaal Sarp'],
  [/\bCalasarp Shanti Mahapuja\b/gi, 'Kaal Sarp Shanti Mahapuja'],
  [/\bCalasarp\b/gi, 'Kaal Sarp'],
  [/\bCalsarp\b/gi, 'Kaal Sarp'],
  [/\bKalsarpa\b/gi, 'Kaal Sarp'],
  [/\bKalsarp\b/gi, 'Kaal Sarp'],
  [/\bBlack snake defect\b/gi, 'Kaal Sarp Dosh'],
  [/\bTime snake defect\b/gi, 'Kaal Sarp Dosh'],
  [/\bHomeland Security and Defecation\b/gi, 'Griha Shanti & Dosha Nivaran'],
  [/\bHomeland Security\b/gi, 'Griha Shanti (Home Peace)'],
  [/\bDefecation\b/gi, 'Dosha Nivaran (Remediation)'],
  [/\bLegal process\b/gi, 'Ritual Procedure'],
  [/\bLegal procedure\b/gi, 'Ritual Procedure'],
  [/\bLaw procedure\b/gi, 'Ritual Procedure'],
  [/\bLaw rituals\b/gi, 'Vedic Rituals'],
  [/\bLegal rituals\b/gi, 'Vedic Rituals'],
  [/\bArchitecture\b/g, 'Vastu Shanti'],
  [/\barchitectural peace\b/gi, 'Vastu Shanti'],
  [/\bHome Architecture\b/gi, 'Vastu Shanti'],
  [/\bLiterature list\b/gi, 'List of Materials'],
  [/\bMaterial list\b/gi, 'List of Materials'],
  [/\bTurmeric, turmeric\b/gi, 'Turmeric, Kumkum'],
  [/\bTruth Narayan Worship\b/gi, 'Shree Satyanarayan Puja'],
  [/\bTruth Narayan\b/gi, 'Satyanarayan'],
  [/\bSatyanarayana\b/gi, 'Satyanarayan'],
  [/\bMarriage culture\b/gi, 'Sacred Wedding Ceremony (Vivah Sanskar)'],
  [/\bWedding culture\b/gi, 'Sacred Wedding Ceremony (Vivah Sanskar)'],
  [/\bThread ceremony\b/gi, 'Upanayan Sanskar (Sacred Thread Ceremony)'],
  [/\bCow donation\b/gi, 'Go Daan (Cow Donation)'],
  [/\bAncestral defect\b/gi, 'Pitru Dosh'],
  [/\bAncestral peace\b/gi, 'Pitru Shanti'],
  [/\bPitrudosh\b/gi, 'Pitru Dosh'],
  [/\bFumes and odors\b/gi, 'Bhasma and Ashtagandha'],
  [/\bVM Prashant Pathak\b/gi, 'Ve.Mu. Prashant Pathak'],
  [/\bV\.M\. Prashant Pathak\b/gi, 'Ve.Mu. Prashant Pathak'],
  [/\bVM\b/g, 'Ve.Mu.'],
  [/\bV\.M\.\b/g, 'Ve.Mu.'],
  [/\bVed Murti\b/gi, 'Vedmurti'],
  [/\bVedamurti\b/gi, 'Vedmurti'],
  [/\bscientific manner\b/gi, 'Shastrokta (scriptural) manner'],
  [/\bClassical Rituals\b/gi, 'Vedic Rituals'],
  [/\bShravan Mondays\b/gi, 'Shravan Somwar'],
  [/\bto worship\b/gi, 'for Satyanarayan Puja'],
  [/\bScriptural Worship\b/gi, 'Shastrokta Puja Rituals'],
  [/\bScriptural worship\b/gi, 'Shastrokta puja rituals'],
  [/\bWorship rituals\b/gi, 'Puja rituals'],
  [/\bWorship\b/g, 'Puja'],
  [/\bworship\b/g, 'puja'],
  [/\bPooja\b/g, 'Puja'],
  [/\bpooja\b/g, 'puja'],
  [/\bVastushanti\b/gi, 'Vastu Shanti'],
  [/\bRudrabhisheka\b/gi, 'Rudra Abhishek'],
  [/\bRudrabhishek\b/gi, 'Rudra Abhishek'],
  [/\bNavagraha\b/gi, 'Navgrah'],
  [/\bMuhurta\b/gi, 'Muhurat'],
  [/\bDakshina\b/gi, 'Dakshina'],
  [/\bMahamrityunjay\b/gi, 'Mahamrityunjaya'],
  [/\bImportance\b/g, 'Significance'],
  [/\bimportance\b/g, 'significance'],
];

function refineVedicTranslation(text: string): string {
  let refined = text;
  for (const [regex, val] of VEDIC_REPLACEMENTS) {
    refined = refined.replace(regex, val);
  }
  return refined;
}

// Translate a single segment (<= 400 chars) via MyMemory
async function translateMyMemoryChunk(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=mr|en`;
  const res = await fetch(url, { headers: { 'User-Agent': 'PrashantPathakGurujiWebsite/1.0' } });
  if (!res.ok) {
    throw new Error(`MyMemory API error: ${res.statusText}`);
  }
  const data = await res.json();
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  return text;
}

// Split full text into paragraphs, handle list structures and small chunks
async function translateWithMyMemory(fullText: string): Promise<string> {
  const paragraphs = fullText.split('\n');
  const translatedParas: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      translatedParas.push('');
      continue;
    }

    // Check if the paragraph is a comma-separated list of items (e.g. puja samagri)
    if (trimmed.includes(',') || trimmed.includes('،')) {
      const parts = trimmed.split(/([,،]+)/);
      const translatedParts: string[] = [];
      for (const part of parts) {
        const itemTrim = part.trim();
        if (!itemTrim || /^[,،\s]+$/.test(part)) {
          translatedParts.push(part.endsWith(' ') ? part : part + ' ');
          continue;
        }

        // Check canonical samagri dictionary first
        if (CANONICAL_SAMAGRI_MAP.has(itemTrim)) {
          translatedParts.push(CANONICAL_SAMAGRI_MAP.get(itemTrim)!);
        } else if (CANONICAL_EXACT_MAP.has(itemTrim)) {
          translatedParts.push(CANONICAL_EXACT_MAP.get(itemTrim)!);
        } else {
          try {
            const rawChunk = await translateMyMemoryChunk(itemTrim);
            translatedParts.push(refineVedicTranslation(rawChunk));
          } catch {
            translatedParts.push(itemTrim);
          }
        }
      }
      translatedParas.push(translatedParts.join(''));
      continue;
    }

    // Check if paragraph starts with list numbering like "१. " or "1. "
    const listMatch = trimmed.match(/^([0-9१२३४५६७८९]+[\.\-\)]\s*)(.*)$/);
    if (listMatch) {
      const prefix = listMatch[1];
      const rest = listMatch[2].trim();
      if (CANONICAL_SAMAGRI_MAP.has(rest)) {
        translatedParas.push(prefix + CANONICAL_SAMAGRI_MAP.get(rest)!);
        continue;
      }
      if (CANONICAL_EXACT_MAP.has(rest)) {
        translatedParas.push(prefix + CANONICAL_EXACT_MAP.get(rest)!);
        continue;
      }
      try {
        const tr = await translateMyMemoryChunk(rest);
        translatedParas.push(prefix + refineVedicTranslation(tr));
      } catch {
        translatedParas.push(trimmed);
      }
      continue;
    }

    // Standard paragraph translation
    if (trimmed.length <= 400) {
      const translated = await translateMyMemoryChunk(trimmed);
      translatedParas.push(refineVedicTranslation(translated));
    } else {
      // Split into sentence-sized chunks for longer text
      const sentences = trimmed.split(/([।?!.])/).filter(Boolean);
      let chunk = '';
      const chunkResults: string[] = [];

      for (const s of sentences) {
        if ((chunk + s).length > 350) {
          if (chunk.trim()) {
            const tr = await translateMyMemoryChunk(chunk.trim());
            chunkResults.push(refineVedicTranslation(tr));
          }
          chunk = s;
        } else {
          chunk += s;
        }
      }
      if (chunk.trim()) {
        const tr = await translateMyMemoryChunk(chunk.trim());
        chunkResults.push(refineVedicTranslation(tr));
      }
      translatedParas.push(chunkResults.join(' '));
    }
  }

  return translatedParas.join('\n');
}

// Gemini AI Translation (when GEMINI_API_KEY is configured)
async function translateWithGemini(text: string, apiKey: string): Promise<string> {
  const prompt = `You are a professional Vedic scholar and linguist specializing in Hindu pujas, Sanskrit rituals, and Marathi cultural texts.
Translate the following Marathi text into elegant, natural, reverent English.
Follow these mandatory translation standards:
- कालसर्प दोष -> Kaal Sarp Dosh
- पूजा -> Puja
- महत्त्व -> Significance
- साहित्य यादी -> List of Materials
- विधी प्रक्रिया -> Ritual Procedure
- वास्तुशांती -> Vastu Shanti
- वे.मु. प्रशांत पाठक -> Ve.Mu. Prashant Pathak
- Preserve all proper nouns, Sanskrit terms, and sacred ritual names authentically.
- Preserve list numbering, formatting, and line breaks exactly.
- Return ONLY the direct English translation without surrounding quotes, commentary, or explanation.

Marathi:
${text}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini translation HTTP ${res.status}`);
  }
  const data = await res.json();
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidate) {
    throw new Error('No candidate returned from Gemini');
  }
  return candidate.trim();
}

// Google Cloud Translate API (when GOOGLE_TRANSLATE_API_KEY is configured)
async function translateWithGoogleCloud(text: string, apiKey: string): Promise<string> {
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'mr', target: 'en', format: 'text' }),
  });
  if (!res.ok) {
    throw new Error(`Google Cloud Translation HTTP ${res.status}`);
  }
  const data = await res.json();
  const translated = data.data?.translations?.[0]?.translatedText;
  if (!translated) {
    throw new Error('No translation in Google Cloud response');
  }
  return translated;
}

export async function POST(req: NextRequest) {
  // Enforce admin authentication
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const rawText = typeof body.text === 'string' ? body.text : '';
    const text = sanitizeString(rawText);

    if (!text || text.trim() === '') {
      return NextResponse.json({ translatedText: '', provider: 'none' });
    }

    const trimmed = text.trim();

    // 0. Instant canonical dictionary match for known puja titles, rituals and field names
    if (CANONICAL_EXACT_MAP.has(trimmed)) {
      return NextResponse.json({
        success: true,
        translatedText: CANONICAL_EXACT_MAP.get(trimmed)!,
        provider: 'Vedic Canonical Dictionary',
      });
    }

    if (CANONICAL_SAMAGRI_MAP.has(trimmed)) {
      return NextResponse.json({
        success: true,
        translatedText: CANONICAL_SAMAGRI_MAP.get(trimmed)!,
        provider: 'Vedic Canonical Dictionary',
      });
    }

    let translated = '';
    let provider = 'MyMemory';

    // Tier 1: Gemini AI if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        translated = await translateWithGemini(trimmed, process.env.GEMINI_API_KEY);
        provider = 'Gemini';
      } catch (geminiErr) {
        console.warn('[TRANSLATE] Gemini failed, falling back:', geminiErr);
      }
    }

    // Tier 2: Google Cloud Translate if configured and Gemini not used/failed
    if (!translated && process.env.GOOGLE_TRANSLATE_API_KEY) {
      try {
        translated = await translateWithGoogleCloud(trimmed, process.env.GOOGLE_TRANSLATE_API_KEY);
        provider = 'Google Cloud';
      } catch (gcloudErr) {
        console.warn('[TRANSLATE] Google Cloud failed, falling back to MyMemory:', gcloudErr);
      }
    }

    // Tier 3: MyMemory with Vedic List & Segment Refinement
    if (!translated) {
      translated = await translateWithMyMemory(trimmed);
      provider = 'MyMemory';
    }

    // Final pass of Vedic term refinement
    const refined = refineVedicTranslation(translated.trim());

    return NextResponse.json({
      success: true,
      translatedText: refined,
      provider,
    });
  } catch (err: any) {
    console.error('[TRANSLATE-ERROR]', err);
    return NextResponse.json(
      { error: err.message || 'भाषांतर अयशस्वी / Translation failed' },
      { status: 500 }
    );
  }
}
