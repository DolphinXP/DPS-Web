<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useVueFlow, VueFlow} from '@vue-flow/core'
import DropzoneBackground from './DropzoneBackground.vue'
import Sidebar from './WorkTemplateSidebar.vue'
import useDragAndDrop from './WorkTemplateDnD'
import router from "@/router";
import axios from "axios";

const nodes = ref([])
const edges = ref([])
const {onConnect, addEdges} = useVueFlow()
const {initialize, onDragOver, onDrop, onDragLeave, isDragging, deleteNode, deleteEdge} = useDragAndDrop()

let templId = ref('')
let templName = ref('')
let actionName = ref('')

onMounted(async () => {
  const id = router.currentRoute.value.query.id;
  if (id) {
    axios.get(`http://localhost:8080/api/v1/workTemplate/${id}`)
        .then(response => {
          templId.value = id;
          templName.value = response.data.data.Name;
          actionName.value = 'Update';

          const graph = JSON.parse(response.data.data.VueFlowGraph);
          edges.value = graph.filter(item => item.source && item.target);
          nodes.value = graph.filter(item => !edges.value.includes(item));
          initialize(nodes.value);
        })
        .catch(error => {
          console.error(error);
        });
  } else {
    actionName.value = 'Create';
    initialize(null);
  }
})

onConnect(addEdges)

</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item><a href="/work-template">Workflow template</a></a-breadcrumb-item>
    <a-breadcrumb-item>{{ actionName }} workflow template</a-breadcrumb-item>
  </a-breadcrumb>
  <div class="dndflow" @drop="onDrop">
    <VueFlow :edges="edges" :nodes="nodes" @dragleave="onDragLeave" @dragover="onDragOver">
      <DropzoneBackground
          :style="{
          backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          borderColor: isDragging ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
          transition: 'background-color 0.2s, border-color 0.2s',
        }"
      >
      </DropzoneBackground>
    </VueFlow>

    <Sidebar :templId="templId" :templName="templName"/>
    <div id="nodeMenu" class="menu">
      <a-button size="small" @click="deleteNode">delete node</a-button>
    </div>
    <div id="edgeMenu" class="menu">
      <a-button size="small" @click="deleteEdge">delete edge</a-button>
    </div>
  </div>

</template>

<style scoped>
.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.menu {
  border: 1px solid #efefef;
  background: white;
  border-radius: 5px;
  padding: 10px;
  position: absolute;
  visibility: hidden;
}

.dndflow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%
}

.dndflow {
  flex-direction: column;
  display: flex;
  height: 100%
}


@media screen and (min-width: 640px) {
  .dndflow {
    flex-direction: row
  }

  .dndflow aside {
    min-width: 200px;
    max-width: 400px;
  }
}

@media screen and (max-width: 639px) {
  .dndflow aside .nodes {
    display: flex;
    flex-direction: row;
    gap: 5px
  }
}
</style>
