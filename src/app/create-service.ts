import { createLogger } from "./logger.js";

export type Service = ReturnType<typeof createService>;

export const createService = (options: {
  name: string;
  start?: () => unknown;
  stop?: () => unknown;
}) => {
  const handles = {
    startPromise: undefined as Promise<unknown> | undefined,
    stopPromise: undefined as Promise<unknown> | undefined,
  };
  const service = {
    name: options.name,
    log: createLogger(options.name),
    start: async () => {
      const { services } = await import("./services.js");
      await handles.stopPromise?.catch(() => {});
      if (handles.startPromise) {
        await handles.startPromise;
        return;
      }
      services.manager.startedServices.add(service);
      handles.startPromise = Promise.resolve(options.start?.());
      await handles.startPromise;
      service.log.info("Started");
      handles.stopPromise = undefined;
    },
    stop: async () => {
      const { services } = await import("./services.js");
      await handles.startPromise?.catch(() => {});
      if (handles.stopPromise) {
        await handles.stopPromise;
        return;
      }
      services.manager.startedServices.delete(service);
      handles.stopPromise = Promise.resolve(options.stop?.());
      await handles.stopPromise;
      service.log.info("Stopped");
      handles.startPromise = undefined;
    },
  };
  return service;
};
