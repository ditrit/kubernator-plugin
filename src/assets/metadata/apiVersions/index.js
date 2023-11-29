import appsV1 from './apps_v1.json';
import batchV1 from './batch_v1.json';
import v1 from './v1.json';
import networkingV1 from './networking_v1.json';
import autoscalingV2 from './autoscaling_v2.json';
import others from './others.json';

export default {
  'apps/v1': appsV1,
  'batch/v1': batchV1,
  v1,
  'networking.k8s.io/v1': networkingV1,
  'autoscaling/v2': autoscalingV2,
  others,
};
