<script lang="ts" setup>

import {computed, onMounted, ref} from "vue";
import BpmnJS from "bpmn-js/lib/NavigatedViewer.js";
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer.js";
import axios from "axios";
import {useRoute} from "vue-router";

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
}

function handleZoomIn() {
  let zoomScroll = bpmnViewer.get('zoomScroll');
  zoomScroll.stepZoom(1);
}

function handleZoomOut() {
  let zoomScroll = bpmnViewer.get('zoomScroll');
  zoomScroll.stepZoom(-1);
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
        <a-button type="primary">Start</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="primary">Stop</a-button>
      </div>
    </div>

    <div class="content">
      <div id="canvas" class="canvas"></div>

      <div class="detail-content">
        <a-card size="small" style="width: 320px;" title="Jobs">

          <a-input v-model="searchTerm" placeholder="Search jobs" style="margin-bottom: 5px;" @input="updateSearch"/>
          <a-list :data-source="filteredJobs" pagination="" size="small">
            <template #renderItem="{ item }">
              <a-list-item :class="{'selected-item': item.key === selectedItem?.key}" style="cursor: pointer"
                           @click="itemClicked(item)">{{ item.name }}
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <a-card size="small" style="width: 320px;" title="Timeline">
          <a-timeline>
            <a-timeline-item color="green">Create a services site 2015-09-01</a-timeline-item>
            <a-timeline-item color="green">Create a services site 2015-09-01</a-timeline-item>
            <a-timeline-item color="red">
              <p>Solve initial network problems 1</p>
              <p>Solve initial network problems 2</p>
              <p>Solve initial network problems 3 2015-09-01</p>
            </a-timeline-item>
            <a-timeline-item>
              <p>Technical testing 1</p>
              <p>Technical testing 2</p>
              <p>Technical testing 3 2015-09-01</p>
            </a-timeline-item>
            <a-timeline-item color="gray">
              <p>Technical testing 1</p>
              <p>Technical testing 2</p>
              <p>Technical testing 3 2015-09-01</p>
            </a-timeline-item>
            <a-timeline-item color="gray">
              <p>Technical testing 1</p>
              <p>Technical testing 2</p>
              <p>Technical testing 3 2015-09-01</p>
            </a-timeline-item>
            <a-timeline-item color="#00CCFF">
              <template #dot>
                <SmileOutlined/>
              </template>
              <p>Custom color testing</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>

        <a-card size="small" style="flex-grow: 1" title="Info">
          <a-descriptions bordered layout="vertical" size="small">
            <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
            <a-descriptions-item label="Billing Mode">Prepaid</a-descriptions-item>
            <a-descriptions-item label="Automatic Renewal">YES</a-descriptions-item>
            <a-descriptions-item label="Order time">2018-04-24 18:00:00</a-descriptions-item>
            <a-descriptions-item :span="2" label="Usage Time">2019-04-24 18:00:00</a-descriptions-item>
            <a-descriptions-item :span="3" label="Status">
              <a-badge status="processing" text="Running"/>
            </a-descriptions-item>
            <a-descriptions-item label="Negotiated Amount">$80.00</a-descriptions-item>
            <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
            <a-descriptions-item label="Official Receipts">$60.00</a-descriptions-item>
            <a-descriptions-item label="Config Info">
              Data disk type: MongoDB
              <br/>
              Database version: 3.4
              <br/>
              Package: dds.mongo.mid
              <br/>
              Storage space: 10 GB
              <br/>
              Replication factor: 3
              <br/>
              Region: East China 1
              <br/>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>
    </div>

  </div>

</template>

<style scoped>
.selected-item {
  color: white;
  background-color: #1890ff; /* Change this to your preferred color */
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ant-card {
  margin: 0 5px;
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content .canvas {
  height: 480px;
  overflow: auto;
}

.content .detail-content {
  flex: 1;
  display: flex;
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
}

.top-bar {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  border: 1px solid #eeeeee;
}

</style>