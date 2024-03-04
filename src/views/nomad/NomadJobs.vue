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
      </template>
    </a-table>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import axios from "axios";

const dataSource = ref([]);
const refreshInterval = ref('1');
let timeoutId = null;

onMounted(() => {
  updateData();
});

const updateData = () => {
  axios.get('http://localhost:8080/api/v1/nomad/jobs').then(
      response => {
        dataSource.value = response.data.data;
        console.log(dataSource.value)
        // map task status to new field: TaskStatus
        // dataSource.value = response.data.data.map(item => {
        //   const statusKeys = ['Queued', 'Complete', 'Failed', 'Running', 'Starting', 'Lost', 'Unknown'];
        //   let taskStatus = '';
        //   for (let key of statusKeys) {
        //     if (item.JobSummary.Summary.group1[key] === 1) {
        //       taskStatus = key;
        //       break;
        //     }
        //   }
        //   return {...item, TaskStatus: taskStatus};
        // });

      }
  ).catch(error => console.log(error))
      .finally(() => {
        // Clear the previous timeout if it exists
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Schedule the next update
        timeoutId = setTimeout(updateData, refreshInterval.value * 1000);
      });
};

onUnmounted(() => {
  // Clear the timeout when the component is unmounted
  if (timeoutId) {
    clearTimeout(timeoutId);
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
  let id = record.ID;
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/stop/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
};

const handleDel = (record: any) => {
  let id = record.ID;
  axios.delete('http://localhost:8080/api/v1/nomad/jobs/delete/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
};

</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}
</style>