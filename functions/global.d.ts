declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        GITHUB_REPOSITORY: string;
        GITHUB_TOKEN: string;
        GITHUB_WORKFLOW: string;
      }
    }
  }
}
