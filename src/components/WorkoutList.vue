<template>
    <Listbox class="w-full" v-model="selectedExercises" multiple :options="workouts"
        :scrollHeight="device === 0 ? '14rem' : device === 1 ? '40rem' : '50rem'" :pt="{
            option: {
                style: device > 1 ? 'display: block;' : ''
            }
        }">
        <template #option="slotProps">
            <div class="space-y-2 flex flex-col justify-center items-start">
                <div class="lg:text-lg">{{ slotProps.option.name }}</div>
                <div class="lg:self-center lg:justify-self-center" v-if="slotProps.selected">
                    <img :src="'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + slotProps.option.images[loopImg]"
                        :alt="slotProps.option.name">
                </div>
            </div>
        </template>
    </Listbox>
    <p :class="selectedExercises.length > maxExercises ? 'text-red-400' : ''" class="mt-2">
        Selected exercises: {{ selectedExercises.length }} /
        {{ maxExercises }}</p>
</template>

<script setup>
    import { Listbox } from 'primevue';
    import { onBeforeMount, ref, watch } from 'vue';

    const props = defineProps(['workouts', 'maxExercises', 'index', 'listName'])
    const emit = defineEmits(['exceed-max-exercises'])
    const selectedExercises = ref([])
    const loopImg = ref(0)
    // device 0 => mobile, 1 => tablet, 2 => desktop
    let device = screen.width <= 640 ? 0 : screen.width <= 1024 ? 1 : 2

    watch(selectedExercises, (newValue) => {
        if (newValue.length > props.maxExercises) {
            emit('exceed-max-exercises', props.index)
        }
        else {
            emit('exceed-max-exercises', null)
        }
    })
    onBeforeMount(() => {
        setInterval(() => {
            if (loopImg.value == 0) {
                loopImg.value++
            } else {
                loopImg.value = 0
            }
        }, 1000);
    })

    defineExpose({ selectedExercises, listName: props.listName })
</script>
