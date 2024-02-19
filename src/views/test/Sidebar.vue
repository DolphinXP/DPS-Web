<script setup>
import useDragAndDrop from './useDnD'

const {onDragStart, showNodeInfo} = useDragAndDrop()
</script>

<template>
  <aside>
    <a-button type="primary" @click="showNodeInfo">Add</a-button>

    <div class="description">You can drag these nodes to the pane.</div>

    <div class="nodes">
      <div :draggable="true" class="vue-flow__node-input" @dragstart="onDragStart($event, 'default')">Input Node</div>

      <div :draggable="true" class="vue-flow__node-default" @dragstart="onDragStart($event, 'default')">Default Node
      </div>

      <div :draggable="true" class="vue-flow__node-output" @dragstart="onDragStart($event, 'default')">Output Node</div>
    </div>
  </aside>
</template>

<style scoped>

aside {
  color: #fff;
  font-weight: 700;
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  background: rgba(16, 185, 129, .75);
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .3);
  box-shadow: 0 5px 10px #0000004d
}

aside .nodes > * {
  margin-bottom: 10px;
  cursor: grab;
  font-weight: 500;
  -webkit-box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, .25);
  box-shadow: 5px 5px 10px 2px #00000040
}

aside .description {
  margin-bottom: 10px;
}

</style>