/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.webp" {
  // eslint-disable-next-line init-declarations
  const value: string;
  export default value;
}

declare module "*.png" {
  // eslint-disable-next-line init-declarations
  const value: string;
  export default value;
}
