const fs = require('fs');
const { XMLBuilder } = require('fast-xml-parser');

const GOOGLE_API_KEY = "";
const PROFILES_SHEET_IDS = [
  "1v2P34QbnCvvJpRDJMCPE358bu-SoBIHnpvxXucQIeMc",
  "1-kHsl_9SsIbzS2FE8cQ8LrkbN2b1hSRgshGeSnsmAEI",
  "1agkqmZBwy7FPyAeVWm5tx5rXis62PdDvPrd9kMwBm2k"
]
const VIDEOS_SHEET_IDS = [
  "1HXyhkmD12QKaFwQ3lWydo3ixsdwHaMKqaCgV-u4qKNQ",
  "1wy43eXdbsH3-sJHg8LdQuBi3ExnUgp1l3ARIjPW1aVw"
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
    fs.writeFileSync(`profiles/${PROFILES_SHEET_IDS.indexOf(id) + 1}.xml`, xml);
  }
}


const buildVideosSitemap = async () => {
  for (const id of VIDEOS_SHEET_IDS) {
    const range = 'A1:B50000';
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${GOOGLE_API_KEY}`
    );

    const json = await sheetsResponse.json();
    const videos = json.values.map((row) => row[0]);
    const entries = videos.map((id) => ({
      loc: `https://tape.xyz/watch/${id}`,
      changefreq: 'weekly',
      priority: '1.0'
    }));

    const xml = buildSitemapXml(entries);
    fs.writeFileSync(`videos/${VIDEOS_SHEET_IDS.indexOf(id) + 1}.xml`, xml);
  }
}

buildProfileSitemap();
buildVideosSitemap();