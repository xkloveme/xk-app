<!--
 * @Date: 2023-02-13
 * @LastEditTime: 2024-01-06 23:08:53
 * @LastEditors: xkloveme
 * @FileDesc:笔记
 * @FilePath: /xk-app/src/views/note.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="note">
    <div class="content-section implementation dock-demo">
      <Menubar :model="menubarItems">
        <template #start>
          <div class="i-uil-constructor"></div>
        </template>
        <template #end>

          <i class="pi pi-server cursor-pointer text-sm"
            v-tooltip="{ value: '显示/隐藏底部 dock', showDelay: 1000, hideDelay: 300 }" @click="dockShow = !dockShow" />
          <i class="pi pi-volume-up" />
          <span>Fri 13:07</span>
          <i class="pi pi-search" />
          <i class="pi pi-moon cursor-pointer text-sm" v-tooltip="{ value: '主题切换', showDelay: 1000, hideDelay: 300 }" />
          <i class="pi pi-bars cursor-pointer text-sm" @click="openVisibleRight"
            v-tooltip="{ value: '文章目录', showDelay: 1000, hideDelay: 300 }" />
        </template>
      </Menubar>

      <div class="dock-window dock-advanced">
        <!-- 分割线 -->
        <Splitter :style="{ height: '100%', width: '100%' }">
          <SplitterPanel :size="3" :minSize="0" v-show="showTree">
            <FileTree :nodes="nodes" @openText="getContent" />
          </SplitterPanel>
          <SplitterPanel>
            <codemirror v-model="editInput" placeholder="请输入" :style="{ height: '100%', width: '100%' }" :autofocus="true"
              :indent-with-tab="true" :tab-size="2" :extensions="extensions" />
          </SplitterPanel>
        </Splitter>


        <Dock :model="dockItems" v-show="dockShow">
          <template #item="{ item }">
            <a href="#" class="p-dock-link" v-tooltip.top="item.label" @click="onDockItemClick($event, item)">
              <img :alt="item.label" :src="item.icon" style="width: 100%" />
            </a>
          </template>
        </Dock>

        <Dialog v-model:visible="displayTerminal" header="Terminal" :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
          :style="{ width: '60vw' }" :maximizable="true">
          <!-- <Terminal welcomeMessage="Welcome to PrimeVue(cmd: 'date', 'greet {0}', 'random' and 'clear')"
              prompt="primevue $" /> -->
          <!-- <VMdPreview :text="editInput"></VMdPreview> -->
        </Dialog>

        <Dialog v-model:visible="displayFinder" header="Finder" :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
          :style="{ width: '60vw' }" :maximizable="true">
          <Tree :value="nodes" />
        </Dialog>
        <Dialog v-model:visible="displaySafari" header="文档预览" :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
          :style="{ width: '60vw' }" :maximizable="true">
          <VMdPreview ref="preview" :text="editInput"></VMdPreview>
        </Dialog>
        <!-- 右侧目录 -->
        <Sidebar v-model:visible="visibleRight" header="文章目录" position="right">
          <div v-for="anchor in titles" :style="{ padding: `10px 0 10px ${anchor.indent * 20}px` }"
            >
            <!-- @click="handleAnchorClick(anchor)" -->
            <a style="cursor: pointer">{{ anchor.title }}</a>
          </div>
        </Sidebar>

        <Galleria v-model:visible="displayPhotos" :value="images" :responsiveOptions="responsiveOptions" :numVisible="2"
          containerStyle="width: 400px" :circular="true" :fullScreen="true" :showThumbnails="false"
          :showItemNavigators="true">
          <template #item="slotProps">
            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="slotProps.item.alt"
              style="width: 100%" />
          </template>
        </Galleria>
      </div>
    </div>
  </div>
</template>

