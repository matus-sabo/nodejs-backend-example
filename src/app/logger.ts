import { config } from "./config.js";

export type LogFunction = typeof console.log;

function loggerPrepend(name: string, level: string) {
  const date = new Date().toISOString();
  return `[${date}] ${level.toUpperCase()} ${name}`;
}

const hidden: LogFunction = () => {};

function createLevel(name: string, level: string): LogFunction {
  return config.logger.levels.includes(level)
    ? (...args) => {
        if (level === "error") {
          console.error(loggerPrepend(name, level), ...args);
        } else {
          console.log(loggerPrepend(name, level), ...args);
        }
      }
    : hidden;
}

export type Logger = ReturnType<typeof createLogger>;

export function createLogger(name: string) {
  return {
    debug: createLevel(name, "debug"),
    info: createLevel(name, "info"),
    warn: createLevel(name, "warn"),
    error: createLevel(name, "error"),
  };
}
