<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import myPaletteProvider from "./bpmn/palette";
import myContextMenuProvider from "./bpmn/contextMenu";
import Modeler from "bpmn-js/lib/Modeler";
import type {SelectProps} from "ant-design-vue";
import axios from "axios";

let modeler: Modeler | null = null;
let elementRegistry = null;
let modeling = null;

let elementId = ''; // bpmn element id
const workItemId = ref('');
const optionsValue = ref('');
const optionsPanel = ref(''); // task, sequenceFlow

const workItemOptions = ref<SelectProps['options']>([
  {
    value: '',
    label: '',
  },
]);

const sequenceOptions = ref<SelectProps['options']>([
  {
    value: '',
    label: '',
  },
  {
    value: 'Standard',
    label: 'Standard',
  },
  {
    value: 'Calibration',
    label: 'Calibration',
  },
]);

onMounted(() => {
  // must import bpmn-js css to display palette and context menus
  modeler = new Modeler({
    container: "#canvas",
    textRenderer: {
      defaultStyle: {
        fontFamily: '"Nothing You Could Do", cursive',
        fontWeight: 'bold',
        fontSize: '16px',
      },
      externalStyle: {
        fontSize: '16px',
        lineHeight: 1.5
      }
    },
    additionalModules: [myPaletteProvider, myContextMenuProvider]
  });
  elementRegistry = modeler.get('elementRegistry');
  modeling = modeler.get('modeling')

  createNewDiagram(getDefaultXml());

  // load work items
  axios.get('http://localhost:8080/api/v1/workItem/all').then(
      response => {
        workItemOptions.value = response.data.data.map(data => ({
          label: data.Name,
          value: data.id,
        }));
        //workItemOptions.value.unshift({label: '', value: ''});
      }
  ).catch(error => console.log(error))

  // add event listener
  let eventBus = modeler.get('eventBus');
  eventBus!.on('element.click', function (event: any) {
    elementId = event.element.id;

    if (event.element.type == 'bpmn:Task') {
      optionsPanel.value = 'task';
      optionsValue.value = event.element.businessObject.name;
    } else if (event.element.type == 'bpmn:SequenceFlow') {
      optionsPanel.value = 'sequenceFlow';

    } else {
      optionsPanel.value = '';
    }
  });

  // watch taskValue
  watch(optionsValue, (newValue) => {
    if (elementId && newValue) {
      const element = elementRegistry.get(elementId);
      if (element) {
        switch (element.type) {
          case 'bpmn:Task': {
            const option = workItemOptions.value.find(option => option.value === newValue);
            if (option) {
              workItemId.value = option.value;
              modeling.updateProperties(element, {name: option.label, workItemId: option.value});
            }
            break;
          }
          case 'bpmn:SequenceFlow': {
            modeling.updateProperties(element, {name: newValue});
            break;
          }
        }
      }
    }
  });
})


async function createNewDiagram(data) {
  // 将字符串转换成图显示出来
  data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
    return str.replace(/</g, '&lt;')
  })
  try {
    await modeler?.importXML(data)
  } catch (err) {
    console.error(err.message, err.warnings)
  }
}

const loadDiagram = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'text/xml') {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await modeler.importXML(e.target.result);
        refresh();
      } catch (err) {
        console.error('Error importing diagram', err);
      }
    };
    reader.readAsText(file);
  } else {
    let error = 'File is not a valid XML'
    window.alert(error);
    console.error(error);
  }
};

function downloadFile(filename, data, type) {
  let a = document.createElement('a')
  let url = window.URL.createObjectURL(new Blob([data], {type: type}))
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

async function saveDiagram() {
  try {
    const {xml} = await modeler!.saveXML({format: true})
    downloadFile(`workflow.bpmn20.xml`, xml, 'application/xml')
  } catch (err) {
    console.log(err)
  }
}

async function saveImage() {
  try {
    const {svg} = await modeler.saveSVG({format: true})
    downloadFile("workflow.bpmn20.svg", svg, 'image/svg+xml')
    return svg
  } catch (err) {
    console.log(err)
  }
}

function refresh() {
  let canvas = modeler.get('canvas');
  canvas.zoom('fit-viewport');
}

</script>

<template>
  <div class="container">
    <div class="top-bar">
      <h1>Work Template / Create</h1>
      <div>
        <input class="file-input" type="file" @change="loadDiagram"/>

        <a-button type="primary" @click="saveDiagram">Save XML</a-button>
        <a-divider type="vertical"/>
        <a-button type="primary" @click="saveImage">Save SVG</a-button>
      </div>
    </div>

    <div class="content">
      <div id="canvas" class="canvas"></div>
    </div>

    <div v-show="optionsPanel == 'task'" class="option-panel" style="height: 160px;">
      <label>Select work item for task:</label>
      <a-select
          ref="select"
          v-model:value="optionsValue"
          :options="workItemOptions"
      ></a-select>
      <span>id: {{ workItemId }}</span>
    </div>

    <div v-show="optionsPanel == 'sequenceFlow'" class="option-panel" style="height: 100px;">
      <label>Select sequence type</label>
      <a-select
          ref="select"
          v-model:value="optionsValue"
          :options="sequenceOptions"
      ></a-select>
    </div>
  </div>

</template>


<style scoped>

.container {
  height: 80vh; /* Full height of the viewport */
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content .canvas {
  flex-grow: 1; /* Takes up remaining space */
}

.file-input {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  margin-right: 10px;
}

.top-bar {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  border: 1px solid #eeeeee;
  border-radius: 10px;
}

.option-panel {
  background-color: #E1F0DA;
  padding: 10px;
  border-radius: 5px;
  position: fixed;
  z-index: 1000;
  right: 100px;
  top: 200px;
  width: 320px;
  display: flex;
  flex-direction: column;
}

</style>

<script lang="ts">
function getDefaultXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
  <process id="process_1" name="process_1">
    <startEvent id="startNode1" name="Start">
      <outgoing>Flow_021a60b</outgoing>
    </startEvent>
    <task id="Activity_0im6xch">
      <incoming>Flow_021a60b</incoming>
    </task>
    <sequenceFlow id="Flow_021a60b" sourceRef="startNode1" targetRef="Activity_0im6xch" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_1">
      <bpmndi:BPMNShape id="BPMNShape_startNode1" bpmnElement="startNode1" bioc:stroke="">
        <omgdc:Bounds x="240" y="200" width="30" height="30" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="242" y="237" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0im6xch_di" bpmnElement="Activity_0im6xch">
        <omgdc:Bounds x="390" y="175" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_021a60b_di" bpmnElement="Flow_021a60b">
        <di:waypoint x="270" y="215" />
        <di:waypoint x="390" y="215" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`
}
</script>