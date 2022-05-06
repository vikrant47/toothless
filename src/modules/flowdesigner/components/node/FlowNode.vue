<script lang="ts" setup>
import {CSSProperties, useAttrs} from 'vue'
import {Handle, Position, Connection, Edge, NodeProps} from '@braks/vue-flow'
import SvgIcon from "@/icons/SvgIcon.vue";

interface FlowNode extends NodeProps {
  data: {
    ports: any[]
    isStart: boolean,
    isEnd: boolean,
  }
}

const props = defineProps<FlowNode>()
const attrs = useAttrs();
const targetHandleStyle: CSSProperties = {background: '#555'}
const sourceHandleStyle: CSSProperties = {...targetHandleStyle, left: '10px'}

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params)
const width = 200 + 70 * (props.data.ports.length + 1);
const parts = width / props.data.ports.length;
let gap = 0;

const calculateLeftPortPosition = (index) => {
  if (index > 0) {
    gap = 50;
  }
  return (100 * (index + 1)) + gap;
}
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
  components: {SvgIcon}
}
</script>
<template>
  <div class="flow-node-wrapper" :style="{width:width + 'px'}">
    <Handle v-if="!props.data.isStart" type="target" :position="Position.Top"
            :id="attrs.id+'-in'"
            :on-connect="onConnect"/>
    <div class="contents">
      <div class="icon">
        <svg-icon :icon-class="props.data.icon"/>
      </div>
      <div class="detail">
        <div class="label">{{ props.data.label }}</div>
        <div class="description">{{ props.data.description }}</div>
      </div>
    </div>
    <Handle v-for="(port,index) in props.data.ports" :key="index" :id="(attrs.id+'-out-' + index)" type="source"
            :position="Position.Bottom"
            :style="{left:calculateLeftPortPosition(index) +'px'}">
      <div class="label">{{ port.label }}</div>
    </Handle>
  </div>
</template>
<style scoped lang="scss">

.flow-node-wrapper {
  background-color: white;
  border: 1px solid #8d9797;
  /* border-top: 3px solid #304156; */
  text-align: center;
  border-radius: 5px;
  /* box-shadow: 0px 30px 40px -15px #a3a5ae; */
  width: 200px;
  height: 80px;

  .vue-flow__handle-bottom {
    top: auto;
    left: 50%;
    bottom: -12px;
    transform: translate(-50%, 0);
    width: 30%;
    height: 30%;
    border-radius: 30px;
    background: #414441;
    color: #f4fff5;
    border: 1px solid #282626;

    .label {
      height: 100%;
      padding: 3px;
      font-size: 8px;
      font-weight: 400;
    }
  }

  .vue-flow__handle-top {
    left: 15%;
    background: white;
    border: 1px solid black;
    width: 15px;
    height: 15px;
    top: -7%;
  }


  .contents, .detail {
    padding: 5px;
    display: flex;
    flex-flow: row wrap;
    align-content: space-between;
    justify-content: space-between;

    .icon {
      padding: 10px;
      width: 10%;
    }

    .svg-icon {
      font-size: 45px;
    }
  }

  .detail {
    width: 90%;

    .label {
      width: 100%;
      font-size: 15px;
      font-weight: 600;
    }

    .description {
      width: 100%;
    }
  }

}
</style>
