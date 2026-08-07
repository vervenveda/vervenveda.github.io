function has(query, pattern) {
  return pattern.test(String(query || "").toLowerCase());
}

export function detectQueryIntent(query = "") {
  const q = String(query || "").trim();

  const sourceHints = [];
  if (has(q, /\barcade\b|sudoku|chess|game/)) sourceHints.push("verve.arcade");
  if (has(q, /\barshif\b|archive|reading room/)) sourceHints.push("verve.arshif");
  if (has(q, /\baurora\b|breath|calm|meditat|ground/)) sourceHints.push("verve.aurora");
  if (has(q, /proresources?|prose|cad|calculator/)) sourceHints.push("verve.proresources");
  if (has(q, /one nation|voter|civic|citizen/)) sourceHints.push("verve.one-nation-for-all");
  if (has(q, /verifier|news|current events/)) sourceHints.push("verve.verifier");
  if (has(q, /plera search|search pro|research gate/)) sourceHints.push("verve.plera-search");
  if (has(q, /\b333\b|hollo|kansee|meeting|messages?/)) sourceHints.push("verve.333-network");

  const domains = [];
  if (has(q, /math|fraction|algebra|geometry|calculus|number|equation/)) domains.push("mathematics");
  if (has(q, /science|weather|moon|space|environment|biology|physics|chemistry/)) domains.push("science");
  if (has(q, /word|vocab|spelling|english|language|arabic|esl|reading|writing/)) domains.push("language-literacy");
  if (has(q, /civic|voter|vote|government|congress|citizen/)) domains.push("civics");
  if (has(q, /news|research|source|verify|current event/)) domains.push("research");
  if (has(q, /calm|breath|ground|reflect|wellness|meditat/)) domains.push("wellness");
  if (has(q, /career|professional|productivity|transcript|diploma|homeschool/)) domains.push("professional");

  const explicitPreferenceTags = [];
  if (has(q, /qur[’']?an|quranic|islamic/)) explicitPreferenceTags.push("quranic-study", "faith");
  if (has(q, /bible|biblical|christian|scripture/)) explicitPreferenceTags.push("biblical-study", "faith");
  if (has(q, /\bfaith\b|religion|religious/)) explicitPreferenceTags.push("faith");

  const currentInformation = has(
    q,
    /\btoday\b|\blatest\b|\bcurrent\b|\bnews\b|\bhappening\b|\bnow\b|\belection\b|\bvoter\b|\bcongress\b/
  );

  const accountAware = has(
    q,
    /\b333\b|\baccount\b|sign.?in|login|hollo|kansee|message|meeting|network/
  );

  let type = "general";
  if (currentInformation) type = "current-information";
  else if (domains.includes("wellness")) type = "wellness";
  else if (domains.includes("civics")) type = "civic-learning";
  else if (domains.includes("mathematics")) type = "mathematics";
  else if (domains.includes("science")) type = "science";
  else if (domains.includes("language-literacy")) type = "language";
  else if (domains.includes("research")) type = "research";

  return {
    query: q,
    type,
    domains: [...new Set(domains)],
    sourceHints: [...new Set(sourceHints)],
    explicitPreferenceTags: [...new Set(explicitPreferenceTags)],
    requiresFreshness: currentInformation,
    accountAware
  };
}
