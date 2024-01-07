<template>
  <Draggable ref="treeRef" class="mtl-tree ml-2 mt-2 max-h-90vh" virtualization v-model="treeData" treeLine
    @open:node="handleClickOpen" :isDraggable="false" :defaultOpen="false">
    <template #default="{ node, stat }">
      <div @click.native="stat.open = !stat.open" class="flex items-center cursor-pointer"
        :class="activeNode == node.filename ? 'text-blue' : ''">
        <div :class="stat.open ? 'i-uil-folder-open' : 'i-uil-folder'" v-if="!('mime' in node)" />
        <div :class="getIcon(node)" v-else></div>
        <span class="mtl-ml">{{ node.basename }}</span>
      </div>
    </template>
  </Draggable>
</template>

<script setup>
import $api from '@/api'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import icons from "@/utils/fileType"
const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(["openText"]);
let treeRef = ref()
let activeNode = ref('')
let treeData = computed(() => props.nodes)
async function handleClickOpen (stat) {
  console.log("===🐛=== ~ file: FileTree.vue:36 ~ handleClickOpen ~ stat:", stat);
  activeNode.value = stat.data.filename
  if ('mime' in stat.data) {
    // 打开文件
    emit('openText', stat.data.filename)
  } else {
    // 打开目录
    treeRef.value.removeMulti([...stat.children])
    let response = await $api.get('/webdav/list', { path: stat.data.filename });
    treeRef.value.addMulti(
      response,
      stat,
      0
    )
  }
}

function getIcon (node) {
  let icon = 'i-uil-file-bookmark-alt'
  for (const key in icons) {
    if (icons[key] && node.mime.includes(icons[key])) {
      icon = key
    }
  }
  return icon
}
// defineExpose({
//   openText
// });
</script>