<template>
  <a-button class="pull-right" type="primary" @click="handleAddTest">Add a test work</a-button>
  <a-table #bodyCell="{row, column, record}" :columns="columns"
           :dataSource="dataSource">
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
      <a @click="startWorkflow(record.id)">Start</a>
      <a-divider type="vertical"></a-divider>
      <a @click="viewDetail(record)">Detail</a>
      <a-divider type="vertical"></a-divider>
      <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="handleDel(record.id)"
      >
        <a>Delete</a>
      </a-popconfirm>
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

      <a-form-item label="Template" name="WorkTemplate">
        <a-select
            v-model:value="formState.WorkTemplateId"
            :options="workTemplateOptions"
        ></a-select>
      </a-form-item>

      <a-form-item label="Order file" name="OrderFile">
        <a-upload v-model:file-list="fileList"
                  :max-count="1"
                  accept=".xml"
                  action="#"
                  name="formState.OrderFile"
                  @change="handleChange"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Click to select order XML file
          </a-button>
        </a-upload>
        <div v-if="!formState.OrderFile" :class="{'shake-it' : shakeIt }">Please select an order
          file
        </div>
      </a-form-item>

      <a-form-item label="Parameter" name="StartParam">
        <a-input v-model:value="formState.StartParam"/>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- order view modal -->
  <a-modal v-model:open="openXmlView" footer="" title="Order XML" width="80%">
    <pre class="xml-view" v-text="xmlDisplay"></pre>
  </a-modal>

</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, type UnwrapRef} from "vue";
import axios from "axios";
import moment from "moment";
import type {Rule} from "ant-design-vue/es/form";
import {DownloadOutlined, MonitorOutlined, UploadOutlined} from '@ant-design/icons-vue';
import type {SelectProps, UploadChangeParam} from "ant-design-vue";
import router from "@/router";
import type {FileType} from "ant-design-vue/es/upload/interface";

interface FormState {
  Id: string;
  Name: string;
  StartParam: string;
  WorkTemplateId: string;
  OrderFile: FileType, // hold order file
}

const dataSource = ref([]);
const openSubmit = ref<boolean>(false);
const openXmlView = ref<boolean>(false);

const detailId = ref('');
const workTemplateOptions = ref<SelectProps['options']>([]);
let xmlDisplay = ref('');
let shakeIt = ref(false);

const formRef = ref();
let formState: UnwrapRef<FormState> = reactive({
  Id: '',
  Name: '',
  StartParam: '',
  WorkTemplateId: '',
  OrderFile: null,
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
        if (response.data.data) {
          dataSource.value = response.data.data.map(item => {
            return {...item, key: item.id};
          });
        } else {
          dataSource.value = [];
        }
      }
  ).catch(error => console.log(error))

  // load work flow template
  axios.get('http://localhost:8080/api/v1/workTemplate/all').then(
      response => {
        workTemplateOptions.value = response.data.data.map(data => ({
          label: data.Name,
          value: data.id,
        }));
      }
  ).catch(error => console.log(error))
};
const handleOrderView = (record) => {
  axios.get(record.OrderFilePath)
      .then(response => {
        xmlDisplay.value = response.data;
        openXmlView.value = true;
      })
      .catch(error => {
        console.log('Error fetching XML file:', error);
      });
}
const handleDownload = (record) => {
  axios.get(record.OrderFilePath, {responseType: 'blob'})
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', record.OrderFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.log('Error downloading XML file:', error);
      });
}

const viewDetail = (record) => {
  console.log('record', record);
  detailId.value = record.id;
  router.push({
    name: 'WorkflowDetail',
    query: {id: record.id}
  });
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
    title: 'Order',
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
  formState.OrderFile = null;
  formState.StartParam = '';
  fileList.value = [];

  openSubmit.value = true;

}

function startWorkflow(id) {
  axios.post('http://localhost:8080/api/v1/workflow/start/' + id)
      .then(response => {
        console.log('response', response);
      });
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

  if (info.fileList.length > 0) {
    const file = info.fileList[0];
    if (file.type === 'text/xml') {
      console.log(file)
      formState.OrderFile = file.originFileObj!;
    } else {
      console.log('The selected file is not an XML file.');
      window.alert('The selected file is not an XML file.');
    }
  }
}
const handleSubmit = async (e: MouseEvent) => {
  if (!formState.OrderFile) {
    shakeIt.value = true; // Start shaking
    setTimeout(() => {
      shakeIt.value = false; // Stop shaking
    }, 600);
    return;
  }
  formRef.value
      .validate()
      .then(() => {
        const formData = new FormData()
        // Append all formState properties to formData
        for (const key in formState) {
          formData.append(key, formState[key]);
        }
        for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }

        axios.post('http://localhost:8080/api/v1/workflow/create', formData)
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
  height: 80vh;
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