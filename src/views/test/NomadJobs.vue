<template>
  <a-button class="pull-right" @click="handleNew">Add Test</a-button>
  <a-table #bodyCell="{ column, text, record }" :columns="columns" :dataSource="dataSource">
    <template v-if="column.dataIndex === 'Operation'">
      <a-button @click="handleStop(record)">Stop</a-button>
      <!--      <a-divider type="vertical"/>-->
      <!--      <a>Nothing</a>-->
    </template>
  </a-table>

  <a-modal v-model:open="open" :title="modalTitle" @ok="handleSubmit">
    <a-form
        ref="formRef"
        :label-col="{span: 6}"
        :model="formState"
        :rules="rules"
    >
      <a-form-item ref="name" label="Name" name="Name">
        <a-input v-model:value="formState.Name"/>
      </a-form-item>
      <a-form-item ref="name" label="Type" name="Type">
        <a-input v-model:value="formState.Type"/>
      </a-form-item>
      <a-form-item ref="name" label="Stop" name="Stop">
        <a-input v-model:value="formState.Stop"/>
      </a-form-item>
      <a-form-item ref="name" label="Status" name="Status">
        <a-input v-model:value="formState.Status"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";

interface FormState {
  Id: string;
  Name: string;
  Type: string;
  Stop: string;
  Status: string;
}

let currentId: string;
const dataSource = ref([]);

onMounted(() => {
  updateData();
});

const updateData = () => {
  axios.get('http://localhost:8080/api/v1/nomad/jobs').then(
      response => {
        dataSource.value = response.data.data;
        console.log(response.data.data);
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
    title: 'Type',
    dataIndex: 'Type',
    key: 'Type',
  },
  {
    title: 'Stop',
    dataIndex: 'Stop',
    key: 'Stop',
  },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'Status',

  },
  {
    title: 'Operation',
    dataIndex: 'Operation',
  }
];


const handleStop = (record: any) => {
  let id = record.id;
  console.log('id', id);
  axios.delete('http://localhost:8080/api/v1/nomad/stop/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
};
const handleNew = (id: string) => {

}

</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}
</style>