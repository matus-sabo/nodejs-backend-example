import { createService } from "#app";

export const createExampleService = () => {
  const service = createService({
    name: "Example",
    start: async () => {},
    stop: async () => {},
  });
  return {
    ...service,
  };
};
