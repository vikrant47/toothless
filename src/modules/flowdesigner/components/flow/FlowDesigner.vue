<template>
  <div class="flow-designer-warpper dndflow"
       @dragover="onDragOver"
       @drop="onDrop"
       @dragenter.prevent
  >
    <!-- BasicExample.vue template -->
    <VueFlow
      v-model="elements"
      :fit-view-on-init="true"
      :snap-to-grid="true"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      :edgesUpdatable="true"
      @elements-remove="onElementsRemove"
      @edge-update="onEdgeUpdate"
      @connect="onConnect"
      @edge-update-start="onEdgeUpdateStart"
      @edge-update-end="onEdgeUpdateEnd"
      @node-drag-stop="onNodeDragStop"
      @node-click="onElementClick"
      @element-click="onElementClick"
      @pane-ready="onPaneReady"
      @load="onLoad"
    >
      <template #node-custom="props">
        <FlowNode v-bind="props"/>
      </template>
      <template #edge-custom="props">
        <FlowEdge v-bind="props"/>
      </template>
      <MiniMap/>
      <Controls/>
      <Background/>
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

<script lang="ts">
// BasicExample.vue setup function
import {
  VueFlow,
  MiniMap,
  Controls,
  Background,
} from '@braks/vue-flow/dist/vue-flow.cjs';
import {addEdge, Connection, Edge, ElementData, FlowInstance, MarkerType, useVueFlow} from "@braks/vue-flow";
import {Engine} from "@/modules/engine/core/engine";
import FlowEdge from "@/modules/flowdesigner/components/edge/FlowEdge.vue";
import FlowNode from "@/modules/flowdesigner/components/node/FlowNode.vue";

export default defineComponent({
  name: 'FlowDesigner',
  components: {FlowNode, FlowEdge, VueFlow, MiniMap, Controls, Background},
  data() {
    return {
      // @ts-ignore
      instance: null as FlowInstance,
      // @ts-ignore
      elementData: null as ElementData,
      elements: [
        {
          id: Engine.uuid(),
          type: 'custom',
          label: 'Start',
          data: {
            icon: 'dashboard',
            label: 'Start',
            description: '',
            ports: [{label: 'Out'}],
            isStart: true
          },
          position: {x: 250, y: 5},
        }
      ] as any,
    };
  },
  methods: {
    onEdgeUpdate() {
    },
    onEdgeUpdateStart() {
    },
    onEdgeUpdateEnd() {
    },

    onPaneReady(vueFlowInstance: FlowInstance) {
      // vueFlowInstance.fitView()
      this.instance = vueFlowInstance
      this.elementData = ref(vueFlowInstance.getElements());
    },
    onDragOver(event: DragEvent) {
      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    },
    onDrop(event: DragEvent) {
      console.log('on drop')
      const nodeData = JSON.parse(event.dataTransfer?.getData('application/vueflow') || '');
      const position = this.instance.project({x: event.clientX - 550, y: event.clientY - 200});
      const newNode = Object.assign({
        id: Engine.uuid(),
        position,
        type: 'custom',
        data: {...nodeData},
      });
      this.elements.push(newNode);
    },
    onLoad() {
    },
    onElementClick() {
    },
    onNodeDragStop() {
    },
    onConnect(params: Connection | Edge) {
      addEdge(params, this.elements)
    },
    onElementsRemove() {
    },
    resetTransform() {
    },
    updatePos() {
    },
    toggleClassnames() {
    },
    logToObject() {
    },
  },
});
</script>

<style scoped lang="scss">
.flow-designer-warpper {
  width: 100%;
  height: 100%;
}
</style>
