<script setup lang="ts">
const props = defineProps({
  hoursRotate: {
    type: Number,
    default: 0,
  },
  minutesRotate: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div
    class="relative flex h-[170px] w-[170px] items-center justify-center rounded-[50%] border-[4px] border-solid border-blackC bg-containerC shadow-[inset_2px_2px_8px_rgba(0,0,0,.4)]"
  >
    <div
      class="z-[2] h-[8px] w-[8px] rounded-[50%] bg-blackC shadow-[0_0_6px_rgba(0,0,0,.25)]"
    ></div>
    <div
      class="absolute h-[40px] w-[3px] origin-bottom bg-redC shadow-[0_0_6px_rgba(0,0,0,.25)] transition-transform"
      :style="`transform: translateY(-20px) rotateZ(${props.hoursRotate}deg)`"
    ></div>
    <div
      class="absolute h-[62px] w-[3px] origin-bottom bg-redC shadow-[0_0_6px_rgba(0,0,0,.25)] transition-transform"
      :style="`transform: translateY(-32px) rotateZ(${props.minutesRotate}deg)`"
    ></div>
  </div>
</template>
