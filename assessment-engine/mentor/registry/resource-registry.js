export class ResourceRegistry {
  constructor({ resources = [], repositories = [] } = {}) {
    this.resources = [...resources];
    this.repositories = [...repositories];
  }

  static async fromUrls({
    resourcesUrl = "/assessment-engine/mentor/registry/ecosystem-resources.json",
    repositoriesUrl = "/assessment-engine/mentor/registry/ecosystem-repositories.json"
  } = {}) {
    const [resourceResponse, repoResponse] = await Promise.all([
      fetch(resourcesUrl, { cache: "no-store" }),
      fetch(repositoriesUrl, { cache: "no-store" })
    ]);

    const resourceData = resourceResponse.ok
      ? await resourceResponse.json()
      : { resources: [] };

    const repositoryData = repoResponse.ok
      ? await repoResponse.json()
      : { repositories: [] };

    return new ResourceRegistry({
      resources: resourceData.resources || [],
      repositories: repositoryData.repositories || []
    });
  }

  add(resource) {
    if (!resource?.id) return false;
    const index = this.resources.findIndex(item => item.id === resource.id);
    if (index >= 0) this.resources[index] = resource;
    else this.resources.push(resource);
    return true;
  }

  all() {
    return [...this.resources];
  }

  byId(id) {
    return this.resources.find(resource => resource.id === id) || null;
  }

  bySource(sourceId) {
    return this.resources.filter(resource => resource.sourceId === sourceId);
  }
}