<script setup>
import $api from '@/api'
import useStore from '@/store'
import { Codemirror } from 'vue-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import PhotoService from './notes/PhotoService';
import TerminalService from "primevue/terminalservice";
import $toast from '@/toast';
import FileTree from '@/components/FileTree.vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import { debounce } from 'lodash'
import Sidebar from 'primevue/sidebar';
VMdPreview.use(githubTheme, { Hljs: hljs });

const { useNoteStore } = useStore()
let active = ref(0)
let editInput = ref('')
let extensions = [markdown()]
let showTree = ref(true)
let displayFinder = ref(false);
let displayTerminal = ref(false);
let displayPhotos = ref(false);
let displaySafari = ref(false);

let photoService = ref(new PhotoService());
let dockShow = ref(true)
let images = ref();
let nodes = ref();
let activePath = ref('');
async function saveText () {
  if (!activePath.value) return
  let response = await $api.post('/webdav/putText', { path: activePath.value, content: editInput.value });
  if (response) {
    $toast.success('保存成功');
  } else {
    $toast.error('保存失败');
  }
}
const debounceSaveText = debounce(saveText, 3000);

async function getTree () {
  let response = await $api.get('/webdav/list');
  useNoteStore.setTreeList(response)
  nodes.value = response
}
async function getContent (path) {
  activePath.value = path
  let response = await $api.get('/webdav/getText', { path });
  editInput.value = response
}
let preview = ref(null)
let visibleRight = ref(false)
let titles = ref([]);
function openVisibleRight () {
  getContentTitle()
  visibleRight.value = true
}
function getContentTitle () {
  console.log("===🐛=== ~ file: note.vue:150 ~ getContentTitle ~ preview:", preview);
  const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
  const titlesList = Array.from(anchors).filter((title) => !!title.innerText.trim());
  console.log("===🐛=== ~ file: note.vue:152 ~ getContentTitle ~ titles:", titlesList);

  if (!titlesList.length) {
    titles.value = [];
    return;
  }

  const hTags = Array.from(new Set(titlesList.map((title) => title.tagName))).sort();

  titles.value = titlesList.map((el) => ({
    title: el.innerText,
    lineIndex: el.getAttribute('data-v-md-line'),
    indent: hTags.indexOf(el.tagName),
  }));
}

