/**
 * Find the Cloud Resource Kind for a Google Cloud Resource Identifier
 * reference: https://cloud.google.com/asset-inventory/docs/resource-name-format
 *
 * ex:
 *   input - googleResourceIdentifier = //bigquery.googleapis.com/projects/j1-gc-integration-dev-v3/datasets/natality
 *   returns - bigquery.googleapis.com/Dataset
 */
export function findResourceKindFromCloudResourceIdentifier(
  googleResourceIdentifier: string,
): string | undefined {
  const match = Object.keys(CLOUD_RESOURCE_IDENTIFIER_TO_KIND_MAP).find(
    (resourceFormat) =>
      checkResourceFormatMatch(googleResourceIdentifier, resourceFormat),
  );
  return match ? CLOUD_RESOURCE_IDENTIFIER_TO_KIND_MAP[match] : undefined;
}

function checkResourceFormatMatch(
  googleResourceIdentifier: string,
  resourceFormat: string,
): boolean {
  const splitIdentifier = googleResourceIdentifier.split('/');
  const newFormat = resourceFormat
    .split('/')
    .map((f, i) => (f === f.toUpperCase() ? splitIdentifier[i] : f))
    .join('/');
  return newFormat === googleResourceIdentifier;
}

/**
 * A map that goes from Google Cloud Resource Identifier structure to the Cloud Resource Kind.
 * Taken directly from https://cloud.google.com/asset-inventory/docs/resource-name-format
 */
