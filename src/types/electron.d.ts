declare global {
  interface Window {
    electronAPI: {
      // Add your Electron IPC API methods here
      // Example:
      // send: (channel: string, data: any) => void;
      // receive: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
    };
  }
}

export {};
