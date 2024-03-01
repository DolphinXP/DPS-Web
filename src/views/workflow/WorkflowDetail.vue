<script lang="ts" setup>

import {onMounted} from "vue";
import BpmnJS from "bpmn-js/lib/NavigatedViewer.js";
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer.js";
import axios from "axios";

let bpmnViewer: NavigatedViewer | null = null;
let id = '';

const props = defineProps({
  recordId: String
})
let workflow = {}

onMounted(() => {
  console.log(props.recordId)
  id = props.recordId!;

  bpmnViewer = new BpmnJS({
    container: "#canvas",
    textRenderer: {
      defaultStyle: {
        fontFamily: '"Nothing You Could Do", cursive',
        fontWeight: 'bold',
        fontSize: '20px',
      },
      externalStyle: {
        fontSize: '16px',
        lineHeight: 1.5
      }
    },
    // bpmnRenderer: {
    //   defaultFillColor: '#666',
    //   defaultStrokeColor: '#fff'
    // }
  });

  let eventBus = bpmnViewer.get('eventBus');
  eventBus.on('element.click', function (event: any) {
    console.log('element.click', event.element.id);
  });

  // get workflow by id
  axios.get('http://localhost:8080/api/v1/workflow/' + id).then(
      response => {
        workflow = response.data.data;
        console.log(workflow)
        createNewDiagram(workflow.WorkTemplate.BpmnXml);
      }
  ).catch(error => console.log(error))
})

async function createNewDiagram(data) {
  // 将字符串转换成图显示出来
  data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
    return str.replace(/</g, '&lt;')
  })
  try {
    await bpmnViewer.importXML(data)
    refresh()
  } catch (err) {
    console.error(err.message, err.warnings)
  }
}

function refresh() {
  let canvas = bpmnViewer.get('canvas');
  canvas.zoom('fit-viewport');
}

</script>

<template>
  <div class="container">
    <div class="top-bar">
      <div>
        <a-button type="primary">Start</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="primary">Stop</a-button>
      </div>
      <div></div>
    </div>

    <div class="content">
      <div id="canvas" class="canvas"></div>
      <div class="detail-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, perspiciatis?
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aut autem corporis cumque distinctio dolores
        ea eaque eius enim eos esse facere incidunt itaque necessitatibus nobis, quibusdam quo repudiandae rerum, saepe
        sed sequi sit velit, veritatis! Animi beatae consequuntur dolore dolorem doloribus dolorum eos fugiat fugit
        harum ipsum magni maxime molestias necessitatibus, nobis possimus provident quas qui quibusdam quos repellat sed
        similique voluptas voluptate voluptatem voluptatum. Accusamus amet aperiam assumenda, autem ducimus expedita
        harum in inventore iure laudantium modi neque nisi nulla, numquam perspiciatis quasi qui quisquam sint ut
        veritatis! In, possimus, temporibus. Esse, eveniet expedita facere quaerat quo tempore. Lorem ipsum dolor sit
        amet, consectetur adipisicing elit. Asperiores at aut fugiat incidunt ipsum officia perferendis reiciendis sint
        vel veniam. Atque id ipsum, iure laborum mollitia odio optio rerum saepe.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque blanditiis ducimus illum ipsa laborum
        necessitatibus nobis perspiciatis praesentium quaerat? Aperiam cupiditate dicta doloribus in incidunt
        praesentium reprehenderit temporibus ullam veniam vitae? Assumenda atque consequuntur culpa cupiditate dicta eos
        est eum, fugit ipsam laudantium magnam neque non nostrum pariatur quibusdam quisquam veniam. Alias facilis
        libero non quisquam sit? Aspernatur consectetur eos eveniet fugiat id laboriosam quam quia recusandae similique
        soluta! A alias aperiam asperiores aspernatur aut blanditiis consequatur culpa dignissimos et eum, ex expedita
        explicabo harum id inventore ipsum laboriosam libero magni maiores modi nam necessitatibus nesciunt nostrum,
        omnis pariatur perferendis perspiciatis quas quasi ratione reiciendis rem reprehenderit repudiandae rerum sunt
        totam ut voluptas. Ab aliquid architecto commodi cumque dolorum eius eligendi et, facere, fugiat iste iure iusto
        labore laborum, maiores minus molestiae nesciunt non nostrum numquam odit omnis perferendis perspiciatis quia
        quo quos ratione vel voluptatibus? Dignissimos distinctio doloribus explicabo facere nihil, pariatur praesentium
        provident quos repellendus tenetur? Aliquam amet corporis cupiditate debitis doloribus dolorum eligendi facilis
        illum iste, laboriosam magni nulla odio placeat possimus praesentium, qui saepe sed similique sint soluta
        suscipit voluptate voluptates voluptatum. Accusamus assumenda aut culpa ipsa ipsam maxime molestiae nihil nulla
        obcaecati. Adipisci cum dignissimos eius facere minus sed totam? Exercitationem, modi, natus! Accusantium
        aliquid aperiam blanditiis cum cupiditate omnis ut voluptate. Dolore est illum qui sapiente voluptatibus!
        Aperiam aspernatur blanditiis consequuntur eligendi explicabo hic ipsam laboriosam neque repellendus saepe.
        Aspernatur, cum fuga magni obcaecati repudiandae voluptatum. Autem cum cumque eaque eum in labore modi molestias
        nam obcaecati praesentium tenetur unde, veritatis. Assumenda atque cumque delectus dolorum eligendi eveniet,
        facilis fugiat ipsum iste iure, labore minima, porro praesentium quis sapiente similique sit voluptas. Adipisci
        autem cupiditate eos expedita ipsum laborum neque, odio provident quae voluptas. Atque est laborum magnam modi
        repudiandae? Fugit minima quae reiciendis.
      </div>
    </div>

  </div>

</template>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  height: 90%;
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content .canvas {
  height: 480px;
  overflow: auto;
}

.content .detail-content {
  flex: 1;
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;

}

.top-bar {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  border: 1px solid #eeeeee;
}

</style>