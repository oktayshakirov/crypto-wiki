import { createContext, useContext } from "react";

// A bare <PostVideo /> inside MDX has no way to know which page it is on, and
// next-mdx-remote's `components` map is a module-level singleton shared by every
// layout. The layout resolves the video and hands it down instead.
const PageVideoContext = createContext(null);

export const PageVideoProvider = ({ video, children }) => (
  <PageVideoContext.Provider value={video || null}>
    {children}
  </PageVideoContext.Provider>
);

export const usePageVideo = () => useContext(PageVideoContext);
