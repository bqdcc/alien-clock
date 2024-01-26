<script setup lang="ts">
import { earthTimeToAlienTime, alienTimeToEarthTime, formatAlienDate } from './utils/time';
import { formatEarthDate } from './utils';
import { ref, watch } from 'vue';

const hourPointerStyle = ref();
const minutesPointerStyle = ref();

const clock = () => {
  // We get the Date object
  let date = new Date();

  // We get the hours and minutes
  // (current time) / 12(hours) * 360(deg circle)
  // (Current minute) / 60(minutes) * 360(deg circle)
  let hh = (date.getHours() / 12) * 360,
    mm = (date.getMinutes() / 60) * 360;

  // We add a rotation to the elements
  hourPointerStyle.value = `rotateZ(${hh + mm / 12}deg)`;
  minutesPointerStyle.value = `rotateZ(${mm}deg)`;
};

const alienTime = ref(earthTimeToAlienTime());
const earthTime = ref(alienTimeToEarthTime(alienTime.value));
setInterval(() => {
  alienTime.value = earthTimeToAlienTime();
}, 500);

watch(alienTime, (newVal) => {
  earthTime.value = alienTimeToEarthTime(newVal);
});
</script>

<template>
  <main class="m-auto flex h-full w-[640px] flex-col bg-cover text-4xl">
    <div class="flex flex-1 items-center justify-center">
      <div
        class="flex h-[306px] w-[602px] items-center justify-center rounded-[10rem] border-[4px] border-solid border-blackC bg-containerC shadow-border"
      >
        <div
          class="relative flex h-[170px] w-[170px] items-center justify-center rounded-[50%] border-[4px] border-solid border-blackC bg-containerC shadow-[inset_2px_2px_8px_rgba(0,0,0,.4)]"
        >
          <div
            class="z-[2] h-[8px] w-[8px] rounded-[50%] bg-blackC shadow-[0_0_6px_rgba(0,0,0,.25)]"
          ></div>
          <div
            class="absolute h-[40px] w-[3px] origin-bottom translate-y-[-20px] bg-redC shadow-[0_0_6px_rgba(0,0,0,.25)]"
          ></div>
          <div
            class="absolute h-[62px] w-[3px] origin-bottom translate-y-[-32px] rotate-[150deg] bg-redC shadow-[0_0_6px_rgba(0,0,0,.25)]"
          ></div>
        </div>
        <div class="ml-[50px] flex flex-col text-blackC">
          <div
            class="mb-[1.5rem] border-b-[1px] border-solid border-textCL pb-[.5rem] text-[1.5rem] font-medium"
          >
            {{ formatAlienDate(alienTime).date }}
          </div>
          <div class="text-[2.25rem] font-semibold">
            {{ formatAlienDate(alienTime).time }}
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-se-md rounded-ss-md bg-slate-500 p-1">
      Earth Time: {{ formatEarthDate(earthTime) }}
    </div>
  </main>
</template>
