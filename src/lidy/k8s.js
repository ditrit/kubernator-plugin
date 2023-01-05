import { parse as parse_input } from 'lidy-js';
let rules={"main":"root","root":{"_map":{"apiVersion":"string","kind":"string"},"_mapFacultative":{"metadata":"metadata","spec":"deploymentSpec"}},"uint16":"int","metadata":{"_mapFacultative":{"name":"string","namespace":"string","labels":{"_mapOf":{"string":"string"}},"annotations":{"_mapOf":{"string":"string"}}}},"selector":{"_mapFacultative":{"matchLabels":{"_mapOf":{"string":"string"}}}},"deploymentSpec":{"_mapFacultative":{"replicas":"int","selector":"selector"}},"podTemplate":{"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}},"podSpec":{"_mapFacultative":{"containers":{"_listOf":{"_mapFacultative":{"name":"string","image":"string","ports":{"_listOf":{"_mapFacultative":{"containerPort":"uint16"}}}}}}}}}
export function parse(input) {
  input.rules = rules
  return parse_input(input)
}
