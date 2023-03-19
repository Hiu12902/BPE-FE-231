import { createContext } from 'react';

export const ToolbarModeContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>(['', () => {}]);
