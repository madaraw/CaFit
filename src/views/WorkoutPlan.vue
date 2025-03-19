<template>
    <div class="space-y-3 px-1 md:px-12 lg:px-20">
        <div class="flex flex-col px-2 mt-2">
            <div class="flex justify-center mb-2">
                <h1 class="text-surface-0 font-bold text-4xl leading-tight">Workout Plan</h1>
            </div>
            <p><span class="font-semibold">Name:</span> {{ workoutPlan.name }}</p>
            <p><span class="font-semibold">Intensity:</span> {{ workoutPlan.intensity.name }}.</p>
            <p><span class="font-semibold">Duration of the workout:</span> {{ workoutPlan.duration }} minutes.</p>
            <p><span class="font-semibold">frequency:</span> {{ workoutPlan.frequency }} per week.</p>
        </div>
        <div>
            <DataTable class="px-1 pb-4" :value="exercisePlan" rowGroupMode="subheader" groupRowsBy="primaryMuscle"
                sortMode="single" sortField="primaryMuscle" :sortOrder="1" size="small" editMode="cell"
                @cell-edit-complete="cellEdited">
                <Column field="primaryMuscle"></Column>
                <Column header="Name">
                    <template #body="slotProps">
                        <span class="text-sm">{{ slotProps.data.name }}</span>
                    </template>
                </Column>
                <Column header="Sets">
                    <template #body>
                        <span class="text-sm">{{ sets }}</span>
                    </template>
                </Column>
                <Column header="Reps">
                    <template #body>
                        <span class="text-sm">{{ reps }}</span>
                    </template>
                </Column>
                <Column field="weight" header="Weight">
                    <template #body="slotProps">
                        <p>{{ slotProps.data.weight }} kg </p>
                    </template>
                    <template #editor="slotProps">
                        <InputNumber fluid v-model="slotProps.data.weight" />
                    </template>
                </Column>
                <Column>
                    <template #body="slotProps">
                        <div class="flex justify-center">
                            <Button icon="pi pi-eye" @click="showExercise(slotProps)" />
                            <Dialog modal :header="slotProps.data.name"
                                v-model:visible="dialogVisibility[slotProps.data.id]" class="m-2">
                                <div>
                                    <img :src="'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + slotProps.data.images[loopImg]"
                                        :alt="slotProps.data.name" class="w-full" />
                                </div>
                            </Dialog>
                        </div>
                    </template>
                </Column>
                <template #groupheader="slotProps">
                    <div class="py-1">
                        <span class="font-semibold">{{ slotProps.data.primaryMuscle.charAt(0).toUpperCase() +
                            slotProps.data.primaryMuscle.slice(1) }}</span>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
    import { computed, onBeforeMount, ref } from 'vue';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import Dialog from 'primevue/dialog';
    import { useRoute } from 'vue-router';


    const workoutPlan = ref(null)
    const exercisePlan = ref(null)
    const dialogVisibility = ref({})
    const route = useRoute()
    const sets = computed(() => {
        return workoutPlan.value.frequency >= 3 ? '1 - 2' : workoutPlan.value.frequency > 1 ? '2' : '3'
    })
    const reps = computed(() => {
        return workoutPlan.value.intensity.name === 'low' ? '8 - 12' : workoutPlan.value.intensity.name === 'medium' ? '6 - 8' : '4 - 6'
    })
    const loopImg = ref(0)
    let exercisesTable = []
    const cellEdited = (event) => {
        let { field, data, newValue } = event
        data[field] = newValue
        exercisesTable[exercisesTable.findIndex(ex => ex.id == route.params.id)].exercisePlan = exercisePlan.value
        localStorage.setItem('exercisesTable', JSON.stringify(exercisesTable))
    }
    const showExercise = (slotProps) => {
        dialogVisibility.value[slotProps.data.id] = true
    }

    onBeforeMount(() => {
        try {
            exercisesTable = JSON.parse(localStorage.getItem('exercisesTable'))
            exercisePlan.value = exercisesTable.find(ex => ex.id == route.params.id).exercisePlan
        } catch (error) {
            console.log(error)
            return
        }
        try {
            workoutPlan.value = JSON.parse(localStorage.getItem('workoutsTable')).find(ex => ex.id == route.params.id)
        } catch (error) {
            console.log(error)
            return
        }
        Object.values(exercisePlan.value).forEach(ex => {
            dialogVisibility.value[ex.id] = false
        })
        setInterval(() => {
            if (loopImg.value == 0) {
                loopImg.value++
            } else {
                loopImg.value = 0
            }
        }, 1000);
    })
</script>
