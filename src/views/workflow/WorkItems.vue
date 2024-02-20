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
      <a-form-item ref="name" label="Process path" name="ProcessPath">
        <a-input v-model:value="formState.ProcessPath"/>
      </a-form-item>
      <a-form-item ref="name" label="Description" name="Description">
        <a-input v-model:value="formState.Description"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, toRaw, type UnwrapRef} from "vue";
import axios from "axios";
import moment from "moment";
import type {Rule} from "ant-design-vue/es/form";

interface FormState {
  Id: string;
  Name: string;
  ProcessPath: string;
  Description: string;
}

let currentId: string;
const dataSource = ref([]);
const open = ref<boolean>(false);
const modalTitle = ref<string>('Add');
const formRef = ref();
let formState: UnwrapRef<FormState> = reactive({
  Id: '',
  Name: '',
  ProcessPath: '',
  Description: '',
});

const rules: Record<string, Rule[]> = {
  Name: [{required: true, message: 'Please input name', trigger: 'change'},],
  ProcessPath: [{required: true, message: 'Please input process path', trigger: 'change'}],
};

onMounted(() => {
  updateData();
});

const updateData = () => {
  axios.get('http://localhost:8080/api/v1/workItem/all').then(
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
    title: 'Process Path',
    dataIndex: 'ProcessPath',
    key: 'ProcessPath',
  },
  {
    title: 'Description',
    dataIndex: 'Description',
    key: 'Description',
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

const handleAdd = () => {
  modalTitle.value = 'Add';
  formState.Id = currentId = '';
  formState.Name = '';
  formState.ProcessPath = '';
  formState.Description = '';
  open.value = true;

}
const handleEdit = (record: any) => {
  modalTitle.value = 'Edit';
  formState.Id = currentId = record.id;
  formState.Name = record.Name;
  formState.ProcessPath = record.ProcessPath;
  formState.Description = record.Description;
  open.value = true;
};
const handleDel = (id: string) => {
  console.log('id', id);
  axios.delete('http://localhost:8080/api/v1/workItem/delete/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
}

const handleSubmit = (e: MouseEvent) => {
  formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
        if (modalTitle.value === 'Add') {
          axios.post('http://localhost:8080/api/v1/workItem/create', formState)
              .then(response => {
                console.log('response', response);
                updateData();
                open.value = false;
              })
        } else {
          axios.put('http://localhost:8080/api/v1/workItem/update/' + currentId, formState)
              .then(response => {
                console.log('response', response);
                updateData();
                open.value = false;
              })
        }
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}
</script>

<style scoped>
.pull-right {
  margin-bottom: 8px;
  float: right;
}
</style>