
export interface Game {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  thumbnail?: string;
  category?: string;
  isCustom?: boolean;
  htmlCode?: string;
}

export type Page = 'home' | 'about' | 'playing';
