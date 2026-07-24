function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `[Env Validation Error]: Environment variable "${name}" is not defined. ` +
        `Please ensure it is set in your local .env file or build environment.`,
    );
  }

  return value;
}

export const ENV = {
  API_BASE_URL: requireEnv(process.env.EXPO_PUBLIC_API_BASE_URL, "EXPO_PUBLIC_API_BASE_URL"),
} as const;

export default ENV;
