<template>
  <div class="pull-right">
    <label style="margin: 0 5px;">Refresh interval:</label>
    <a-select v-model:value="refreshInterval" style="margin: 0 5px; width: 120px;">
      <a-select-option value="1">1s</a-select-option>
      <a-select-option value="3">3s</a-select-option>
      <a-select-option value="5">5s</a-select-option>
      <a-select-option value="10">10s</a-select-option>
      <a-select-option value="10000">Don't refresh</a-select-option>
    </a-select>
    <a-divider type="vertical"/>
    <a-button @click="handleNew">Add Test</a-button>
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
const refreshInterval = ref('1');
const openLog = ref(false);
const logContent = ref('');

let currentId = ref('');
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let logTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  updateData();

  watch(openLog, (newValue, oldValue) => {
    if (newValue) {
      // Enable logTimer
      logTimer = setInterval(() => {
        axios.get('http://localhost:8080/api/v1/nomad/logs/' + currentId.value + "/stdout")
            .then(response => {
              console.log('response', response);
              logContent.value = response.data.data;
            }).catch(error => {
          console.log(error);
          logContent.value = error.response.data.data;
        })
      }, 300);
    } else {
      // Disable logTimer
      if (logTimer) {
        clearInterval(logTimer);
        logTimer = null;
      }
    }
  });
});

const updateData = () => {
  axios.get('http://localhost:8080/api/v1/nomad/jobs').then(
      response => {
        dataSource.value = response.data.data;
        dataSource.value.sort((a, b) => a.SubmitTime - b.SubmitTime);
      }
  ).catch(error => console.log(error))
      .finally(() => {
        // Clear the previous timeout if it exists
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }
        // Schedule the next update
        refreshTimer = setTimeout(updateData, refreshInterval.value * 1000);
      });
};

onUnmounted(() => {
  // Clear the timeout when the component is unmounted
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
});

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
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/stop/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
};

const handleDel = (record: any) => {
  currentId.value = record.ID;
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/delete/' + id)
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