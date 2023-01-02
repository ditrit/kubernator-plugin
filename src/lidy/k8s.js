import { parse as parse_input } from 'lidy-js'
let rules={"main":"root","root":{"_map":{"apiVersion":"apiVersion","kind":"kind"},"_mapFacultative":{"metadata":"metadata","spec":"deploymentSpec"}},"kind":"string","apiVersion":"string","name":"string","stringAttr":"string","stringAttr2":"string","intAttr":"int","metadata":{"_mapFacultative":{"name":"name","namespace":"stringAttr","labels":"labels","annotations":{"_mapOf":{"string":"stringAttr"}}}},"labels":{"_mapOf":{"string":"stringAttr"}},"selector":{"_mapFacultative":{"matchLabels":"labels"}},"deploymentSpec":{"_mapFacultative":{"replicas":"intAttr","selector":"selector","template":{"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}}}},"podSpec":{"_mapFacultative":{"containers":{"_listOf":{"_mapFacultative":{"name":"stringAttr","image":"stringAttr","ports":{"_listOf":{"_mapFacultative":{"containerPort":"intAttr"}}}}}}}}}
export function parse(input) { 
  input.rules = rules
  return parse_input(input)
}
