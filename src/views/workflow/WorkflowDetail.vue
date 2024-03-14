<script lang="ts" setup>

import {computed, onMounted, ref} from "vue";
import BpmnJS from "bpmn-js/lib/NavigatedViewer.js";
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer.js";
import axios from "axios";
import {useRoute} from "vue-router";
import moment from "moment";
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';


let bpmnViewer: NavigatedViewer | null = null;
let id = '';


let workflow = {}
const workflowDpsJobs = ref([]);
const dpsJobs = ref([]);
const currentElement = ref({type: 'bpmn:Process'});


const jobColumns = [
  {
    title: 'No',
    dataIndex: 'No',
    key: 'No',
    customRender: (row: any, index: any) => (row.index + 1),
  },
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: 'Status',
    dataIndex: 'State',
    key: 'State',
    customRender: (row: any) => row.record?.TaskState.State

  },
  {
    title: 'StartTime',
    dataIndex: 'StartTime',
    key: 'StartTime',
    customRender: (row: any) => moment(row.record?.StartTime).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: 'EndTime',
    dataIndex: 'EndTime',
    key: 'EndTime',
    customRender: (row: any) => moment(row.record?.EndTime).format('YYYY-MM-DD HH:mm:ss'),
  },
]

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

  // get workflow by id
  updateData(true);

  // for test purpose: set timer to update dpsJob list
  setInterval(() =>
          retrieveDpsJobs(),
      3000
  );

  // add event listener
  let eventBus = bpmnViewer.get('eventBus');
  eventBus!.on('element.click', function (event: any) {
    currentElement.value = event.element;
    filterDpsJobs()
  });
})

function retrieveDpsJobs() {
  axios.get('http://localhost:8080/api/v1/workflow/dpsJobs/' + id).then(
      response => {
        workflowDpsJobs.value = response.data.data;

      }
  ).then(response => {
    filterDpsJobs();
  });
}

function filterDpsJobs() {
  if (workflowDpsJobs.value) {

    dpsJobs.value = workflowDpsJobs.value.sort((a, b) => -moment(a.StartTime) + moment(b.StartTime));

    let elementId = currentElement.value.id;
    if (currentElement.value.type === 'bpmn:SubProcess') {
      dpsJobs.value = workflowDpsJobs.value.filter((job: any) => job.BpmnElementParentId === elementId);
    } else if (currentElement.value.type === 'bpmn:Task') {
      // find dpsJobs in workflow by elementId
      dpsJobs.value = workflowDpsJobs.value.filter((job: any) => job.BpmnElementId === elementId);
    } else if (currentElement.value.type === 'bpmn:Process') {
      //dpsJobs.value = workflowDpsJobs.value;
    } else {
      dpsJobs.value = [];
    }
  }
}

function updateData(createDiagram = false) {
  axios.get('http://localhost:8080/api/v1/workflow/' + id).then(
      response => {
        workflow = response.data.data;

        if (createDiagram) {
          createNewDiagram(workflow.WorkTemplate.BpmnXml);
        }
      }
  ).then(response => {
    retrieveDpsJobs();
  }).catch(error => console.log(error))
}

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
      <Splitter layout="vertical" style="height:100%">
        <SplitterPanel>
          <div id="canvas" class="canvas"></div>
        </SplitterPanel>
        <SplitterPanel style="overflow: auto;">
          <div class="job-list-title">
            <h3>Job List</h3>
            <span>Element: {{ currentElement.type.split(':')[1] }} / Count: {{ dpsJobs.length }}</span>
          </div>

          <div class="detail-content">
            <a-table :columns="jobColumns" :dataSource="dpsJobs" :pagination="{defaultPageSize: 100}"
                     style="width:100%;"
                     type="small">

            </a-table>
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

.job-list-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  position: sticky;
  top: 0;
  background-color: #f8f8f8;
  z-index: 1000;
}

.top-bar {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  border: 1px solid #eeeeee;
}

::v-deep(.ant-table-row) {
  cursor: pointer;
}
</style>