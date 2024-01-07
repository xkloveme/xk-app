import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import useNoteStore from "./modules/note";


export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const useStore = () => ({
  useNoteStore: useNoteStore(),
});
export default useStore;