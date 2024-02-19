<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useVueFlow, VueFlow} from '@vue-flow/core'
import DropzoneBackground from './DropzoneBackground.vue'
import Sidebar from './Sidebar.vue'
import useDragAndDrop from './useDnD'

const {onConnect, addEdges} = useVueFlow()

const {initialize, onDragOver, onDrop, onDragLeave, isDragging, deleteNode, deleteEdge} = useDragAndDrop()

const nodes = ref([])

onMounted(() => {
  initialize()
})

onConnect(addEdges)

</script>

<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow :nodes="nodes" @dragleave="onDragLeave" @dragover="onDragOver">
      <DropzoneBackground
          :style="{
          backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          borderColor: isDragging ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
          transition: 'background-color 0.2s, border-color 0.2s',
        }"
      >
      </DropzoneBackground>
    </VueFlow>

    <Sidebar/>
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
    min-width: 25%
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
