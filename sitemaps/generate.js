const fs = require('fs');
const { XMLBuilder } = require('fast-xml-parser');

const GOOGLE_API_KEY = "";
// process.env.GOOGLE_API_KEY 
const PROFILES_SHEET_IDS = [
  "1v2P34QbnCvvJpRDJMCPE358bu-SoBIHnpvxXucQIeMc",
  "1-kHsl_9SsIbzS2FE8cQ8LrkbN2b1hSRgshGeSnsmAEI",
  "1agkqmZBwy7FPyAeVWm5tx5rXis62PdDvPrd9kMwBm2k"
]

const buildSitemapXml = (url) => {
  const builder = new XMLBuilder({
    suppressEmptyNode: true,
    ignoreAttributes: false,
    processEntities: true,
    format: true
  });

  return builder.build({
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    urlset: { '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9', url }
  });
};

const buildProfileSitemap = async () => {
  for (const id of PROFILES_SHEET_IDS) {
    const range = 'A1:B50000';
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${GOOGLE_API_KEY}`
    );

    const json = await sheetsResponse.json();
    const profiles = json.values.map((row) => row[1]);
    const entries = profiles.map((handle) => ({
      loc: `https://tape.xyz/u/${handle}`,
      changefreq: 'daily',
      priority: '1.0'
    }));

    const xml = buildSitemapXml(entries);
    fs.writeFileSync(`profiles/${id}.xml`, xml);
  }
}

buildProfileSitemap();