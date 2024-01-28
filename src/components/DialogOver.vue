<script setup lang="ts">
import { defineProps, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  handleClose: {
    type: Function,
    default: () => {},
  },
});

function handleEsc(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.show) {
    props.handleClose();
    return;
  }
  return;
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc);
});
</script>

<template>
  <div
    v-show="props.show"
    class="fixed left-[50%] top-[20%] z-50 flex h-[300px] w-[600px] translate-x-[-50%] flex-col items-center justify-center rounded-md bg-white text-[1.25rem]"
  >
    <div @click="props.handleClose" class="absolute right-6 top-2 cursor-pointer select-none">
      X
    </div>
    <slot></slot>
  </div>
</template>
