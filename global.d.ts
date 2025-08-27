export {};

declare global {
  interface Window {
    codeBlocks?: Record<string, { code: string }>;
  }
}
