import { config, createService } from "#app";

export const createConfigService = () => {
  const service = createService({
    name: "Config",
  });
  return {
    call: config,
    ...service,
  };
};
