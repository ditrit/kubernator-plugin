import { parse as parse_input } from 'lidy-js'
let rules={"main":"root","root":{"_oneOf":["pod","service","ingress","configMap","secret","persistentVolumeClaim","deployment","statefulSet","job","cronJob"]},"uint16":"int","metadata":{"_mapFacultative":{"name":"string","namespace":"string","labels":{"_mapOf":{"string":"string"}},"annotations":{"_mapOf":{"string":"string"}},"finalizers":{"_mapOf":{"string":"string"}},"ownerReferences":{"_listOf":{"_mapFacultative":{"apiVersion":"string","blockOwnerDeletion":"boolean","controller":"boolean","kind":"string","name":"string","uid":"string"}}},"managedFields":{"_listOf":{"_mapFacultative":{"apiVersion":"string","fieldsType":"string","fieldsV1":{"_mapOf":{"string":"string"}},"manager":"string","operation":"string","subresource":"string","time":"string"}}},"generateName":"string","uid":"string","resourceVersion":"string","generation":"int","selfLink":"string","creationTimestamp":"string","deletionGracePeriodSeconds":"int","deletionTimestamp":"string"}},"labelSelector":{"_mapFacultative":{"matchLabels":{"_mapOf":{"string":"string"}},"matchExpressions":{"_map":{"key":"string","operator":{"_in":["In","NotIn","Exists","DoesNotExist"]}},"_mapFacultative":{"values":{"_listOf":"string"}}}}},"pod":{"_map":{"apiVersion":"string","kind":{"_in":["Pod"]}},"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}},"podSpec":{"_mapFacultative":{"containers":{"_listOf":"container"},"volumes":"any"},"_mapOf":{"any":"any"}},"container":{"_mapFacultative":{"name":"string","image":"string","ports":{"_listOf":{"_mapFacultative":{"name":"string","protocol":"string","hostIP":"string","hostPort":"uint16","containerPort":"uint16"}}},"volumeMounts":"any"},"_mapOf":{"any":"any"}},"service":{"_map":{"apiVersion":"string","kind":{"_in":["Service"]}},"_mapFacultative":{"metadata":"metadata","spec":{"_mapFacultative":{"type":{"_in":["ClusterIP","NodePort","LoadBalancer","ExternalName"]},"selector":{"_mapOf":{"string":"string"}},"ports":{"_mapFacultative":{"name":"string","protocol":{"_in":["TCP","UDP","SCTP"]},"targetPort":"string"},"_map":{"port":"uint16"}},"clusterIP":"string","externalName":"string","sessionAffinity":"string","sessionAffinityConfig":{"_mapFacultative":{"clientIP":{"_mapFacultative":{"timeoutSeconds":"int"}}}},"clusterIPs":{"_listOf":"string"},"allocateLoadBalancerNodePorts":"boolean","externalIPs":{"_listOf":"string"},"externalTrafficPolicy":"string","healthCheckNodePort":"uint16","internalTrafficPolicy":"string","ipFamilies":{"_listOf":"string"},"ipFamilyPolicy":"string","loadBalancerClass":"string","loadBalancerSourceRanges":{"_listOf":"string"},"publishNotReadyAddresses":"boolean","loadBalancerIP":"string"}}}},"ingress":{"_map":{"apiVersion":"string","kind":{"_in":["Ingress"]}},"_mapFacultative":{"metadata":"metadata","spec":{"_mapFacultative":{"ingressClassName":"string","rules":{"_mapFacultative":{"host":"string","http":{"_map":{"paths":{"_listOf":{"_mapFacultative":{"path":"string"},"_map":{"pathType":{"_in":["Exact","Prefix","ImplementationSpecific"]},"backend":{"_mapFacultative":{"service":{"_map":{"name":"string"},"_mapFacultative":{"port":{"_mapFacultative":{"name":"string","number":"uint16"}}}},"resource":{"_mapFacultative":{"apiGroup":"string"},"_map":{"kind":"string","name":"string"}}}}}}}}}}},"tls":{"_listOf":{"_mapFacultative":{"hosts":{"_listOf":"string"},"secretName":"string"}}}}}}},"configMap":{"_map":{"apiVersion":"string","kind":{"_in":["ConfigMap"]}},"_mapFacultative":{"metadata":"metadata","spec":{"_mapFacultative":{"data":{"_mapOf":{"string":"string"}},"binaryData":{"_mapOf":{"string":"string"}},"immutable":"boolean"}}}},"secret":{"_map":{"apiVersion":"string","kind":{"_in":["Secret"]}},"_mapFacultative":{"metadata":"metadata","spec":{"_mapFacultative":{"type":{"_in":["Opaque","kubernetes.io/service-account-token","kubernetes.io/dockercfg","kubernetes.io/dockerconfigjson","kubernetes.io/basic-auth","kubernetes.io/ssh-auth","kubernetes.io/tls","bootstrap.kubernetes.io/token"]},"stringData":{"_mapOf":{"string":"string"}},"data":{"_mapOf":{"string":"string"}},"immutable":"boolean"}}}},"persistentVolumeClaim":{"_map":{"apiVersion":"string","kind":{"_in":["PersistentVolumeClaim"]}},"_mapFacultative":{"metadata":"metadata","spec":{"_mapFacultative":{"storageClassName":"string","accessModes":{"_listOf":{"_in":["ReadWriteOnce","ReadWriteMany","ReadWriteOncePod","ReadOnlyMany"]}},"volumeMode":{"_in":["Filesystem","Block"]},"resources":{"_mapFacultative":{"limits":{"_mapOf":{"string":"string"}},"requests":{"_mapOf":{"string":"string"}}}},"volumeName":"string","selector":"labelSelector"}}}},"deployment":{"_map":{"apiVersion":"string","kind":{"_in":["Deployment"]}},"_mapFacultative":{"metadata":"metadata","spec":"deploymentSpec"}},"deploymentSpec":{"_mapFacultative":{"replicas":"int","strategy":{"_mapFacultative":{"type":{"_in":["RollingUpdate","Recreate"]},"rollingUpdate":{"_mapFacultative":{"maxSurge":"string","maxUnavailable":"string"}}}},"revisionHistoryLimit":"int","minReadySeconds":"int","progressDeadlineSeconds":"int","paused":"boolean"},"_map":{"selector":"labelSelector","template":{"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}}}},"statefulSet":{"_map":{"apiVersion":"string","kind":{"_in":["StatefulSet"]}},"_mapFacultative":{"metadata":"metadata","spec":"statefulSetSpec"}},"statefulSetSpec":{"_map":{"selector":"labelSelector","template":{"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}}},"_mapOf":{"any":"any"}},"job":{"_map":{"apiVersion":"string","kind":{"_in":["Job"]}},"_mapFacultative":{"metadata":"metadata","spec":"jobSpec"}},"jobSpec":{"_mapFacultative":{"selector":"labelSelector"},"_map":{"template":{"_mapFacultative":{"metadata":"metadata","spec":"podSpec"}}},"_mapOf":{"any":"any"}},"cronJob":{"_map":{"apiVersion":"string","kind":{"_in":["CronJob"]}},"_mapFacultative":{"metadata":"metadata","spec":"cronJobSpec"}},"cronJobSpec":{"_map":{"jobTemplate":{"_mapFacultative":{"metadata":"metadata","spec":"jobSpec"}}},"_mapOf":{"any":"any"}}}
export function parse(input) { 
  input.rules = rules
  return parse_input(input)
}
