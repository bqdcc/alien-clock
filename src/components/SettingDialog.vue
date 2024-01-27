<script setup lang="ts">
import Button from './Button.vue';
import { defineProps, defineEmits, onMounted, onUnmounted, ref, type Ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  setAlienTime: {
    type: Function,
    default: () => {},
  },
});
const emites = defineEmits(['update:show']);

function handleClose() {
  errorMessage.value = '';
  emites('update:show', false);
}

function handleEsc(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.show) {
    handleClose();
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

const initNewAlienTime = {
  year: null,
  month: null,
  day: null,
  hours: null,
  minutes: null,
  seconds: null,
};

type newAlienTimeKey = keyof typeof initNewAlienTime;

const newAlienTime: Ref<typeof initNewAlienTime> = ref({ ...initNewAlienTime });
const errorMessage = ref('');
function handleSet() {
  const isValidate = Object.keys(newAlienTime.value).every((key) => {
    if (newAlienTime.value[key as newAlienTimeKey]) {
      return true;
    } else {
      errorMessage.value = `Please check ${key}`;
      return false;
    }
  });
  if (isValidate) {
    props.setAlienTime(false, newAlienTime.value);
    handleClose();
  }
}
function handleNow() {
  props.setAlienTime(true);
  handleClose();
}
</script>

<template>
  <div
    v-show="props.show"
    class="fixed left-[50%] top-[20%] z-50 flex h-[300px] w-[600px] translate-x-[-50%] flex-col items-center justify-center rounded-md bg-white text-[1.25rem]"
  >
    <div @click="handleClose" class="absolute right-6 top-2 cursor-pointer select-none">X</div>
    <div class="flex items-center justify-center gap-2">
      <div class="flex w-[80px] flex-col">
        <h2>Year</h2>
        <input
          v-model="newAlienTime.year"
          type="number"
          class="border-[2px] px-1"
          placeholder="2804"
        />
      </div>
      <div class="flex w-[80px] flex-col">
        <h2>Month</h2>
        <input
          v-model="newAlienTime.month"
          type="number"
          class="border-[2px] px-1"
          placeholder="18"
        />
      </div>
      <div class="flex w-[80px] flex-col">
        <h2>Date</h2>
        <input
          v-model="newAlienTime.day"
          type="number"
          class="border-[2px] px-1"
          placeholder="31"
        />
      </div>
      <div class="flex w-[80px] flex-col">
        <h2>Hour</h2>
        <input
          v-model="newAlienTime.hours"
          type="number"
          class="border-[2px] px-1"
          placeholder="2"
        />
      </div>
      <div class="flex w-[80px] flex-col">
        <h2>Minute</h2>
        <input
          v-model="newAlienTime.minutes"
          type="number"
          class="border-[2px] px-1"
          placeholder="2"
        />
      </div>
      <div class="flex w-[80px] flex-col">
        <h2>Second</h2>
        <input
          v-model="newAlienTime.seconds"
          type="number"
          class="border-[2px] px-1"
          placeholder="88"
        />
      </div>
    </div>
    <div class="min-h-[40px] text-redC">
      {{ errorMessage }}
    </div>
    <div class="flex gap-2">
      <Button @click="handleNow">Now</Button>
      <Button @click="handleSet">Set</Button>
    </div>
  </div>
</template>
