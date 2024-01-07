import autoImport from "unplugin-auto-import/vite";
import { PrimeVueResolver } from "unplugin-vue-components/resolvers";
export default function createAutoImport () {
  return autoImport({
    imports: [
      "vue",
      "vue-router"
    ],
    resolvers: [
      PrimeVueResolver(),
    ],
    dts: false
  });
}
