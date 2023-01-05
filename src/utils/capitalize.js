export function capitalize(word) {
    return(
    !word ? null : word[0].toUpperCase() + word.slice(1).toLowerCase())
}