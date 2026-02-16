/**
 * @file Extract Remix Icons
 * Copié et modifié depuis le projet github {@link https://github.com/pYassine/dsfr-toolkit}, projet open source sous licence respectant les standards du DSFR
 * Usage:
 *   node scripts/extract-remix.cjs
 *   node scripts/extract-remix.cjs --output ./public/data
 */

const fs = require("node:fs");
const path = require("node:path");

// Config
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : defaultValue;
};

const remixPath = "./node_modules/remixicon/fonts/remixicon.css";
const outputDir = getArg("--output", "./public/data");

const font = "remixicon"
const name = "RemixIcon";
const copyright = "(C) RemixIcon";
const prefix = "ri";

function extractRemixIcons() {
  if (!fs.existsSync(remixPath)) {
    console.error(`❌ Remix Icon non trouvé: ${remixPath}`);
    return null;
  }

  const css = fs.readFileSync(remixPath, "utf-8");

  // Extraire les classes d'icônes (format: .ri-icon-name-line:before, .ri-icon-name-fill:before)
  // const iconRegex = /\.ri-([a-z0-9-]+)-(line|fill):before/g;
  const iconRegex = /\.ri-([a-z0-9-]+).*(fill):before.*content:.?"\\([a-z0-9-]+)"/g;
  const iconsMap = {};

  let match;
  while ((match = iconRegex.exec(css)) !== null) {
    // console.log(match)
    const iconName = match[1];
    const variant = match[2];
    const code = parseInt(match[3], 16);

    // Recréé le nom
    const name = `ri-${iconName}${variant}`;

    if (!iconsMap[name]) {
      iconsMap[name] = { 'font': font, 'code': code, 'theme': '', 'name': name, 'search': '', variants: [] }
    }

    if (!iconsMap[name].variants.includes(variant)) {
      iconsMap[name].variants.push(variant);
    }
  }
  const total = Object.values(iconsMap).flat().length;
  // const categories_count = Object.keys(sorted).length;
  const categories_count = 0;

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: remixPath,
      totalIcons: total,
      totalCategories: categories_count,
      font : font,
      name : name,
      copyright : copyright,
      prefix : prefix,
    },
    icons: iconsMap,
  };
}

function main() {
  console.log("🎨 Extraction Remix Icons\n");

  if (!fs.existsSync(remixPath)) {
    console.error(`❌ Remix Icon non installé`);
    console.error('   Lance "pnpm add remixicon" d\'abord.');
    process.exit(1);
  }

  // Créer le dossier de sortie
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Remix Icons
  const icons = extractRemixIcons();
  if (icons) {
    const iconsFile = path.join(outputDir, "remix-icons-font.def.json");
    fs.writeFileSync(iconsFile, JSON.stringify(icons, null, 2));
    console.log(
      `✅ ${icons.meta.totalIcons} icônes Remix (${icons.meta.totalCategories} catégories)`,
    );
    console.log(`   → ${iconsFile}`);
  }

  console.log("\n🎉 Terminé !");
}

main();
