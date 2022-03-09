<template>
  <div class="action-wrapper">
    <el-dropdown
      v-if="action.children && action.children.length > 0"
      @command="handleChildAction"
    >
      <el-button
        v-if="!action.hidden"
        :id="action.id"
        class="parent-action action"
        :type="action.style.type"
        :children="action.children"
        :name="action.name"
        :icon="action.style.icon"
        :label="action.label"
        :shape="action.style.shape"
        :plain="action.style.plain"
        :loading="action.loading"
        :size="action.style.size"
        @click="process($event)"
      >
        {{ action.label }}
        <span class="separator">
          <el-icon class="elu-icon--right"><icon-arrow-down/></el-icon>
        </span>
      </el-button>
      <el-dropdown-menu
        v-for="child of action.children"
        :key="child.id"
        :divided="true"
      >
        <el-dropdown-item
          v-if="!child.hidden"
          :command="child"
          :type="child.style.type"
          :children="child.children"
          :name="child.name"
          :icon="child.style.icon"
          :label="child.label"
          :shape="child.style.shape"
          :plain="child.style.plain"
          :loading="child.loading"
          :size="child.style.size"
          @click="process($event, child)"
        >{{ child.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="
        (!action.children || action.children.length === 0) && !action.hidden
      "
      :id="action.id"
      :type="action.style.type"
      :children="action.children"
      :name="action.name"
      :icon="action.style.icon"
      :label="action.label"
      :shape="action.style.shape"
      :plain="action.style.plain"
      :loading="action.loading"
      :size="action.style.size"
      @click="process($event)"
    >{{ action.label }}
    </el-button>
  </div>
</template>

<script lang="ts">
import {ArrowDown as IconArrowDown} from '@element-plus/icons';

import {EngineAction} from '@/modules/engine/core/engine.action';

export default defineComponent({
  name: 'EnAction',
  components: {
    IconArrowDown,
  },
  props: {
    action: {
      type: EngineAction,
      default() {
        return new EngineAction();
      },
    },
    event: {
      type: Object,
      default: () => {
        return {};
      },
    },
    context: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  created() {
  },
  methods: {
    async handleChildAction(child) {
      return await this.process(null, child);
    },
    async process($event, action) {
      if (!action) {
        action = this.action;
      }
      this.loading = true;
      try {
        await action.execute(this.event, this.context);
      } catch (e) {
        console.error('Error while processing action handler ', e, {
          context: this.context,
        });
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
.action-wrapper .parent-action .separator {
  margin-left: 5px;
  border-left: 1px solid white;
}

.action-wrapper .parent-action {
  padding-right: 5px;
}
</style>
