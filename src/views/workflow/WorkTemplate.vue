<template>
  <a-button class="pull-right" @click="handleAdd">Add</a-button>
  <a-table :columns="columns" :dataSource="dataSource"/>

  <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import moment from "moment";

const dataSource = ref([]);

const open = ref<boolean>(false);

onMounted(() => {
  updateData();
});

const updateData = () => {
  axios.get('http://localhost:8080/api/v1/workTemplate/all').then(
      response => {
        dataSource.value = response.data.data;
      }
  ).catch(error => console.log(error))
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
    title: 'Steps',
    dataIndex: 'Steps',
    key: 'Steps',
    customRender: (row: any) => row.record.WorkItems.length,
  },
  {
    title: 'Create Time',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    customRender: (row: any) => moment(row.record.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
  },
];

const handleAdd = () => {
  open.value = true;
}

const handleOk = (e: MouseEvent) => {
  console.log("ok");
  open.value = false;
}
</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}
</style>