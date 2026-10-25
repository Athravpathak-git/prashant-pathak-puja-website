import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';

// Common Vedic terminology dictionary to ensure reverent, accurate English translations
const VEDIC_REPLACEMENTS: [RegExp, string][] = [
  // Mistranslation fixes for common religious phrases
  [/\bHomeland Security and Defecation\b/gi, 'Griha Shanti & Dosha Nivaran'],
  [/\bHomeland Security\b/gi, 'Griha Shanti (Home Peace)'],
  [/\bDefecation\b/gi, 'Dosha Nivaran (Remediation)'],
  [/\bFumes and odors\b/gi, 'Bhasma and Ashtagandha'],
  [/\bBellet\b/gi, 'Belpatra (Bilva leaves)'],
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
  [/\bVastushanti\b/gi, 'Vastu Shanti'],
  [/\bSatyanarayana\b/gi, 'Satyanarayan'],
  [/\bRudrabhisheka\b/gi, 'Rudra Abhishek'],
  [/\bRudrabhishek\b/gi, 'Rudra Abhishek'],
  [/\bNavagraha\b/gi, 'Navgrah'],
  [/\bKalsarpa\b/gi, 'Kalsarp'],
  [/\bPitrudosh\b/gi, 'Pitru Dosh'],
  [/\bMuhurta\b/gi, 'Muhurat'],
  [/\bDakshina\b/gi, 'Dakshina'],
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

// Split full text into paragraphs and small chunks to preserve formatting and avoid limits
async function translateWithMyMemory(fullText: string): Promise<string> {
  const paragraphs = fullText.split('\n');
  const translatedParas: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      translatedParas.push('');
      continue;
    }

    if (trimmed.length <= 400) {
      const translated = await translateMyMemoryChunk(trimmed);
      translatedParas.push(translated);
    } else {
      // Split into sentence-sized chunks for longer text
      const sentences = trimmed.split(/([।?!.])/).filter(Boolean);
      let chunk = '';
      const chunkResults: string[] = [];

      for (const s of sentences) {
        if ((chunk + s).length > 350) {
          if (chunk.trim()) {
            chunkResults.push(await translateMyMemoryChunk(chunk.trim()));
          }
          chunk = s;
        } else {
          chunk += s;
        }
      }
      if (chunk.trim()) {
        chunkResults.push(await translateMyMemoryChunk(chunk.trim()));
      }
      translatedParas.push(chunkResults.join(' '));
    }
  }

  return translatedParas.join('\n');
}

// Gemini AI Translation (when GEMINI_API_KEY is configured)
async function translateWithGemini(text: string, apiKey: string): Promise<string> {
  const prompt = `You are a professional translator specializing in Vedic rituals, Hindu pujas, and Marathi cultural texts.
Translate the following Marathi text accurately into natural, elegant English.
Preserve sacred terms authentically (e.g. "वे.मु." -> "Ve.Mu.", "वास्तुशांती" -> "Vastu Shanti", "हवन" -> "Havan", "मुहूर्त" -> "Muhurat", "दक्षणा" -> "Dakshina").
Preserve all paragraph breaks, lists, and numbering format exactly.
Return ONLY the direct English translation without any surrounding quotes, notes, or explanations.

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

    let translated = '';
    let provider = 'MyMemory';

    // Tier 1: Gemini AI if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        translated = await translateWithGemini(text, process.env.GEMINI_API_KEY);
        provider = 'Gemini';
      } catch (geminiErr) {
        console.warn('[TRANSLATE] Gemini failed, falling back to MyMemory:', geminiErr);
      }
    }

    // Tier 2: Google Cloud Translate if configured and Gemini not used/failed
    if (!translated && process.env.GOOGLE_TRANSLATE_API_KEY) {
      try {
        translated = await translateWithGoogleCloud(text, process.env.GOOGLE_TRANSLATE_API_KEY);
        provider = 'Google Cloud';
      } catch (gcloudErr) {
        console.warn('[TRANSLATE] Google Cloud failed, falling back to MyMemory:', gcloudErr);
      }
    }

    // Tier 3: MyMemory (Free public API, always available fallback)
    if (!translated) {
      translated = await translateWithMyMemory(text);
      provider = 'MyMemory';
    }

    // Apply Vedic term refinement
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
