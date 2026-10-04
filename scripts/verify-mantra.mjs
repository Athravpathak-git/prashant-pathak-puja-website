async function verifyMantra() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();

  const exactMantra = '|| श्री गणेशाय नमः ||❖|| श्री त्र्यंबकेश्वराय नमः ||';
  console.log('1. Contains exact mantra string:', html.includes(exactMantra));
  if (!html.includes(exactMantra)) {
    throw new Error('Exact mantra string not found in HTML!');
  }

  const headerIdx = html.indexOf('<header');
  const headerEndIdx = html.indexOf('</header>');
  const headerHtml = html.substring(headerIdx, headerEndIdx);

  const ganeshMatches = (headerHtml.match(/श्री गणेशाय नमः/g) || []).length;
  console.log('2. Occurrences of "श्री गणेशाय नमः" in header:', ganeshMatches);
  if (ganeshMatches !== 1) {
    throw new Error('Expected exactly 1 occurrence in header, found ' + ganeshMatches);
  }

  const hasTranslit = html.includes('Shree Ganeshay Namah') || html.includes('Shree Tryambakeshwaray Namah');
  console.log('3. Transliteration in HTML:', hasTranslit);
  if (hasTranslit) {
    throw new Error('Transliteration found in HTML!');
  }

  console.log('✓ ALL MANTRA CHECKS PASSED PERFECTLY!');
}

verifyMantra().catch(err => {
  console.error(err);
  process.exit(1);
});
