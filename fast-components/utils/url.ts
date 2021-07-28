// Used to url encode string substitution fragments. e.g.
//     url`https://api.fast.co/organization/${"https://google.com"}`
// becomes
//     "https://api.fast.co/organization/https%3A%2F%2Fwww.google.com"
// which prevents data from injecting URL syntax into URLs. This should
// ALWAYS be used when building URLs with data substitutions for security
// reasons.
export default (
  literalFragments: TemplateStringsArray,
  ...substitutions: string[]
) => {
  let i: number;
  const result: string[] = [];
  for (i = 0; i < substitutions.length; ++i) {
    result.push(literalFragments[i]);
    result.push(encodeURIComponent(substitutions[i]));
  }
  result.push(literalFragments[i]); // will be empty string if substitution is last element
  return result.join("");
};
