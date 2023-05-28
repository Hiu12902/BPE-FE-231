export enum TOOLBAR_HOTKEYS {
  SAVE = 'mod+s',
  VALIDATE = 'mod+q',
  HISTORY = 'mod+w',
  SIMULATE = 'mod+f',
  EVALUATE = 'mod+e',
  COMPARE = 'mod+g',
  IMPORT = 'mod+i',
  EXPORT = 'mod+b',
  ZOOMIN = 'mod+[',
  ZOOMOUT = 'mod+]',
  RESET_ZOOM = 'mod+\\',
  HAND_TOOL = 'mod+1',
  LASSO_TOOL = 'mod+2',
  SPACE_TOOL = 'mod+3',
  GLOBAL_CONNECT = 'mod+4',
  COPY = 'mod+c',
  CUT = 'mod+x',
  PASTE = 'mod+v',
  UNDO = 'mod+z',
  REDO = 'mod+y',
  DELETE = 'delete',
}

export const HOTKEY_MAP: Record<TOOLBAR_HOTKEYS, { macOs: string; windows: string }> = {
  'mod+1': {
    macOs: '⌘ + 1',
    windows: 'Ctrl + 1',
  },
  'mod+2': {
    macOs: '⌘ + 2',
    windows: 'Ctrl + 2',
  },
  'mod+3': {
    macOs: '⌘ + 3',
    windows: 'Ctrl + 3',
  },
  'mod+4': {
    macOs: '⌘ + 4',
    windows: 'Ctrl + 4',
  },
  'mod+s': {
    macOs: '⌘ + S',
    windows: 'Ctrl + S',
  },
  'mod+q': {
    macOs: '⌘ + Q',
    windows: 'Ctrl + Q',
  },
  'mod+w': {
    macOs: '⌘ + W',
    windows: 'Ctrl + W',
  },
  'mod+f': {
    macOs: '⌘ + F',
    windows: 'Ctrl + F',
  },
  'mod+e': {
    macOs: '⌘ + E',
    windows: 'Ctrl + E',
  },
  'mod+g': {
    macOs: '⌘ + G',
    windows: 'Ctrl + G',
  },
  'mod+i': {
    macOs: '⌘ + I',
    windows: 'Ctrl + I',
  },
  'mod+b': {
    macOs: '⌘ + B',
    windows: 'Ctrl + B',
  },
  'mod+c': {
    macOs: '⌘ + C',
    windows: 'Ctrl + C',
  },
  'mod+x': {
    macOs: '⌘ + X',
    windows: 'Ctrl + X',
  },
  'mod+v': {
    macOs: '⌘ + V',
    windows: 'Ctrl + V',
  },
  'mod+z': {
    macOs: '⌘ + Z',
    windows: 'Ctrl + Z',
  },
  'mod+y': {
    macOs: '⌘ + Y',
    windows: 'Ctrl + Y',
  },
  'mod+]': {
    macOs: '⌘ + ]',
    windows: 'Ctrl + ]',
  },
  'mod+[': {
    macOs: '⌘ + [',
    windows: 'Ctrl + [',
  },
  'mod+\\': {
    macOs: '⌘ + \\',
    windows: 'Ctrl + \\',
  },
  delete: {
    macOs: 'Delete',
    windows: 'Delete',
  },
};
