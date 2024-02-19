<template>
  <a-button class="pull-right" @click="handleAdd">Add</a-button>
  <a-table :columns="columns" :dataSource="dataSource"/>


</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import moment from "moment";
import {useRouter} from "vue-router";

const dataSource = ref([]);

const router = useRouter();

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
  console.log('add');
  router.push({name: 'create-workflow-template'});
}


</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}
</style>