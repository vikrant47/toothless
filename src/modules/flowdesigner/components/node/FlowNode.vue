<script lang="ts" setup>
import {CSSProperties, useAttrs} from 'vue'
import {Handle, Position, Connection, Edge, NodeProps} from '@braks/vue-flow'
import SvgIcon from "@/icons/SvgIcon.vue";
import {Close} from '@element-plus/icons-vue';

interface FlowNode extends NodeProps {
  data: {
    ports: any[]
    isStart: boolean,
    isEnd: boolean,
  }
}

const props = defineProps<FlowNode>()
const attrs = useAttrs();
/*const targetHandleStyle: CSSProperties = {background: '#555'}
const sourceHandleStyle: CSSProperties = {...targetHandleStyle, left: '10px'}*/

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params)
const width = 200 + 70 * (props.data.ports.length + 1);
const parts = width / props.data.ports.length;
let gap = 0;
const calculateBottomPortPosition = (index) => {
  if (props.data.isStart) {
    return '-22px'
  }
  return '-12px';
}
const calculateLeftPortPosition = (index) => {
  if (props.data.isStart) {
    return 55;
  }
  if (index > 0) {
    gap = 50;
  }
  return (100 * (index + 1)) + gap;
}
</script>

<template>
  <div class="flow-node-wrapper" :class="{'start':props.data.isStart,'end':props.data.isEnd}"
       :style="{width:width + 'px'}">
    <div class="flow-node-selection">
      <el-button
        type="danger"
        :icon="Close"
        circle
        @click="()=>{this.$emit('removeNode',{id:attrs.id,data:props.data})}"/>
    </div>
    <Handle
      v-if="!props.data.isStart" :id="attrs.id+'-in'"
      type="target"
      :position="Position.Top"
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
    <div v-if="!props.data.isEnd">
      <Handle
        v-for="(port,index) in props.data.ports"
        :id="(attrs.id+'-out-' + index)"
        :key="index" type="source"
        :position="Position.Bottom"
        :style="{left:calculateLeftPortPosition(index) +'px',bottom:calculateBottomPortPosition(index)}">
        {{ props.data.isStart ? '' : port.label }}
        <!--      <div class="label">{{ port.label }}</div>-->
      </Handle>
    </div>
  </div>
</template>
<style scoped lang="scss">
.flow-node-wrapper {
  background-color: white;
  border: 1px solid #8d9797;
  /* border-top: 3px solid #304156; */
  text-align: center;
  border-radius: 8px;
  /* box-shadow: 0px 30px 40px -15px #a3a5ae; */
  width: 200px;
  height: 80px;

  .flow-node-selection {
    position: absolute;
    border: 2px dashed #a59898;
    width: 115%;
    height: 148%;
    top: -18px;
    left: -24px;
    border-radius: 5px;
    display: none;

    button {
      position: absolute;
      top: -15px;
      right: -10px;
    }
  }

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
    text-align: left;
    width: 82%;

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

.selected .flow-node-wrapper {
  border: 1px solid black;

  .flow-node-selection {
    display: block;
  }
}

.flow-node-wrapper.start, .flow-node-wrapper.end {
  border: none;
  background: transparent;

  .svg-icon {
    font-size: 80px;
  }

  .detail {
    display: none;
  }

  .vue-flow__handle-bottom {
    border: 1px solid black;
    width: 15px;
    height: 15px;
    background-color: black;
  }

  .vue-flow__handle-top {
    left: 17%;
    background: white;
    border: 1px solid black;
    width: 15px;
    height: 15px;
    top: 3%;
  }
}

.flow-node-wrapper.start {
  .flow-node-selection {
    display: none;
  }
}

</style>
