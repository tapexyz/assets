const fs = require("fs");

const fileName = "3";
const maxItems = 50000
const profiles = fs
    .readFileSync(`profiles.csv`, "utf-8")
    .split("\n")
    .filter(Boolean);

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
const urlsetHeader =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
const urlsetFooter = "\n</urlset>\n";

let sitemapXml = xmlHeader + urlsetHeader;

profiles.map((handle, index) => {
    if (index < maxItems) {
        sitemapXml += `${index === 0 ? "" : "\n"}\t<url>
        <loc>https://tape.xyz/channel/${handle.replace('.lens', '')}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`;
    }
});

sitemapXml += urlsetFooter;

fs.writeFileSync(`profiles/${fileName}.xml`, sitemapXml, "utf-8");