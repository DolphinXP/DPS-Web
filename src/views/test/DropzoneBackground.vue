<script lang="ts" setup>
import {Background} from '@vue-flow/background'
</script>

<template>
  <div style="height: 100%; width: 100%">
    <Background :gap="20" :size="2" pattern-color="#BDBDBD">
      <slot/>
    </Background>
  </div>
</template>
