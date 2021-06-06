const pw_min_length = 6;
const passwordStrength = (password) => {
  const t = {
    raw: password,
    characters: password.length,
    lowercase: password.replace(/([^a-z]*)/gm, ""),
    uppercase: password.replace(/([^A-Z]*)/gm, ""),
    number: password.replace(/([^0-9]*)/gm, ""),
    special_character: password.replace(/(^[a-zA-Z0-9]*)/gm, ""),
  };
  return {
    characters: t.characters >= pw_min_length,
    lowercase: t.lowercase.length > 0,
    uppercase: t.uppercase.length > 0,
    number: t.number.length > 0,
    special_character: t.special_character.length > 0,
  };
};
export { passwordStrength, pw_min_length };
