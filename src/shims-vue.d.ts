import { IMetaMaskApi } from "./types/metaMask"

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
    interface Window {
        ethereum: IMetaMaskApi;
    }
}

export {}
