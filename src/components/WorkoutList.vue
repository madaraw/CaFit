<template>
    <Listbox v-model="selectedExercises" multiple :options="workouts">
        <template #option="slotProps">
            <div class="space-y-2">
                <div>{{ slotProps.option.name }}</div>
                <div v-if="slotProps.selected">
                    <img :src="'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + slotProps.option.images[0]"
                        alt="">
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
    import { ref, watch } from 'vue';

    const props = defineProps(['workouts', 'maxExercises', 'index', 'listName'])
    const emit = defineEmits(['exceed-max-exercises'])
    const selectedExercises = ref([])
    watch(selectedExercises, (newValue) => {
        if (newValue.length > props.maxExercises) {
            emit('exceed-max-exercises', props.index)
        }
        else {
            emit('exceed-max-exercises', null)
        }
    })

    defineExpose({ selectedExercises, listName: props.listName })
</script>
