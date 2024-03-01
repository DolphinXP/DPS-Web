<template>
  <a-button class="pull-right" type="primary" @click="handleAddTest">Add a test work</a-button>
  <a-table :columns="columns" :dataSource="dataSource"
           :expand-column-width="100">
    <template #expandedRowRender="{ record }">
      <div>
        <workflow-detail></workflow-detail>
      </div>
    </template>
    <template #expandColumnTitle>
      <menu-fold-outlined></menu-fold-outlined>
    </template>

    <template #bodyCell="{record, column}">
      <template v-if="column.dataIndex === 'StartOrder'">
        <a @click="handleOrderView(record)">
          <monitor-outlined></monitor-outlined>
          View
        </a>
        <a-divider type="vertical"></a-divider>
        <a @click="handleDownload(record)">
          <download-outlined></download-outlined>
          Download
        </a>
      </template>

      <template v-if="column.dataIndex === 'Operation'">

        <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="handleDel(record.id)"
        >
          <a>Delete</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>

  <!-- submit modal -->
  <a-modal v-model:open="openSubmit" title="Add a test" @ok="handleSubmit">
    <a-form
        ref="formRef"
        :label-col="{span: 6}"
        :model="formState"
        :rules="rules"
    >
      <a-form-item label="Name" name="Name">
        <a-input v-model:value="formState.Name"/>
      </a-form-item>
      <a-form-item label="Order file" name="StartOrder">
        <a-upload v-model:file-list="fileList"
                  :max-count="1"
                  accept=".xml"
                  action="#"
                  name="formState.StartOrder"
                  @change="handleChange"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Click to select order XML file
          </a-button>
        </a-upload>
        <div v-if="!formState.StartOrder" :class="{'shake-it' : shakeIt }">Please select an order
          file
        </div>
      </a-form-item>
      <a-form-item label="Parameter" name="StartParam">
        <a-input v-model:value="formState.StartParam"/>
      </a-form-item>

    </a-form>
  </a-modal>

  <!-- order view modal -->
  <a-modal v-model:open="openXmlView" footer="" height="60%" title="Order XML" width="80%">
    <pre class="xml-view" v-text="xmlDisplay"></pre>
  </a-modal>

</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, type UnwrapRef} from "vue";
import axios from "axios";
import moment from "moment";
import type {Rule} from "ant-design-vue/es/form";
import {DownloadOutlined, MenuFoldOutlined, MonitorOutlined, UploadOutlined} from '@ant-design/icons-vue';
import type {UploadChangeParam} from "ant-design-vue";
import vkbeautify from 'vkbeautify';
import WorkflowDetail from "@/views/workflow/WorkflowDetail.vue";

interface FormState {
  Id: string;
  Name: string;
  StartOrder: string;
  StartParam: string;
}

const dataSource = ref([]);
const openSubmit = ref<boolean>(false);
const openXmlView = ref<boolean>(false);
let xmlDisplay = ref('');
let shakeIt = ref(false);

const formRef = ref();
let formState: UnwrapRef<FormState> = reactive({
  Id: '',
  Name: '',
  StartOrder: '',
  StartParam: '',
});

const rules: Record<string, Rule[]> = {
  Name: [{required: true, message: 'Please input name', trigger: 'change'},],
};

const fileList = ref([]);

onMounted(() => {
  updateData();
});

const updateData = () => {
  axios.get('http://localhost:8080/api/v1/workflow/all').then(
      response => {
        dataSource.value = response.data.data;
        dataSource.value = dataSource.value.map(item => {
          return {...item, key: item.id};
        });
      }
  ).catch(error => console.log(error))
};
const handleOrderView = (record) => {
  xmlDisplay.value = vkbeautify.xml(record.StartOrder);
  openXmlView.value = true;
}
const handleDownload = (record) => {
  const blob = new Blob([record.StartOrder], {type: 'text/xml'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `order-${record.id}-download.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
    title: 'Start order',
    dataIndex: 'StartOrder',
    key: 'StartOrder',
  },
  {
    title: 'Start param',
    dataIndex: 'StartParam',
    key: 'StartParam',
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

const handleAddTest = () => {
  formState.Id = '';
  formState.Name = '';
  formState.StartOrder = '';
  formState.StartParam = '';
  fileList.value = [];
  openSubmit.value = true;

}

const handleDel = (id: string) => {
  console.log('id', id);
  axios.delete('http://localhost:8080/api/v1/workflow/delete/' + id)
      .then(response => {
        console.log('response', response);
        updateData();
      })
}

const handleChange = (info: UploadChangeParam) => {
  formState.StartOrder = '';

  if (info.fileList.length > 0) {
    const file = info.fileList[0];
    if (file.type === 'text/xml') {
      const reader = new FileReader();
      reader.readAsText(file.originFileObj!);
      reader.onload = () => {
        formState.StartOrder = reader.result as string;
      };
    } else {
      console.log('The selected file is not an XML file.');
      window.alert('The selected file is not an XML file.');
    }
  }
}
const handleSubmit = (e: MouseEvent) => {
  if (!formState.StartOrder) {
    shakeIt.value = true; // Start shaking
    setTimeout(() => {
      shakeIt.value = false; // Stop shaking
    }, 600);
    return;
  }
  formRef.value
      .validate()
      .then(() => {
        axios.post('http://localhost:8080/api/v1/workflow/create', formState)
            .then(response => {
              console.log('response', response);
              updateData();
              openSubmit.value = false;
            });
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

.xml-view {
  height: 600px;
  overflow: auto;
  background-color: #2c3e50;
  color: #ecf0f1;
}

.shake-it {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>