// This map is much more easier to read when all the values are on a single line, disabling prettier to prevent reformatting to two lines.
// prettier-ignore
const CLOUD_RESOURCE_IDENTIFIER_TO_KIND_MAP: {
  [key: string]: string;
} = {
  '//cloudfunctions.googleapis.com/projects/PROJECT_ID/locations/LOCATION/functions/CLOUD_FUNCTION': 'cloudfunctions.googleapis.com/CloudFunction',
  '//cloudresourcemanager.googleapis.com/organizations/ORGANIZATION_NUMBER': 'cloudresourcemanager.googleapis.com/Organization',
  '//cloudresourcemanager.googleapis.com/folders/FOLDER_NUMBER': 'cloudresourcemanager.googleapis.com/Folder',
  '//cloudresourcemanager.googleapis.com/projects/PROJECT_NUMBER': 'cloudresourcemanager.googleapis.com/Project',
  '//cloudresourcemanager.googleapis.com/projects/PROJECT_ID': 'cloudresourcemanager.googleapis.com/Project',
  '//run.googleapis.com/projects/PROJECT_ID/locations/LOCATION/domainmappings/DOMAIN_MAPPING': 'run.googleapis.com/DomainMapping',
  '//run.googleapis.com/projects/PROJECT_ID/locations/LOCATION/revisions/REVISION': 'run.googleapis.com/Revision',
  '//run.googleapis.com/projects/PROJECT_ID/locations/LOCATION/services/SERVICE': 'run.googleapis.com/Service',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/addresses/ADDRESS': 'compute.googleapis.com/Address',
  '//compute.googleapis.com/projects/PROJECT_ID/global/addresses/ADDRESS': 'compute.googleapis.com/GlobalAddress',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/autoscalers/AUTOSCALER': 'compute.googleapis.com/Autoscaler',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/autoscalers/AUTOSCALER': 'compute.googleapis.com/Autoscaler',
  '//compute.googleapis.com/projects/PROJECT_ID/global/backendBuckets/BACKEND_BUCKET': 'compute.googleapis.com/BackendBucket',
  '//compute.googleapis.com/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE': 'compute.googleapis.com/BackendService',
  '//compute.googleapis.com/projects/PROJECT_ID/region/REGION/commitments/COMMITMENT': 'compute.googleapis.com/Commitment',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/disks/DISKS': 'compute.googleapis.com/Disk',
  '//compute.googleapis.com/projects/PROJECT_ID/global/externalVpnGateways/EXTERNAL_VPN_GATEWAY': 'compute.googleapis.com/ExternalVpnGateway',
  '//compute.googleapis.com/projects/PROJECT_ID/global/firewalls/FIREWALL': 'compute.googleapis.com/Firewall',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/forwardingRules/FORWARDING_RULE': 'compute.googleapis.com/ForwardingRule',
  '//compute.googleapis.com/projects/PROJECT_ID/global/healthChecks/HEALTH_CHECK': 'compute.googleapis.com/HealthCheck',
  '//compute.googleapis.com/projects/PROJECT_ID/global/httpHealthChecks/HTTP_HEALTH_CHECK': 'compute.googleapis.com/HttpHealthCheck',
  '//compute.googleapis.com/projects/PROJECT_ID/global/httpsHealthChecks/HTTPS_HEALTH_CHECK': 'compute.googleapis.com/HttpsHealthCheck',
  '//compute.googleapis.com/projects/PROJECT_ID/global/images/IMAGE': 'compute.googleapis.com/Image',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/instances/INSTANCE': 'compute.googleapis.com/Instance',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/instanceGroups/INSTANCE_GROUP': 'compute.googleapis.com/InstanceGroup',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/instanceGroups/INSTANCE_GROUP': 'compute.googleapis.com/InstanceGroup',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/instanceGroupManager/INSTANCE_GROUP_MANAGER': 'compute.googleapis.com/InstanceGroupManager',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/instanceGroupManager/INSTANCE_GROUP_MANAGER': 'compute.googleapis.com/InstanceGroupManager',
  '//compute.googleapis.com/projects/PROJECT_ID/global/instanceTemplates/INSTANCE_TEMPLATE': 'compute.googleapis.com/InstanceTemplate',
  '//compute.googleapis.com/projects/PROJECT_ID/global/interconnects/INTERCONNECT': 'compute.googleapis.com/Interconnect',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/interconnectAttachments/INTERCONNECT_ATTACHMENT': 'compute.googleapis.com/InterconnectAttachment',
  '//compute.googleapis.com/projects/PROJECT_ID/global/licenses/LICENSE': 'compute.googleapis.com/License',
  '//compute.googleapis.com/projects/PROJECT_ID/global/networks/NETWORK': 'compute.googleapis.com/Network',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/networkEndpointGroups/NETWORK_ENDPOINT_GROUP': 'compute.googleapis.com/NetworkEndpointGroup',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/nodeGroups/NODE_GROUP': 'compute.googleapis.com/NodeGroup',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/nodeTemplates/NODE_TEMPLATE': 'compute.googleapis.com/NodeTemplate',
  '//compute.googleapis.com/projects/PROJECT_ID': 'compute.googleapis.com/Project',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/packetMirrorings/PACKET_MIRRORING': 'compute.googleapis.com/PacketMirroring',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/disks/DISKS': 'compute.googleapis.com/RegionDisk',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/reservations/RESERVATION': 'compute.googleapis.com/Reservation',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/resourcePolicies/RESOURCE_POLICY': 'compute.googleapis.com/ResourcePolicy',
  '//compute.googleapis.com/projects/PROJECT_ID/global/routes/ROUTE': 'compute.googleapis.com/Route',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/routers/ROUTER': 'compute.googleapis.com/Router',
  '//compute.googleapis.com/projects/PROJECT_ID/global/securityPolicies/SECURITY_POLICY': 'compute.googleapis.com/SecurityPolicy',
  '//compute.googleapis.com/projects/PROJECT_ID/global/snapshots/SNAPSHOT': 'compute.googleapis.com/Snapshot',
  '//compute.googleapis.com/projects/PROJECT_ID/global/sslCertificates/SSL_CERTIFICATE': 'compute.googleapis.com/SslCertificate',
  '//compute.googleapis.com/projects/PROJECT_ID/global/sslPolicies/SSL_POLICY': 'compute.googleapis.com/SslPolicy',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/subnetworks/SUBNETWORK': 'compute.googleapis.com/Subnetwork',
  '//compute.googleapis.com/projects/PROJECT_ID/global/targetHttpProxies/TARGET_HTTP_PROXY': 'compute.googleapis.com/TargetHttpProxy',
  '//compute.googleapis.com/projects/PROJECT_ID/global/targetHttpsProxies/TARGET_HTTPS_PROXY': 'compute.googleapis.com/TargetHttpsProxy',
  '//compute.googleapis.com/projects/PROJECT_ID/zones/ZONE/targetInstances/TARGET_INSTANCE': 'compute.googleapis.com/TargetInstance',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/targetPools/TARGET_POOL': 'compute.googleapis.com/TargetPool',
  '//compute.googleapis.com/projects/PROJECT_ID/global/targetTcpProxies/TARGET_TCP_PROXY': 'compute.googleapis.com/TargetTcpProxy',
  '//compute.googleapis.com/projects/PROJECT_ID/global/targetSslProxies/TARGET_SSL_PROXY': 'compute.googleapis.com/TargetSslProxy',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/targetVpnGateways/TARGET_VPN_GATEWAY': 'compute.googleapis.com/TargetVpnGateway',
  '//compute.googleapis.com/projects/PROJECT_ID/global/urlMaps/URL_MAP': 'compute.googleapis.com/UrlMap',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/vpnGateways/VPN_GATEWAY': 'compute.googleapis.com/VpnGateway',
  '//compute.googleapis.com/projects/PROJECT_ID/regions/REGION/vpnTunnels/VPN_TUNNEL': 'compute.googleapis.com/VpnTunnel',
  '//appengine.googleapis.com/apps/APP': 'appengine.googleapis.com/Application',
  '//appengine.googleapis.com/apps/APP/services/SERVICE': 'appengine.googleapis.com/Service',
  '//appengine.googleapis.com/apps/APP/services/SERVICE/versions/VERSION': 'appengine.googleapis.com/Version',
  '//cloudbilling.googleapis.com/billingAccounts/BILLING_ACCOUNT': 'cloudbilling.googleapis.com/BillingAccount',
  '//storage.googleapis.com/BUCKET': 'storage.googleapis.com/Bucket',
  '//osconfig.googleapis.com/PATCH_DEPLOYMENT': 'osconfig.googleapis.com/PatchDeployment',
  '//dns.googleapis.com/projects/PROJECT_ID/managedZones/ZONE_NUMBER': 'dns.googleapis.com/ManagedZone',
  '//dns.googleapis.com/projects/PROJECT_ID/policies/POLICY_NUMBER': 'dns.googleapis.com/Policy',
  '//spanner.googleapis.com/projects/PROJECT_ID/instances/INSTANCE': 'spanner.googleapis.com/Instance',
  '//spanner.googleapis.com/projects/PROJECT_ID/instances/INSTANCE/databases/DATABASE': 'spanner.googleapis.com/Database',
  '//spanner.googleapis.com/projects/PROJECT_ID/instances/INSTANCE/backups/BACKUP': 'spanner.googleapis.com/Backup',
  '//bigquery.googleapis.com/projects/PROJECT_ID/datasets/DATASET': 'bigquery.googleapis.com/Dataset',
  '//bigquery.googleapis.com/projects/PROJECT_ID/datasets/DATA_SET/tables/TABLE': 'bigquery.googleapis.com/Table',
  '//iam.googleapis.com/projects/PROJECT_ID/roles/ROLE': 'iam.googleapis.com/Role',
  '//iam.googleapis.com/projects/PROJECT_ID/serviceAccounts/SERVICE_ACCOUNT_EMAIL_OR_ID': 'iam.googleapis.com/ServiceAccount',
  '//iam.googleapis.com/projects/PROJECT_ID/serviceAccounts/SERVICE_ACCOUNT_EMAIL_OR_ID/keys/SERVICE_ACCOUNT_KEY': 'iam.googleapis.com/ServiceAccountKey',
  '//pubsub.googleapis.com/projects/PROJECT_ID/topics/TOPIC': 'pubsub.googleapis.com/Topic',
  '//pubsub.googleapis.com/projects/PROJECT_ID/subscriptions/SUBSCRIPTION': 'pubsub.googleapis.com/Subscription',
  '//pubsub.googleapis.com/projects/PROJECT_ID/snapshots/SNAPSHOT': 'pubsub.googleapis.com/Snapshot',
  '//dataproc.googleapis.com/projects/PROJECT_ID/regions/REGION/clusters/CLUSTER': 'dataproc.googleapis.com/Cluster',
  '//dataproc.googleapis.com/projects/PROJECT_ID/regions/REGION/jobs/JOB': 'dataproc.googleapis.com/Job',
  '//cloudkms.googleapis.com/projects/PROJECT_ID/locations/LOCATION/keyRings/KEY_RING': 'cloudkms.googleapis.com/KeyRing',
  '//cloudkms.googleapis.com/projects/PROJECT_ID/locations/LOCATION/keyRings/KEY_RING/cryptoKeys/CRYPTO_KEY': 'cloudkms.googleapis.com/CryptoKey',
  '//cloudkms.googleapis.com/projects/PROJECT_ID/locations/LOCATION/keyRings/KEY_RING/cryptoKeys/CRYPTO_KEY/cryptoKeyVersions/CRYPTO_KEY_VERSION': 'cloudkms.googleapis.com/CryptoKeyVersion',
  '//cloudkms.googleapis.com/projects/PROJECT_ID/locations/LOCATION/keyRings/KEY_RING/importJobs/IMPORT_JOBS': 'cloudkms.googleapis.com/ImportJob',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER': 'container.googleapis.com/Cluster',
  '//container.googleapis.com/projects/PROJECT_ID/locations/LOCATION/clusters/CLUSTER': 'container.googleapis.com/Cluster',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/nodePools/NODE_POOL': 'container.googleapis.com/NodePool',
  '//cloudsql.googleapis.com/projects/PROJECT_ID/instances/INSTANCE': 'sqladmin.googleapis.com/Instance',
  '//bigtable.googleapis.com/projects/PROJECT_ID/instances/INSTANCE/appProfiles/APP_PROFILE': 'bigtableadmin.googleapis.com/AppProfile',
  '//bigtable.googleapis.com/projects/PROJECT_ID/instances/INSTANCE/clusters/CLUSTER/backups/BACKUP': 'bigtableadmin.googleapis.com/Backup',
  '//bigtable.googleapis.com/projects/PROJECT_ID/instances/INSTANCE/clusters/CLUSTER': 'bigtableadmin.googleapis.com/Cluster',
  '//bigtable.googleapis.com/projects/PROJECT_ID/instances/INSTANCE': 'bigtableadmin.googleapis.com/Instance',
  '//bigtable.googleapis.com/projects/PROJECT_ID/instances/INSTANCE/tables/TABLE': 'bigtableadmin.googleapis.com/Table',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/extensions/ingresses/INGRESS': 'extensions.k8s.io/Ingress',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/networking.k8s.io/ingresses/INGRESS': 'networking.k8s.io/Ingress',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/networking.k8s.io/networkpolicies/NETWORKPOLICY': 'networking.k8s.io/Networkpolicy',
  '//serviceusage.googleapis.com/projects/PROJECT_NUMBER/services/SERVICE': 'serviceusage.googleapis.com/Service',
  '//datafusion.googleapis.com/projects/PROJECT_ID/locations/LOCATION/instances/INSTANCE': 'datafusion.googleapis.com/Instance',
  '//logging.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/buckets/BUCKET': 'logging.googleapis.com/LogBucket',
  '//logging.googleapis.com/projects/PROJECT_NUMBER/sinks/SINK': 'logging.googleapis.com/LogSink',
  '//logging.googleapis.com/folders/FOLDER_NUMBER/sinks/SINK': 'logging.googleapis.com/LogSink',
  '//logging.googleapis.com/organizations/ORGANIZATION_NUMBER/sinks/SINK': 'logging.googleapis.com/LogSink',
  '//logging.googleapis.com/billingAccounts/BILLING_ACCOUNT_ID/sinks/SINK': 'logging.googleapis.com/LogSink',
  '//logging.googleapis.com/projects/PROJECT_NUMBER/metrics/METRIC': 'logging.googleapis.com/LogMetric',
  '//networkmanagement.googleapis.com/projects/PROJECT_ID/locations/global/connectivityTests/TEST': 'networkmanagement.googleapis.com/ConnectivityTest',
  '//managedidentities.googleapis.com/projects/PROJECT_ID/locations/global/domains/DOMAIN': 'managedidentities.googleapis.com/Domain',
  '//privateca.googleapis.com/projects/PROJECT_ID/locations/LOCATION/caPools/CA_POOL_ID': 'privateca.googleapis.com/CaPool',
  '//privateca.googleapis.com/projects/PROJECT_ID/locations/LOCATION/caPools/CA_POOL_ID/certificateAuthorities/CERTIFICATE_AUTHORITIES_ID': 'privateca.googleapis.com/CertificateAuthority',
  '//privateca.googleapis.com/projects/PROJECT_ID/locations/LOCATION/caPools/CA_POOL_ID/certificateAuthorities/CERTIFICATE_AUTHORITIES_ID/certificateRevocationLists/CERTIFICATE_REVOCATION_LISTS_ID': 'privateca.googleapis.com/CertificateRevocationList',
  '//privateca.googleapis.com/projects/PROJECT_ID/locations/LOCATION/certificateTemplates/CERTIFICATE_TEMPLATES_ID': 'privateca.googleapis.com/CertificateTemplate',
  '//dataflow.googleapis.com/projects/PROJECT_ID/locations/LOCATION/jobs/JOB': 'dataflow.googleapis.com/Job',
  '//gameservices.googleapis.com/projects/PROJECT_ID/locations/global/realms/REALM_ID/gameServerClusters/GAME_SERVER_CLUSTER_ID': 'gameservices.googleapis.com/GameServerCluster',
  '//gameservices.googleapis.com/projects/PROJECT_ID/locations/global/realms/REALM_ID': 'gameservices.googleapis.com/Realm',
  '//gameservices.googleapis.com/projects/PROJECT_ID/locations/global/gameServerDeployments/GAME_SERVER_DEPLOYMENTS_ID/configs/CONFIG_ID': 'gameservices.googleapis.com/GameServerConfig',
  '//gameservices.googleapis.com/projects/PROJECT_ID/locations/global/gameServerDeployments/GAME_SERVER_DEPLOYMENTS_ID': 'gameservices.googleapis.com/GameServerDeployment',
  '//gkehub.googleapis.com/projects/PROJECT_ID/locations/global/memberships/MEMBERSHIP': 'gkehub.googleapis.com/Membership',
  '//secretmanager.googleapis.com/projects/PROJECT_NUMBER/secrets/SECRET': 'secretmanager.googleapis.com/Secret',
  '//secretmanager.googleapis.com/projects/PROJECT_NUMBER/secrets/SECRET/versions/VERSION': 'secretmanager.googleapis.com/SecretVersion',
  '//tpu.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/nodes/NODE_ID': 'tpu.googleapis.com/Node',
  '//composer.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/environments/ENVIRONMENT': 'composer.googleapis.com/Environment',
  '//file.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/instances/INSTANCE': 'file.googleapis.com/Instance',
  '//file.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/backups/BACKUP': 'file.googleapis.com/Backup',
  '//servicedirectory.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/namespaces/NAMESPACE': 'servicedirectory.googleapis.com/Namespace',
  '//assuredworkloads.googleapis.com/organizations/ORGANIZATION_NUMBER/locations/LOCATION/workloads/WORKLOAD': 'assuredworkloads.googleapis.com/Workload',
  '//artifactregistry.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/repositories/REPOSITORY/dockerimages/DOCKER_IMAGE': 'artifactregistry.googleapis.com/DockerImage',
  '//artifactregistry.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/repositories/REPOSITORY': 'artifactregistry.googleapis.com/Repository',
  '//apigateway.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/apis/API': 'apigateway.googleapis.com/Api',
  '//apigateway.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/apis/API/configs/CONFIG': 'apigateway.googleapis.com/ApiConfig',
  '//apigateway.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/gateways/GATEWAY': 'apigateway.googleapis.com/Gateway',
  '//redis.googleapis.com/projects/PROJECT_ID/locations/LOCATION/instances/INSTANCE': 'redis.googleapis.com/Instance',
  '//memcache.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/instances/INSTANCE': 'memcache.googleapis.com/Instance',
  '//documentai.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/processors/PROCESSOR/humanReviewConfig': 'documentai.googleapis.com/HumanReviewConfig',
  '//documentai.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/labelerPools/LABELERPOOL': 'documentai.googleapis.com/LabelerPool',
  '//documentai.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/processors/PROCESSOR': 'documentai.googleapis.com/Processor',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/batchPredictionJobs/BATCH_PREDICTION_JOB': 'aiplatform.googleapis.com/BatchPredictionJob',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/customJobs/CUSTOM_JOB': 'aiplatform.googleapis.com/CustomJob',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/dataLabelingJobs/DATA_LABELING_JOB': 'aiplatform.googleapis.com/DataLabelingJob',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/datasets/DATASET': 'aiplatform.googleapis.com/Dataset',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/endpoints/ENDPOINT': 'aiplatform.googleapis.com/Endpoint',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/hyperparameterTuningJobs/HYPERPARAMETER_TUNING_JOB': 'aiplatform.googleapis.com/HyperparameterTuningJob',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/models/MODEL': 'aiplatform.googleapis.com/Model',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/specialistPools/SPECIALIST_POOL': 'aiplatform.googleapis.com/SpecialistPool',
  '//aiplatform.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/trainingPipelines/TRAINING_PIPELINE': 'aiplatform.googleapis.com/TrainingPipeline',
  '//monitoring.googleapis.com/projects/PROJECT_NUMBER/policies/POLICY_NUMBER': 'monitoring.googleapis.com/AlertPolicy',
  '//vpcaccess.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/connectors/CONNECTOR': 'vpcaccess.googleapis.com/Connector',
  '//servicemanagement.googleapis.com/services/SERVICE_ID': 'servicemanagement.googleapis.com/ManagedService',
  '//eventarc.googleapis.com/projects/PROJECT_NUMBER/locations/LOCATION/triggers/TRIGGER': 'eventarc.googleapis.com/Trigger',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/nodes/NODE': 'k8s.io/Node',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/pods/POD': 'k8s.io/Pod',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE': 'k8s.io/Namespace',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/services/SERVICE': 'k8s.io/Service',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/rbac.authorization.k8s.io/roles/ROLE': 'rbac.authorization.k8s.io/Role',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/namespaces/NAMESPACE/rbac.authorization.k8s.io/rolebindings/ROLEBINDING': 'rbac.authorization.k8s.io/RoleBinding',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/rbac.authorization.k8s.io/clusterroles/CLUSTER_ROLE': 'rbac.authorization.k8s.io/ClusterRole',
  '//container.googleapis.com/projects/PROJECT_ID/zones/ZONE/clusters/CLUSTER/k8s/rbac.authorization.k8s.io/clusterrolebindings/CLUSTER_ROLE_BINDING': 'rbac.authorization.k8s.io/ClusterRoleBinding',
}
