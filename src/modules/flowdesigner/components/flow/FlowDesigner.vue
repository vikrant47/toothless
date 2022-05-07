<script lang="ts" setup>
import {
  addEdge, Connection,
  ConnectionMode,
  Controls, Edge,
  Elements,
  isEdge,
  MiniMap,
  Node,
  Position,
  SnapGrid,
  useVueFlow,
  VueFlow,
  Background, MarkerType,
} from '@braks/vue-flow'
import ColorSelectorNode from './ColorSelectorNode.vue'
import {Engine} from "@/modules/engine/core/engine";
import FlowNode from "@/modules/flowdesigner/components/node/FlowNode.vue";
import FlowEdge from "@/modules/flowdesigner/components/edge/FlowEdge.vue";

const elements = ref<Elements>([])
//const bgColor = ref('#1A192B')
// const connectionLineStyle = {stroke: '#fff'}
// const snapGrid: SnapGrid = [16, 16]

const onChange = (event: Event) => {
  elements.value.forEach((e) => {
    if (isEdge(e) || e.id !== '2') return e
    // bgColor.value = (event.target as HTMLInputElement).value
  })
}

onMounted(() => {
  elements.value = [
    {
      id: Engine.uuid(),
      type: 'custom',
      label: 'Start',
      data: {
        icon: 'start',
        label: 'Start',
        description: '',
        ports: [{label: 'Out'}],
        isStart: true
      },
      position: {x: 250, y: 5},
    },
  ]
})

const {onPaneReady, instance, onConnect} = useVueFlow({
  //connectionMode: ConnectionMode.Loose,
  //connectionLineStyle,
  // snapToGrid: true,
  //snapGrid,
  defaultZoom: 1.5,
})
onPaneReady((i) => {
  i.fitView({padding: 4})
  console.log('flow loaded:', i)
})
const onDragOver = ((event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
})
const onDrop = ((event: DragEvent) => {
  console.log('on drop')
  const nodeData = JSON.parse(event.dataTransfer?.getData('application/vueflow') || '');
  const position = instance.value.project({x: event.clientX - 550, y: event.clientY - 200});
  const newNode = Object.assign({
    id: Engine.uuid(),
    position,
    type: 'custom',
    data: {...nodeData},
  });
  elements.value.push(newNode);
})
onConnect((params: Connection | Edge) => {
  elements.value = addEdge(Object.assign({}, params, {
    id: Engine.uuid(),
    type: 'custom',
    markerEnd: MarkerType.Arrow,
    style: {strokeWidth: 2, stroke: '#000'},
  }), elements.value)
});
const removeNode = (node) => {

  const index = elements.value.findIndex(n => n.id === node.id);
  if (index < 0) {
    throw new Error(`No node exists ${JSON.stringify(node)}`)
  }
  elements.value.splice(index, 1);// remove node
  const ports = node.data?.ports;
  if (ports?.length) {
    const portIds = ports.map((p, i) => node.id + '-out-' + i).concat([node.id + '-in']);// generating port ids
    const edgeIds = elements.value.filter((edge) => portIds.indexOf(edge.target) >= 0 || portIds.indexOf(edge.source) >= 0 || node.id === edge.source || node.id === edge.target).map(e => e.id);
    if (edgeIds.length > 0) {
      for (let i = elements.value.length - 1; i >= 0; i--) {
        if (edgeIds.indexOf(elements.value[i].id) >= 0) {
          elements.value.splice(i, 1);// remove edge
        }
      }
    }
  }
}
</script>
<template>
  <div
    class="flow-designer-warpper dndflow"
    @dragover="onDragOver"
    @drop="onDrop"
    @dragenter.prevent
  >
    <!-- BasicExample.vue template -->
    <VueFlow
      v-model="elements"
      :fit-view-on-init="true"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      :edges-updatable="true"
    >
      <template #node-custom="props">
        <FlowNode v-bind="props" @remove-node="removeNode"/>
      </template>
      <template #edge-custom="props">
        <FlowEdge v-bind="props"/>
      </template>
      <Background/>
      <MiniMap/>
      <Controls/>
      <div style="position: absolute; right: 10px; top: 10px; z-index: 4">
        <button class="button" @click="resetTransform">reset transform</button>
        <button class="button" @click="updatePos">change pos</button>
        <button class="button" @click="toggleClassnames">
          toggle classnames
        </button>
        <button class="button" @click="logToObject">toObject</button>
      </div>
    </VueFlow>
  </div>
</template>
<style scoped lang="scss">
.flow-designer-warpper {
  width: 100%;
  height: 80%;
}
</style>
