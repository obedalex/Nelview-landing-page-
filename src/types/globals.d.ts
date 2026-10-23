// Globals shared between the classic scripts in src/scripts.
interface NvApp { signin: string; start: string; inst: string; expert: string; expertPortal: string; instPortal: string }
interface NvPost { s: string; c: string; a: string; d: string; m: number; cv: string; k: string; t: string; h: string; [key: string]: unknown }
interface Window {
  NV_APP: NvApp;
  NV_POSTS: NvPost[];
  nvSend: (rec: Record<string, unknown>) => Promise<{ ok?: boolean; [key: string]: unknown }>;
  nvFdata: (form: HTMLFormElement) => Record<string, string>;
  nvRevealAll?: () => void;
  Motion?: any;
  Lenis?: any;
}
