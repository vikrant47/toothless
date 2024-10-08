<script lang="ts" setup>
import {getEdgeCenter, getBezierPath, Position, useVueFlow, EdgeProps, getSmoothStepPath} from '@braks/vue-flow'
import {useAttrs} from "vue";
import {Close} from '@element-plus/icons-vue';

interface CustomEdgeProps<T = any> extends EdgeProps<T> {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  data?: T
  markerEnd: string;
  style: any;
}

const props = defineProps<CustomEdgeProps>();
const attrs = useAttrs();
const {id: storeId, applyEdgeChanges, store, getEdges} = useVueFlow()

const onClick = (evt: Event, id: string) => {
  applyEdgeChanges([{type: 'remove', id}])
  evt.stopPropagation()
}

const foreignObjectSize = 40

const edgePath = computed(() =>
  getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  }),
)
const center = computed(() =>
  getEdgeCenter({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
  }),
)
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
<template>
  <path :id="props.id" :style="props.style" class="vue-flow__edge-path" :d="edgePath" :marker-end="props.markerEnd"/>
  <foreignObject
    :width="foreignObjectSize"
    :height="foreignObjectSize"
    :x="center[0] - foreignObjectSize / 2"
    :y="center[1] - foreignObjectSize / 2"
    class="edgebutton-foreignobject"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <body>
    <el-button type="danger" :icon="Close" circle @click="(event) => onClick(event, props.id)"/>
    </body>
  </foreignObject>
</template>
<style scoped lang="scss">

.el-button {
  display: none;
  cursor: pointer;
}


.vue-flow__edge-custom:hover .el-button, .vue-flow__edge-custom.selected .el-button {
  display: block;
}


</style>
