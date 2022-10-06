import { parse as parse_input } from 'lidy-js';
let rules={"main":"root","root":{"_map":{"apiVersion":"apiVersion","kind":"kind"},"_mapFacultative":{"metadata":"metadata"},"_mapOf":{"string":"string"}},"kind":"string","apiVersion":"string","metadata":{"_mapOf":{"string":"string"}}}
export function parse(input) {
  input.rules = rules
  return parse_input(input)
}
