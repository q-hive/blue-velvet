// * Code retreived from https://github.com/bespoyasov/text-generator

const NEWLINE_PLACEHOLDER = "§";
const PARAGRAPH_CHARACTER = "\n\n";

const punctuation = `[](){}!?.,:;'"\/*&^%$_+-–—=<>@|~`.split("").join("\\");
const ellipsis = "\\.{3}";

const words = "[a-zA-Zа-яА-ЯёЁ]+";
const compounds = `${words}-${words}`;

const newlinesRegex = /\n\s*/g;
const tokenizeRegex = new RegExp(
  `(${ellipsis}|${compounds}|${words}|[${punctuation}])`
);

function exists(entity) {
  return !!entity;
}

export function tokenize(text) {
  return text
    .replaceAll(newlinesRegex, NEWLINE_PLACEHOLDER)
    .split(tokenizeRegex)
    .filter(exists);
}

export function textify(tokens) {
  return tokens
    .filter(exists)
    .join("")
    .replaceAll(NEWLINE_PLACEHOLDER, PARAGRAPH_CHARACTER);
}