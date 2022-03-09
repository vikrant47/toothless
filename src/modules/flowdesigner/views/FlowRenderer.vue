<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-sub-menu
          v-for="(folder, index) in folders"
          :key="folder.label"
          :index="index"
        >
          <template
            #title>
            <el-icon>
              <elu-icon-message/>
            </el-icon>
            {{ folder.label }}
          </template>
          <div v-for="node in folder.nodes" :key="node.name">
            <FlowNode :node="node"/>
          </div>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <el-icon style="margin-right: 15px">
            <elu-icon-setting/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>Tom</span>
      </el-header>
      <el-main>
        <FlowDesigner :flow="flow"/>
      </el-main>
    </el-container>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)"/>
  </el-container>
</template>

<script>
import {
  Message as EluIconMessage,
  Setting as EluIconSetting,
} from '@element-plus/icons';
import FlowNode from '@/modules/flowdesigner/components/node/FlowNode';
import FlowDesigner from '@/modules/flowdesigner/components/flow/FlowDesigner';
import {EngineFlow} from "../engine-api/engine.flow";
import {EngineFlowNode} from "../engine-api/engine.flow.node";

export default {
  name: 'FlowRenderer',
  components: {
    FlowDesigner,
    FlowNode,
    EluIconMessage,
    EluIconSetting,
  },
  data() {
    return {
      folders: [],
      flow: new EngineFlow({flowId: this.recordId}),
      recordId: this.$route.params.flowId,
    };
  },
  async mounted() {
    this.folders = await EngineFlowNode.fetchAllFolders();
    if (!this.flow.isNew()) {
      await this.flow.refresh();
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-aside {
  padding: 5px;
}
</style>
