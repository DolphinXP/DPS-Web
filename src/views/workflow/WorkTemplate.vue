<template>
  <a-button class="pull-right" @click="handleAdd">Add</a-button>
  <a-table #bodyCell="{ column, text, record }" :columns="columns" :dataSource="dataSource">
    <template v-if="column.dataIndex === 'Operation'">
      <a @click="handleEdit(record)">Edit</a>
      <a-divider type="vertical"/>
      <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="handleDel(record.id)"
      >
        <a>Delete</a>
      </a-popconfirm>
    </template>

  </a-table>


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

const handleAdd = () => {
  router.push({name: 'WorkTemplateDesign'});
}
const handleEdit = (record: any) => {
  router.push({
    name: 'WorkTemplateDesign',
    query: {id: record.id}
  });
};
const handleDel = (id: string) => {
  console.log('id', id);
  axios.delete('http://localhost:8080/api/v1/workTemplate/delete/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
}

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
    customRender: (row: any) => row.record.WorkItems?.length,
  },
  {
    title: 'Create Time',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    customRender: (row: any) => moment(row.record.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: 'Operation',
    dataIndex: 'Operation',
  }
];


</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}
</style>