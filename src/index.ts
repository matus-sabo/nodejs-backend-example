import { services } from "#app";

try {
  await services.manager.start();
} catch (err) {
  await services.manager.stop().catch(() => {});
  console.error(err);
  process.exit(1);
}
