import { parse as parse_input } from 'lidy-js';
let rules={"main":"root","root":{"_map":{"apiVersion":"string","kind":"string"},"_mapFacultative":{"metadata":"metadata","spec":{"_oneOf":["deploymentSpec","podSpec","serviceSpec","ingressSpec","configMapSpec","secretSpec"]}}},"uint16":"int","metadata":{"_mapFacultative":{"name":"string","namespace":"string","labels":{"_mapOf":{"string":"string"}},"annotations":{"_mapOf":{"string":"string"}}}},"selector":{"_mapFacultative":{"matchLabels":{"_mapOf":{"string":"string"}}}},"deploymentSpec":{"_mapFacultative":{"replicas":"int","selector":"selector","template":{"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}}}},"podSpec":{"_mapFacultative":{"containers":{"_listOf":{"_mapFacultative":{"name":"string","image":"string","ports":{"_listOf":{"_mapFacultative":{"containerPort":"uint16"}}}}}}}},"serviceSpec":{"_mapFacultative":{"todo":"string"}},"ingressSpec":{"_mapFacultative":{"todo":"string"}},"configMapSpec":{"_mapFacultative":{"data":{"_mapOf":{"string":"string"}},"binaryData":{"_mapOf":{"string":"string"}},"immutable":"boolean"}},"secretSpec":{"_mapFacultative":{"type":"string","stringData":{"_mapOf":{"string":"string"}},"data":{"_mapOf":{"string":"string"}},"immutable":"boolean"}}}
export function parse(input) { 
  input.rules = rules
  return parse_input(input)
}
