import { ref } from "vue";
import { createHighlighter } from "shiki";

let highlighter: any = null;
let initPromise: Promise<any> | null = null;

const isReady = ref(false);

export function useHighlighter() {
  const init = async () => {
    if (highlighter) return highlighter;
    if (initPromise) return initPromise;

    initPromise = createHighlighter({
      themes: ["dark-plus", "light-plus"],
      langs: ["typescript", "vue", "html", "css", "json", "bash"],
    })
      .then((h) => {
        highlighter = h;
        isReady.value = true;
        return h;
      })
      .catch((e) => {
        console.error("Failed to load Shiki highlighter:", e);
        initPromise = null;
        throw e;
      });

    return initPromise;
  };

  const highlight = (
    code: string,
    lang: string,
    theme: string = "dark-plus",
  ): string | null => {
    if (!highlighter) return null;
    try {
      return highlighter.codeToHtml(code, { lang, theme });
    } catch {
      return null;
    }
  };

  return { init, highlight, isReady };
}