let imgErrorPath = ref('https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png');
let dockItems = ref([
  {
    label: 'Finder',
    icon: "https://primefaces.org/cdn/primevue/images/dock/finder.svg",
    command: () => {
      displayFinder.value = true;
    }
  },
  {
    label: 'Terminal',
    icon: "https://primefaces.org/cdn/primevue/images/dock/terminal.svg",
    command: () => {
      displayTerminal.value = true;
    }
  },
  {
    label: 'App Store',
    icon: "https://primefaces.org/cdn/primevue/images/dock/appstore.svg",
    command: () => {
      // toast.add({ severity: 'error', summary: 'An unexpected error occurred while signing in.', detail: 'UNTRUSTED_CERT_TITLE', group: 'tc', life: 3000 });
    }
  },
  {
    label: 'Safari',
    icon: "https://primefaces.org/cdn/primevue/images/dock/safari.svg",
    command: () => {
      displaySafari.value = true;
    }
  },
  {
    label: 'Photos',
    icon: "https://primefaces.org/cdn/primevue/images/dock/photos.svg",
    command: () => {
      displayPhotos.value = true;
    }
  },
  {
    label: 'GitHub',
    icon: "https://primefaces.org/cdn/primevue/images/dock/github.svg",
  },
  {
    label: 'Trash',
    icon: "https://primefaces.org/cdn/primevue/images/dock/trash.png",
    command: () => {
      // toast.add({ severity: 'info', summary: 'Empty Trash', life: 3000 });
    }
  }
]);
let dockBasicItems = ref([
  {
    label: "Finder",
    icon: "https://primefaces.org/cdn/primevue/images/dock/finder.svg"
  },
  {
    label: "App Store",
    icon: "https://primefaces.org/cdn/primevue/images/dock/appstore.svg"
  },
  {
    label: "Photos",
    icon: "https://primefaces.org/cdn/primevue/images/dock/photos.svg"
  },
  {
    label: "Trash",
    icon: "https://primefaces.org/cdn/primevue/images/dock/trash.png"
  }
]);
let menubarItems = ref([
  {
    label: 'File',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Bookmark',
            icon: 'pi pi-fw pi-bookmark'
          },
          {
            label: 'Video',
            icon: 'pi pi-fw pi-video'
          },

        ]
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash'
      },
      {
        separator: true
      },
      {
        label: 'Export',
        icon: 'pi pi-fw pi-external-link'
      }
    ]
  },
  {
    label: 'Edit',
    items: [
      {
        label: 'Left',
        icon: 'pi pi-fw pi-align-left'
      },
      {
        label: 'Right',
        icon: 'pi pi-fw pi-align-right'
      },
      {
        label: 'Center',
        icon: 'pi pi-fw pi-align-center'
      },
      {
        label: 'Justify',
        icon: 'pi pi-fw pi-align-justify'
      },

    ]
  },
  {
    label: 'Users',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-user-plus',
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-user-minus',

      },
      {
        label: 'Search',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Filter',
            icon: 'pi pi-fw pi-filter',
            items: [
              {
                label: 'Print',
                icon: 'pi pi-fw pi-print'
              }
            ]
          },
          {
            icon: 'pi pi-fw pi-bars',
            label: 'List'
          }
        ]
      }
    ]
  },
  {
    label: 'Events',
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Save',
            icon: 'pi pi-fw pi-calendar-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-calendar-minus'
          }
        ]
      },
      {
        label: 'Archieve',
        icon: 'pi pi-fw pi-calendar-times',
        items: [
          {
            label: 'Remove',
            icon: 'pi pi-fw pi-calendar-minus'
          }
        ]
      }
    ]
  },
  {
    label: 'Quit'
  }
]);
let responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
]);
function onDockItemClick (event, item) {
  if (item.command) {
    item.command();
  }
  event.preventDefault();
}
function commandHandler (text) {
  let response;
  let argsIndex = text.indexOf(' ');
  let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

  switch (command) {
    case "date":
      response = 'Today is ' + new Date().toDateString();
      break;

    case "greet":
      response = 'Hola ' + text.substring(argsIndex + 1);
      break;

    case "random":
      response = Math.floor(Math.random() * 100);
      break;

    default:
      response = "Unknown command: " + command;
  }

  TerminalService.emit('response', response);
}


onMounted(() => {
  images.value = photoService.value.getImages();
  getTree()
  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      debounceSaveText()
    }
  })

  TerminalService.on('command', commandHandler);
})

onBeforeUnmount(() => {
  TerminalService.off('command', commandHandler);
})
</script>

<style scoped lang="scss">
::v-deep(.dock-demo) {
  .dock-window {
    width: 100%;
    height: calc(100vh - 42px);
    position: relative;
    background-color: antiquewhite;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: 1;
  }

  .p-tree {
    border: 0px solid #fff;
    padding: 0rem;
  }

  .p-dock {
    z-index: 1000;
  }

  .p-menubar {
    padding-top: 0;
    padding-bottom: 0;
    border-radius: 0;

    .menubar-root {
      font-weight: bold;
      padding: 0 1rem;
    }

    .p-menuitem-link {
      padding: 0.5rem .75rem;
    }

    .p-menubar-root-list>.p-menuitem>.p-menuitem-content>.p-menuitem-link {
      padding: 0.5rem .75rem;

      >.p-submenu-icon {
        display: none;
      }
    }

    .p-menubar-end {

      span,
      i {
        padding: 0 .75rem;
      }
    }

    .p-submenu-list {
      z-index: 2;
    }
  }
}
</style>
