import { defineStore } from 'pinia'

const useNoteStore = defineStore('note', {
  state: () => ({
    count: 0,
    nodes: [],
  }),
  getters: {
    getTreeList: (state) => state.nodes,
  },
  actions: {
    setTreeList (nodes) {
      this.nodes = nodes
    },
  },
  persist: {
    storage: localStorage,
  },
})

export default useNoteStore
