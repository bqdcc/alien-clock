<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import DialogOver from './DialogOver.vue';
import { formatZodError, padTo2Digits } from '@/utils';
import AddIcon from '@/assets/AddIcon.vue';
import { z } from 'zod';
import { alienBaseHour, alienBaseMinute } from '@/utils/time';
import { useToast } from 'vue-toastification';

const ringtone = new Audio('/clock/alarm_special.mp3');
ringtone.loop = true;

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  haveAlarm: {
    type: Boolean,
    default: false,
  },
  currentAlienTime: {
    type: Object,
  },
});
const emites = defineEmits(['update:show', 'update:havaAlarm']);

function handleClose() {
  emites('update:show', false);
}

type Alarm = {
  hour: number;
  minute: number;
};

const alarms = ref<Alarm[]>([]);

function formatAlarm({ hour, minute }: Alarm) {
  return `${padTo2Digits(hour)}:${padTo2Digits(minute)}`;
}

function deleteAlarm(index: number) {
  alarms.value = alarms.value.filter((_, i) => index !== i);
}

const toast = useToast();

const addShow = ref(false);
function toggleAddShow() {
  if (!addShow.value && alarms.value.length >= 2) {
    toast.info('maximum of two alarms');
    return;
  }
  addShow.value = !addShow.value;
  errorMessage.value = '';
  newAlarm.value = { ...initNewAlarm };
}

const newAlarmScheam = z.object({
  hour: z
    .number()
    .gte(0, 'hour minimum is 0')
    .lte(alienBaseHour, `hour maximum is ${alienBaseHour}`)
    .default(0),
  minute: z
    .number()
    .gte(0, 'minute minimum is 0')
    .lte(alienBaseMinute, `minute maximum is ${alienBaseMinute}`)
    .default(0),
});

const initNewAlarm = { hour: null, minute: null };

const newAlarm = ref({
  ...initNewAlarm,
});
const errorMessage = ref('');
function addAlarm() {
  try {
    const result = newAlarmScheam.parse(newAlarm.value);
    toggleAddShow();
    alarms.value = [...alarms.value, { ...result }];
  } catch (error: any) {
    const errorText = formatZodError(error);
    errorMessage.value = errorText || '';
  }
}

watch(
  () => props.show,
  (newShow) => {
    if (!newShow) {
      errorMessage.value = '';
      addShow.value = false;
    }
  },
);

watch(alarms, (newAlarms) => {
  if (newAlarms) {
    localStorage.setItem('alarms', JSON.stringify(alarms.value));
    emites('update:havaAlarm', !!newAlarms.length);
  }
});

onMounted(() => {
  try {
    const localAlarmsJson = localStorage.getItem('alarms');
    if (localAlarmsJson) {
      const localAlarms = JSON.parse(localAlarmsJson);
      alarms.value = [...localAlarms];
    } else {
      alarms.value = [];
    }
  } catch (error) {
    console.error(error);
  }
});

// ringtong play once
watch(
  () => props.currentAlienTime,
  (alienTime) => {
    if (alarms.value.length > 0 && !!alienTime) {
      const needAlarm = alarms.value.find((alarm, index) => {
        const isEq = alarm.hour === alienTime.hours && alarm.minute === alienTime.minutes;
        if (isEq) {
          alarms.value = alarms.value.filter((_, i) => index !== i);
          return true;
        }
        return false;
      });
      if (needAlarm) {
        toast.warning('The alarm goes off.', {
          timeout: 60000, // alarm 1 minute
          closeOnClick: false,
          pauseOnHover: false,
          onClose: () => {
            ringtone.currentTime = 0;
            ringtone.pause();
          },
        });
        ringtone.play();
      }
    }
  },
);
</script>

<template>
  <DialogOver class="top-[10%]" :show="props.show" :handle-close="handleClose">
    <div class="flex w-[600px] flex-col px-10">
      <div v-if="!alarms.length" class="text-center text-[2.25rem] font-medium">No alarms</div>

      <div
        class="flex w-full justify-between border-b-[1px] border-solid border-textCL"
        v-for="(alarm, index) in alarms"
        :key="index"
      >
        <div>
          <p class="text-[1.5rem] font-medium leading-[2rem] text-blackC">
            {{ formatAlarm(alarm) }}
          </p>
          <p class="text-[.75rem] leading-[1.25rem] text-slate-500">Only ring once</p>
        </div>
        <button
          class="text-redC transition-all hover:font-semibold"
          @click="
            () => {
              deleteAlarm(index);
            }
          "
        >
          DELETE
        </button>
      </div>

      <div v-if="addShow" class="mt-[40px] w-full">
        <div class="flex items-center justify-between border-b-[1px] border-solid border-textCL">
          <div>
            <p class="flex border text-[1.5rem] font-medium leading-[2rem] text-blackC">
              <input
                type="number"
                class="w-[80px] text-right"
                v-model="newAlarm.hour"
                placeholder="0"
              />:<input type="number" class="w-[80px]" v-model="newAlarm.minute" placeholder="0" />
            </p>
            <p class="text-[.75rem] leading-[1.25rem] text-slate-500">Only ring once</p>
          </div>
          <div class="flex gap-4">
            <button class="text-blue-700 transition-all hover:font-semibold" @click="addAlarm">
              Set
            </button>
            <button
              class="text-green-700 transition-all hover:font-semibold"
              @click="toggleAddShow"
            >
              Cancel
            </button>
          </div>
        </div>

        <div class="min-h-[40px] text-redC">
          {{ errorMessage }}
        </div>
      </div>

      <div v-if="!addShow" class="mt-[50px] flex items-center justify-center">
        <div
          @click="toggleAddShow"
          class="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full shadow transition-shadow hover:shadow-md"
        >
          <AddIcon class="h-[25px] w-[25px]" />
        </div>
      </div>
    </div>
  </DialogOver>
</template>
