import { Services, services } from "./services.js";

type Storage = {};

const storageRef: { storage?: Storage } = { storage: undefined };

const call = new Proxy<{ [K in string | symbol]: { call?: unknown } }>(
  services,
  {
    get(target, key) {
      return target[key]["call"];
    },
  }
) as unknown as { [K in keyof Services]: Services[K]["call"] };

const ctx = {
  call,
  services,
  storage: {} as Storage,
};

export type Context = ReturnType<typeof useContext>;

export const useContext = (options?: { storage?: Storage }) => {
  return {
    ...ctx,
    get call() {
      storageRef.storage = ctx.storage;
      process.nextTick(() => {
        storageRef.storage = undefined;
      });
      return call;
    },
    storage: options?.storage ?? storageRef.storage ?? ctx.storage,
  };
};
