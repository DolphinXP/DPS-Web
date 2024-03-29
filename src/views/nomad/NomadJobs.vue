<template>
  <div class="pull-right">
    <a-button type="primary" @click="handleNew">Add Test</a-button>
    <a-divider type="vertical"></a-divider>
    <a-button @click="handleDeleteAll">Delete All</a-button>
  </div>
  <div>
    <a-table #bodyCell="{ column, text, record }" :columns="columns" :dataSource="dataSource">
      <template v-if="column.dataIndex === 'Operation'">
        <a @click="handleStop(record)">Stop</a>
        <a-divider type="vertical"/>
        <a @click="handleDel(record)">Delete</a>
        <a-divider type="vertical"/>
        <a @click="handleLog(record)">StdoutLog</a>
      </template>
    </a-table>
  </div>

  <a-modal v-model:open="openLog" footer="" title="Log view" width="80%">
    <pre class="log-view" v-text="logContent"></pre>
  </a-modal>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import axios from "axios";

const dataSource = ref([]);
const openLog = ref(false);
const logContent = ref('');

let currentId = ref('');
let logTimer: ReturnType<typeof setInterval> | null = null;
let eventSource: EventSource | null = null;

onMounted(() => {
  updateData();
  startEventStream();

  watch(openLog, (newValue, oldValue) => {
    if (newValue) {
      // Enable logTimer
      logTimer = setInterval(() => {
        axios.get('http://localhost:8080/api/v1/nomad/logs/' + currentId.value + "/stdout")
            .then(response => {
              logContent.value = response.data.data;
            }).catch(error => {
          console.log(error);
          logContent.value = error.response.data.data;
        })
      }, 1000);
    } else {
      // Disable logTimer
      if (logTimer) {
        clearInterval(logTimer);
        logTimer = null;
      }
    }
  });
});

onUnmounted(() => {
  if (logTimer) {
    clearInterval(logTimer);
  }
  if (eventSource) {
    eventSource.close();
  }
});

const startEventStream = () => {
  eventSource = new EventSource('http://localhost:8080/api/v1/nomad/jobs/stream');

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    dataSource.value = data.data;
    dataSource.value.sort((a, b) => -a.SubmitTime + b.SubmitTime);
  };

  eventSource.onerror = (error) => {
    console.error("EventSource failed:", error);
  };
};


const updateData = () => {
  axios.get('http://localhost:8080/api/v1/nomad/jobs').then(
      response => {
        dataSource.value = response.data.data;
        dataSource.value.sort((a, b) => -a.SubmitTime + b.SubmitTime);
      }
  ).catch(error => console.log(error));

};


const columns = [
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
    title: 'Type',
    dataIndex: 'Type',
    key: 'Type',
  },
  {
    title: 'TaskStatus',
    dataIndex: ["Allocation", "ClientStatus"],
    key: 'TaskStatus',
  },
  {
    title: 'JobStatus',
    dataIndex: 'Status',
    key: 'JobStatus',

  },
  {
    title: 'Operation',
    dataIndex: 'Operation',
  }
];


const handleNew = (id: string) => {
  axios.post('http://localhost:8080/api/v1/nomad/jobs/start')
      .then(response => {
        console.log('response', response);
        updateData();
      })
}

const handleStop = (record: any) => {
  currentId.value = record.ID;
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/stop/' + currentId.value)
      .then(response => {
        console.log('response', response);
        updateData();
      })
};

const handleDel = (record: any) => {
  currentId.value = record.ID;
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/delete/' + currentId.value)
      .then(response => {
        console.log('response', response);
        updateData();
      })
};

const handleDeleteAll = () => {
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/deleteAll')
      .then(response => {
        console.log('response', response);
        updateData();
      })
};

const handleLog = (record: any) => {
  currentId.value = record.ID;
  logContent.value = '';
  openLog.value = true;
};


</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}

.log-view {
  height: 80vh;
  overflow: auto;
  background-color: #2c3e50;
  color: #ecf0f1;
}
</style>