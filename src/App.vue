<script setup lang="ts">
import {
  earthTimeToAlienTime,
  alienTimeToEarthTime,
  formatAlienDate,
  getAlienTimeBySecondNum,
  getAlienSecondNumByTime,
  type AlienTime,
} from './utils/time';
import { formatEarthDate } from './utils';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import SimpleClock from './components/SimpleClock.vue';
import AlarmIcon from './assets/AlarmIcon.vue';
import SettingIcon from './assets/SettingIcon.vue';
import SettingDialog from './components/SettingDialog.vue';
import { clearInterval, setInterval } from 'worker-timers';

const hoursPointerRotate = ref();
const minutesPointerRotate = ref();

const clock = (hours: number, minutes: number) => {
  // We get the hours and minutes
  // (current time) / 18(hours) * 360(deg circle)
  // (Current minute) / 90(minutes) * 360(deg circle)
  let hh = (hours / 18) * 360,
    mm = (minutes / 90) * 360;

  // We add a rotation to the elements
  hoursPointerRotate.value = hh + mm / 18;
  minutesPointerRotate.value = mm;
};

const alienTime = ref(earthTimeToAlienTime());
const earthTime = ref(alienTimeToEarthTime(alienTime.value));
let isNow = true;
let timer: any = null;
function timerFunc() {
  timer = setInterval(() => {
    if (isNow) {
      alienTime.value = earthTimeToAlienTime();
    } else {
      alienTime.value = getAlienTimeBySecondNum(getAlienSecondNumByTime(alienTime.value) + 1);
    }
  }, 500);
}

onMounted(() => {
  timerFunc();
});

onUnmounted(() => {
  clearInterval(timer);
  timer = null;
});

watch(alienTime, (newVal) => {
  earthTime.value = alienTimeToEarthTime(newVal);
  clock(newVal.hours, newVal.minutes);
});

const settingDialogShow = ref(false);
function openSettingDialogShow() {
  settingDialogShow.value = true;
}

function setAlienTime(newIsNow: boolean, newTime?: AlienTime) {
  clearInterval(timer);
  if (!newIsNow) {
    alienTime.value = newTime!;
  }
  isNow = newIsNow;
  timerFunc();
}
</script>

<template>
  <main class="m-auto flex h-full w-[640px] flex-col bg-cover text-4xl">
    <div class="flex flex-1 flex-col items-center justify-center">
      <div class="mb-4 flex gap-8">
        <button>
          <AlarmIcon
            class="h-10 w-10 rounded-full transition-shadow hover:shadow-md hover:shadow-redC"
          />
        </button>
        <button @click="openSettingDialogShow">
          <SettingIcon
            class="h-10 w-10 rounded-full transition-shadow hover:shadow-md hover:shadow-redC"
          />
        </button>
      </div>
      <div
        class="flex h-[306px] w-[602px] items-center justify-center rounded-[10rem] border-[4px] border-solid border-blackC bg-containerC shadow-border"
      >
        <SimpleClock :hours-rotate="hoursPointerRotate" :minutes-rotate="minutesPointerRotate" />
        <div class="ml-[50px] flex w-[160px] flex-col text-blackC">
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

    <SettingDialog v-model:show="settingDialogShow" :setAlienTime="setAlienTime" />
  </main>
</template>
