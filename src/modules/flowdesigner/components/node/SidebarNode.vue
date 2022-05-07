<template>
  <div class="sidebar-node">
    <div class="" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, node)">
      <svg-icon :icon-class="node.icon"/>
      <div class="node-text">
        <span>  {{ node.label }}</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {EngineFlowNode} from '@/modules/flowdesigner/engine-api/engine.flow.node';
import SvgIcon from "@/icons/SvgIcon.vue";

export default defineComponent({
  name: 'SidebarNode',
  components: {SvgIcon},
  props: {
    node: EngineFlowNode,
  },
  methods: {
    onDragStart(event: DragEvent, nodeType: any) {
      if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', JSON.stringify(nodeType))
        event.dataTransfer.effectAllowed = 'move'
      }
    }
  }
});
</script>

<style scoped lang="scss">
.sidebar-node {
  text-align: center;
  color: var(--el-text-color-regular);
  height: 90px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  border-right: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
  transition: background-color var(--el-transition-duration);

  > div {

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;

    .node-text {
      width: 75%;
      padding: 5px;
    }
    .svg-icon{
      font-size: 42px;
    }
  }
}
</style>
