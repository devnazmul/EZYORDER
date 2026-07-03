
function getdEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Env Validation Error]: Environment variable "${name}" is not defined. ` +
      `Please ensure it is set in your local .env file or build environment.`
    );
  }
  return value;
}

export const ENV = {
  API_BASE_URL: getdEnv('EXPO_PUBLIC_API_BASE_URL'),
} as const;

export default ENV;
