<script lang="ts" setup>
import useDragAndDrop from './WorkTemplateDnD'
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter();
const templName = ref('')
const shake = ref(false)
const {onDragStart, getOrderedNodes} = useDragAndDrop()
const workItems = ref([])


const props = withDefaults(defineProps<{
  templId: string,
  templName: string,
}>(), {
  templId: '',
  templName: '',
})

onMounted(() => {
  axios.get('http://localhost:8080/api/v1/workItem/all').then(
      response => {
        workItems.value = response.data.data;
      }
  ).catch(error => console.log(error))
});

watch(() => props.templName, (newVal) => {
  templName.value = newVal;
});

function saveWorkItems() {
  if (!templName.value.trim()) {
    shake.value = true;
    // Set shake.value to false after 1 second (1000 milliseconds)
    setTimeout(() => {
      shake.value = false;
    }, 500);
    return
  }

  const nodes = getOrderedNodes();
  if (nodes) {
    const workItems = nodes
        .filter(node => node.data !== undefined && Object.keys(node.data).length !== 0)
        .map(node => node.data);

    let id = props.templId.trim();
    if (id) {
      const workflow = {
        id: id,
        Name: templName.value,
        WorkItems: workItems,
        VueFlowGraph: JSON.stringify(nodes),
      };
      console.log(workflow);
      axios.put('http://localhost:8080/api/v1/workTemplate/update/' + id, workflow)
          .then(response => {
            console.log('response', response);
            router.push({name: 'WorkTemplate'});
          })
    } else {
      const workflow = {
        id: null,
        Name: templName.value,
        WorkItems: workItems,
        VueFlowGraph: JSON.stringify(nodes),
      };
      axios.post('http://localhost:8080/api/v1/workTemplate/create', workflow)
          .then(response => {
            console.log('response', response);
            router.push({name: 'WorkTemplate'});
          })
    }
  }
}

</script>

<template>
  <aside>
    <label>Template name:</label>
    <a-input v-model:value="templName" :class="{'shake': shake}"></a-input>
    <span v-if="!templName.trim()" style="color: yellow;">* Please input template name</span>
    <a-divider></a-divider>
    <a-button @click="saveWorkItems">Save</a-button>
    <div class="description">Drag these nodes to the pane and connect them using the input and output points.</div>

    <div class="nodes">
      <div v-for="(item, index) in workItems" :key="index" :draggable="true" class="vue-flow__node-default"
           @dragstart="onDragStart(item, $event, 'default')">
        {{ item.Name }}
      </div>
    </div>
  </aside>
</template>

<style scoped>
.ant-divider {
  border-top-color: lightblue;
  margin: 10px 0;
}

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
  margin: 10px 0;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, 1px) rotate(0deg);
  }
}

.shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}
</style>