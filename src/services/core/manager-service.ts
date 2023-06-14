import { Service, createService, createServices, useContext } from "#app";

export const createManagerService = () => {
  const startedServices = new Set<Service>();
  const service = createService({
    name: "ServiceManager",
    start: async () => {
      const ctx = useContext();
      await ctx.call.manager.startServices([
        ctx.services.config,
        ctx.services.graphql,
      ]);
      service.log.info(`${startedServices.size} services started`);
    },
    stop: async () => {
      const ctx = useContext();
      for (const service of [...startedServices.values()]) {
        await service.stop();
      }
      Object.assign(ctx.services, createServices());
      service.log.info(`All services stopped`);
    },
  });
  const startServices = async (services: Service[]) => {
    await Promise.all(services.map((service) => service.start()));
  };
  return {
    startedServices,
    call: {
      startServices,
    },
    ...service,
  };
};
