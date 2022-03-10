<template>
  <div class="flow-node">
    <i :class="node.icon"/>
    <spn class="node-text">{{ node.label }}</spn>
  </div>
</template>

<script lang="ts">
import {EngineFlowNode} from '@/modules/flowdesigner/engine-api/engine.flow.node';

export default defineComponent({
  name: 'FlowNode',
  props: {
    node: EngineFlowNode,
  },
});
</script>

<style scoped></style>
