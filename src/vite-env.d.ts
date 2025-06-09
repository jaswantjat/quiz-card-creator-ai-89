/// <reference types="vite/client" />

declare module "*.lottie" {
  const src: string;
  export default src;
}

declare module "*.json" {
  const value: any;
  export default value;
}
