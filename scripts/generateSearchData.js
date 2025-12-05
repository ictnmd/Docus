const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const docsDir = path.join(__dirname, "..", "docs");
const outFile = path.join(__dirname, "..", "src", "data", "searchData.js");
const equipmentDataFile = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "EquipmentData.js"
);

// Lấy toàn bộ file .md / .mdx
function getAllDocs(dir) {
  let files = fs.readdirSync(dir);
  let mdFiles = [];

  for (let file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      mdFiles = mdFiles.concat(getAllDocs(fullPath));
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      mdFiles.push(fullPath);
    }
  }
  return mdFiles;
}

// Extract equipment data from EquipmentData.js
function extractEquipmentData() {
  try {
    const content = fs.readFileSync(equipmentDataFile, "utf8");
    const equipmentItems = [];

    // Extract glass equipment - match all title fields
    const glassTitles = [];
    const glassRegex = /export const glassEquipment = \[([\s\S]*?)\];/;
    const glassMatch = content.match(glassRegex);
    if (glassMatch) {
      // Find all title: "..." patterns in the glass equipment array
      const titleRegex = /title:\s*"([^"]+)"/g;
      let match;
      while ((match = titleRegex.exec(glassMatch[1])) !== null) {
        glassTitles.push(match[1]);
      }
    }

    // Extract metal equipment - match all title fields
    const metalTitles = [];
    const metalRegex = /export const metalEquipment = \[([\s\S]*?)\];/;
    const metalMatch = content.match(metalRegex);
    if (metalMatch) {
      // Find all title: "..." patterns in the metal equipment array
      const titleRegex = /title:\s*"([^"]+)"/g;
      let match;
      while ((match = titleRegex.exec(metalMatch[1])) !== null) {
        metalTitles.push(match[1]);
      }
    }

    // Create search items for glass equipment
    glassTitles.forEach((title) => {
      equipmentItems.push({
        title: title,
        description: `Dụng cụ thí nghiệm thuỷ tinh: ${title}. Xem chi tiết trong phần Các dụng cụ thuỷ tinh.`,
        keywords: [
          title,
          "thuỷ tinh",
          "dụng cụ",
          "thiết bị",
          "phòng thí nghiệm",
          "glass",
        ],
        content: title,
        url: "/docs/kien-thuc-chung/dung-cu",
        type: "equipment",
        category: "glass",
      });
    });

    // Create search items for metal equipment
    metalTitles.forEach((title) => {
      equipmentItems.push({
        title: title,
        description: `Dụng cụ thí nghiệm kim loại: ${title}. Xem chi tiết trong phần Các dụng cụ kim loại.`,
        keywords: [
          title,
          "kim loại",
          "dụng cụ",
          "thiết bị",
          "phòng thí nghiệm",
          "metal",
        ],
        content: title,
        url: "/docs/kien-thuc-chung/dung-cu",
        type: "equipment",
        category: "metal",
      });
    });

    return equipmentItems;
  } catch (error) {
    console.warn("Warning: Could not extract equipment data:", error.message);
    return [];
  }
}

// Tạo URL dạng /docs/...
function docPathToUrl(fullPath) {
  const rel = path.relative(docsDir, fullPath);
  return "/docs/" + rel.replace(/\\/g, "/").replace(/\.mdx?$/, "");
}

// Lấy heading đầu tiên (# hoặc ##)
function extractFirstHeading(text) {
  const lines = text.split("\n");

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.*)/);
    if (h1) return h1[1].trim();

    const h2 = line.match(/^##\s+(.*)/);
    if (h2) return h2[1].trim();
  }

  return null;
}

// Loại markdown (để lấy 200 ký tự description)
function stripMarkdown(text) {
  return text
    .replace(/[#>*`_]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Tạo search data
function buildSearchData() {
  const files = getAllDocs(docsDir);
  let data = [];
  let id = 1;

  // Add all markdown files
  for (let file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);

    // Lấy title từ frontmatter -> fallback = heading đầu tiên -> fallback = tên file
    let title = parsed.data.title;
    if (!title) {
      title =
        extractFirstHeading(parsed.content) || path.basename(file, ".mdx");
    }

    // Lấy description = 200 ký tự đầu tiên
    const cleanedText = stripMarkdown(parsed.content);
    const description =
      cleanedText.length > 200
        ? cleanedText.substring(0, 200) + "..."
        : cleanedText;

    // content = heading đầu tiên
    const firstHeading = extractFirstHeading(parsed.content) || "";

    const keywords =
      parsed.data.keywords && Array.isArray(parsed.data.keywords)
        ? parsed.data.keywords
        : [];

    data.push({
      id: id++,
      title,
      description,
      keywords,
      content: firstHeading,
      url: docPathToUrl(file),
    });
  }

  // Add equipment items
  const equipmentItems = extractEquipmentData();
  for (const item of equipmentItems) {
    data.push({
      id: id++,
      title: item.title,
      description: item.description,
      keywords: item.keywords,
      content: item.content,
      url: item.url,
      type: item.type,
      category: item.category,
    });
  }

  return data;
}

const data = buildSearchData();
const output =
  "export const searchData = " + JSON.stringify(data, null, 2) + ";\n";

fs.writeFileSync(outFile, output, "utf8");

console.log("✔ searchData.js generated successfully!");
