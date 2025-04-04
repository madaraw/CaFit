<template>
    <div class=" px-1 md:px-12 lg:px-20">
        <div class="space-y-3" v-if="exercisePlan">
            <div class="flex flex-col px-2 mt-2">
                <div class="flex justify-center mb-2">
                    <h1 class="text-surface-0 font-bold text-4xl leading-tight">Workout Plan</h1>
                </div>
                <div class="text-base lg:text-lg">
                    <p><span class="font-semibold">Name:</span> {{ workoutPlan.name }}</p>
                    <p><span class="font-semibold">Intensity:</span> {{ workoutPlan.intensity.name }}.</p>
                    <p><span class="font-semibold">Duration of the workout:</span> {{ workoutPlan.duration }} minutes.
                    </p>
                    <p><span class="font-semibold">frequency:</span> {{ workoutPlan.frequency }} per week.</p>
                </div>
            </div>
            <DataTable class="py-4" :value="exercisePlan" rowGroupMode="subheader" groupRowsBy="primaryMuscle"
                sortMode="single" sortField="primaryMuscle" :sortOrder="1"
                :size="device === 0 ? 'small' : device === 1 ? 'normal' : 'large'" editMode="cell"
                @cell-edit-complete="cellEdited">
                <Column field="primaryMuscle"></Column>
                <Column header="Name">
                    <template #body="slotProps">
                        <span class="text-sm lg:text-base xl:text-lg">{{ slotProps.data.name }}</span>
                    </template>
                </Column>
                <Column header="Sets">
                    <template #body>
                        <span class="text-sm lg:text-base xl:text-lg">{{ sets }}</span>
                    </template>
                </Column>
                <Column header="Reps">
                    <template #body>
                        <span class="text-sm lg:text-base xl:text-lg">{{ reps }}</span>
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
        <div class="py-4 px-2 space-y-1 lg:space-y-3" v-else>
            <h1 class="text-surface-0 font-bold text-4xl text-center leading-tight">Workout Plan</h1>
            <p class="text-surface-100 text-xl leading-normal">No workouts found with this ID. Please create one using
                the
                button below.</p>
            <div class="flex justify-center my-4">
                <Button label="Create Workout" @click="$router.push('/workout-setup')" rounded />
            </div>
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
    let device = screen.width <= 640 ? 0 : screen.width <= 1024 ? 1 : 2
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
