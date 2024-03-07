<script lang="ts" setup>

import {computed, onMounted, ref} from "vue";
import BpmnJS from "bpmn-js/lib/NavigatedViewer.js";
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer.js";
import axios from "axios";
import {useRoute} from "vue-router";

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';


let bpmnViewer: NavigatedViewer | null = null;
let id = '';


let workflow = {}

const jobs = [
  {
    key: '1',
    name: 'Mike',
  },
  {
    key: '2',
    name: 'John',
  },
  {
    key: '4',
    name: 'Tom',
  },
  {
    key: '5',
    name: 'Michael',
  },
  {
    key: '6',
    name: 'Alice',
  },
];


onMounted(() => {
  const route = useRoute();
  id = <string>route.query.id;

  bpmnViewer = new BpmnJS({
    container: "#canvas",
    textRenderer: {
      defaultStyle: {
        fontFamily: '"Nothing You Could Do", cursive',
        fontWeight: 'bold',
        fontSize: '20px',
      },
      externalStyle: {
        fontSize: '16px',
        lineHeight: 1.5
      }
    },
    // bpmnRenderer: {
    //   defaultFillColor: '#666',
    //   defaultStrokeColor: '#fff'
    // }
  });

  let eventBus = bpmnViewer.get('eventBus');
  eventBus.on('element.click', function (event: any) {
    console.log('element.click', event.element.id);
  });

  // get workflow by id
  axios.get('http://localhost:8080/api/v1/workflow/' + id).then(
      response => {
        workflow = response.data.data;
        console.log(workflow)
        createNewDiagram(workflow.WorkTemplate.BpmnXml);
      }
  ).catch(error => console.log(error))

})

async function createNewDiagram(data) {
  // 将字符串转换成图显示出来
  data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
    return str.replace(/</g, '&lt;')
  })
  try {
    await bpmnViewer.importXML(data)
    refresh()
  } catch (err) {
    console.error(err.message, err.warnings)
  }
}

function refresh() {
  let canvas = bpmnViewer.get('canvas');
  canvas.zoom('fit-viewport');
  handleZoomOut();
}

function handleZoomIn() {
  let zoomScroll = bpmnViewer.get('zoomScroll');
  zoomScroll.stepZoom(1);
}

function handleZoomOut() {
  let zoomScroll = bpmnViewer.get('zoomScroll');
  zoomScroll.stepZoom(-1);
}

function startWorkflow() {
  axios.post('http://localhost:8080/api/v1/workflow/start/' + id)
      .then(response => {
        console.log('response', response);
      });
}

// test
let selectedItem = ref({});
let searchTerm = ref('');

function updateSearch(event) {
  // You might not need this if Ant Design handles reactivity for you.
  searchTerm.value = event.target.value;
}

let filteredJobs = computed(() => {
  if (!searchTerm.value) {
    return jobs;
  }
  return jobs.filter(job => job.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

function itemClicked(item) {
  console.log('itemClicked', item);
  selectedItem.value = item;
}

</script>

<template>
  <div class="container">
    <div class="top-bar">
      <div>
        <a-button @click="handleZoomIn">Zoom in</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button @click="handleZoomOut">Zoom out</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button @click="refresh">Fit</a-button>
      </div>
      <div>
        <a-button type="primary" @click="startWorkflow">Start</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="primary">Stop</a-button>
      </div>
    </div>

    <div class="content">
      <Splitter gutter-size="5" layout="vertical" style="height:100%">
        <SplitterPanel>
          <div id="canvas" class="canvas"></div>
        </SplitterPanel>
        <SplitterPanel>

          <div class="detail-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate incidunt
            saepe sapiente? A
            accusantium, aliquid autem consequatur cum delectus distinctio dolor doloremque dolores eius facilis hic
            iure labore laborum laudantium magni maiores natus nesciunt nihil, non nulla odio omnis porro provident
            quasi quidem repellendus reprehenderit repudiandae sed soluta ullam ut velit voluptates? A commodi
            consectetur earum exercitationem itaque iusto neque repudiandae sit. Accusamus aut debitis dicta facilis
            nesciunt possimus quisquam! Alias fugit hic impedit iure laboriosam modi neque nihil, quam quasi quia,
            reiciendis rerum sint, sit voluptas voluptatem! Atque debitis soluta ut? Earum id laborum nostrum
            perferendis repudiandae sed voluptatibus!


          </div>

        </SplitterPanel>
      </Splitter>

    </div>
  </div>

</template>

<style scoped>

.container {
  height: calc(100vh - 200px);
}

.content {
  height: 100%;
  background: #f5f5f5;
}

.content .canvas {
  height: 100%;
  overflow: auto;
}

.content .detail-content {
  display: flex;
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
  border: 1px solid #eeeeee;
}

.top-bar {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  border: 1px solid #eeeeee;
}

</style>