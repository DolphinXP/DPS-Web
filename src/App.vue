<template>
  <a-layout style="min-height: 100vh;">
    <a-layout-sider class="custom-side" v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo"><a href="/">DPS Web</a></div>

      <a-menu v-model:openKeys="openKeys"
              v-model:selectedKeys="selectedKeys"
              mode="inline"
              :items="items"
              theme="dark"
              style="min-width: 256px;"
              @click="handleClick">

      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)"/>
      </a-layout-header>
      <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import {h, reactive, ref, type VueElement} from 'vue';
import {
  PieChartOutlined,
  AliwangwangOutlined,
  ApartmentOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import TheWelcome from "@/components/TheWelcome.vue";
import AboutView from "@/views/AboutView.vue";
import type {ItemType, MenuProps} from "ant-design-vue";


const selectedKeys = ref<string[]>(['1-1']);
const openKeys = ref(['1']);
const collapsed = ref<boolean>(false);

function getItem(
    key: string,
    label: VueElement | string,
    icon?: any,
    children?: ItemType[] ,
    type?: 'group' ,
) : ItemType{
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = ref([
  getItem('1', 'Dashboard', ()=>h(PieChartOutlined), [
    getItem('1-1', 'Dashboard1' ),
    getItem('1-2', 'Dashboard2' ),
  ]),
  getItem('2', 'Tasks', ()=>h(AliwangwangOutlined), [
    getItem('2-1', 'Tasks1' ),
    getItem('2-2', 'Tasks2' ),
  ]),
  getItem('3', 'Test', ()=>h(ApartmentOutlined), [
    getItem('3-1', 'Test1' ),
    getItem('3-2', 'Test2' ),
  ]),
]);

const handleClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};
</script>

<style>
.custom-side{
  min-width: 256px !important;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo a {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>