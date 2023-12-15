import appsV1 from 'src/assets/metadata/apiVersions/apps_v1.json';
import batchV1 from 'src/assets/metadata/apiVersions/batch_v1.json';
import v1 from 'src/assets/metadata/apiVersions/v1.json';
import networkingV1 from 'src/assets/metadata/apiVersions/networking_v1.json';
import autoscalingV2 from 'src/assets/metadata/apiVersions/autoscaling_v2.json';
import others from 'src/assets/metadata/apiVersions/others.json';

export default {
  'apps/v1': appsV1,
  'batch/v1': batchV1,
  v1,
  'networking.k8s.io/v1': networkingV1,
  'autoscaling/v2': autoscalingV2,
  others,
};
