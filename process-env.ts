export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MUSICBRAINZ_USER_AGENT_STRING: string;
    }
  }
}
