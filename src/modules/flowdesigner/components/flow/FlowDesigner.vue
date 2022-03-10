<template>
  <div class="flow-designer-warpper">
    <!-- BasicExample.vue template -->
    <VueFlow
      v-model="elements"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      @elements-remove="onElementsRemove"
      @connect="onConnect"
      @node-drag-stop="onNodeDragStop"
      @node-click="onElementClick"
      @elementClick="onElementClick"
      @load="onLoad"
    >
      <MiniMap/>
      <Controls/>
      <Background color="#aaa" :gap="8"/>
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

export default defineComponent({
  name: 'FlowDesigner',
  components: {VueFlow, MiniMap, Controls, Background},
  data() {
    return {
      elements: [
        {
          id: '1',
          type: 'input',
          data: {label: 'Node 1'},
          position: {x: 250, y: 5},
        },
        {id: '2', data: {label: 'Node 2'}, position: {x: 100, y: 100}},
        {id: '3', data: {label: 'Node 3'}, position: {x: 400, y: 100}},
        {id: '4', data: {label: 'Node 4'}, position: {x: 400, y: 200}},
        {id: 'e1-2', source: '1', target: '2', animated: true},
        {id: 'e1-3', source: '1', target: '3'},
      ],
    };
  },
  methods: {
    onLoad() {
    },
    onElementClick() {
    },
    onNodeDragStop() {
    },
    onConnect() {
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

<style scoped></style>
