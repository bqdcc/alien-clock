<script setup lang="ts">
import {
  alienBaseHour,
  alienBaseMinute,
  alienBaseMouth,
  alienBaseSecond,
  alienEpochYear,
  daysInAlienMonths,
} from '@/utils/time';
import Button from './Button.vue';
import { defineProps, defineEmits, onMounted, onUnmounted, ref, type Ref } from 'vue';
import { z } from 'zod';
import { formatZodError } from '@/utils';
import DialogOver from './DialogOver.vue';

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

const initNewAlienTime = {
  year: null,
  month: null,
  day: null,
  hours: null,
  minutes: null,
  seconds: null,
};

const newAlienTime: Ref<typeof initNewAlienTime> = ref({ ...initNewAlienTime });
const errorMessage = ref('');

const newAlienTimeScheam = z.object({
  year: z
    .number()
    .gte(alienEpochYear, `year minimum is ${alienEpochYear}`)
    .lte(99999, 'year maximum is 99999')
    .default(2804),
  month: z
    .number()
    .gte(1, 'month minimum is 1')
    .lte(alienBaseMouth, `month maximum is ${alienBaseMouth}`)
    .default(18),
  day: z
    .number()
    .gte(1, 'date minimum is 1')
    .lte(
      daysInAlienMonths[newAlienTime.value.month || 1],
      `date maximum is ${daysInAlienMonths[newAlienTime.value.month || 1]}`,
    )
    .default(31),
  hours: z
    .number()
    .gte(0, 'hour minimum is 0')
    .lte(alienBaseHour, `hour maximum is ${alienBaseHour}`)
    .default(0),
  minutes: z
    .number()
    .gte(0, 'minute minimum is 0')
    .lte(alienBaseMinute, `minute maximum is ${alienBaseMinute}`)
    .default(0),
  seconds: z
    .number()
    .gte(0, 'second minimum is 0')
    .lte(alienBaseSecond, `second maximum is ${alienBaseSecond}`)
    .default(0),
});

function handleSet() {
  try {
    const result = newAlienTimeScheam.parse(newAlienTime.value);
    props.setAlienTime(false, result);
    handleClose();
  } catch (error: any) {
    const errorText = formatZodError(error);
    errorMessage.value = errorText || '';
  }
}
function handleNow() {
  props.setAlienTime(true);
  handleClose();
}
</script>

<template>
  <DialogOver :show="props.show" :handle-close="handleClose">
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
  </DialogOver>
</template>
