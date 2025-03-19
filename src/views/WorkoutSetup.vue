<template>
    <div class="px-4 pt-6 md:px-12 lg:px-20">
        <div class="pb-4">
            <h1 class="text-surface-0 font-bold text-3xl leading-tight">Set up your workout</h1>
            <p class="text-surface-100">Please follow the steps below to set up your workout plan.</p>
        </div>
        <Stepper value="1" linear>
            <StepItem value="1">
                <Step>Workout setup</Step>
                <StepPanel class="py-6" v-slot="{ activateCallback }">
                    <form class="space-y-6 ms-4">
                        <div class="flex items-center justify-start gap-4">
                            <label for="intensity" class="text-surface-0 font-medium">Intensity</label>
                            <Select id="intensity" v-model="workoutOptions.intensity" :options="intensityOptions"
                                checkmark optionLabel="name" placeholder="Select an Intensity"
                                :invalid="!workoutOptions.intensity"></Select>
                        </div>
                        <div class="flex items-center justify-start gap-4">
                            <label for="frequency" class="text-surface-0 font-medium">Frequency</label>
                            <InputNumber id="frequency" v-model="workoutOptions.frequency" mode="decimal" :min="1"
                                :max="7" placeholder="Frequency"
                                :suffix="workoutOptions.frequency === 1 ? ' time per week' : ' times per week'" />
                        </div>
                        <div class="flex flex-col gap-4">
                            <label for="duration" class="text-surface-0 font-medium">Duration {{ workoutOptions.duration
                                }}
                                minutes</label>
                            <div class="flex justify-center">
                                <Slider id="duration" v-model="workoutOptions.duration" :min="30" :max="180" :step="15"
                                    class="w-3/4" />
                            </div>
                        </div>
                        <div class="space-y-1 mt-8">
                            <p class="text-red-400" v-if="selectedOptionsError">Please select an intensity, frequency,
                                and
                                duration.</p>
                            <Button label="Next" @click="goToExerciseSelection(activateCallback)" />

                        </div>
                    </form>
                </StepPanel>
            </StepItem>
            <StepItem value="2">
                <Step>Exercise selection</Step>
                <StepPanel v-if="exercisesByCategory" class="p-4" v-slot="{ activateCallback }">
                    <Tabs v-model:value="selectedTab" scrollable>
                        <TabList>
                            <Tab v-for="(exerciseCategory, index) in Object.keys(exercisesByCategory)" :key="index"
                                :value="index" :disabled="disableTabs && currentExerciseCategory !== index">
                                {{ exerciseCategory.charAt(0).toUpperCase() + exerciseCategory.slice(1) }}

                            </Tab>
                        </TabList>
                        <TabPanels>
                            <p class="mb-3">Choose a maximum of {{ `${workoutPlan.numberExercisesPerBodyPart}
                                ${workoutPlan.numberExercisesPerBodyPart === 1 ? 'exercise' : 'exercises'}` }} per body
                                part
                                please</p>
                            <TabPanel v-for="(exerciseCategory, index) in Object.keys(exercisesByCategory)" :key="index"
                                :value="index">
                                <WorkoutList v-if="exercisesByCategory[exerciseCategory]"
                                    :workouts="exercisesByCategory[exerciseCategory]"
                                    :max-exercises="workoutPlan.numberExercisesPerBodyPart" :index="index"
                                    :list-name="exerciseCategory" @exceed-max-exercises="blockUserMaxExercises"
                                    ref="workoutList" />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <p class="text-red-400 mb-2" v-if="selectedExercisesErrorMessage">{{ selectedExercisesErrorMessage
                        }}</p>
                    <Button label="back" class="!mr-2" @click="activateCallback('1')" />
                    <Button label="Next" class="!mr-2" @click="getExercisePlan(activateCallback)" />
                    <Button label="randomize" outlined @click="randomExercises(activateCallback)" />
                </StepPanel>
            </StepItem>
            <StepItem value="3">
                <Step>Review</Step>
                <StepPanel class="py-6" v-slot="{ activateCallback }">
                    <div class="space-y-6">
                        <p class="font-bold">Review your workout plan</p>
                        <div class="space-y-2">
                            <p>Intensity: {{ workoutOptions.intensity.name }}</p>
                            <p>Frequency: {{ `${workoutOptions.frequency} ${workoutOptions.frequency === 1 ?
                                ' time per week' : ' times per week'}` }}</p>
                            <p>Duration: {{ workoutOptions.duration }} minutes</p>
                        </div>
                        <div class="space-y-2">
                            <p class="font-bold">Exercises:</p>
                            <p class="flex gap-2" v-for="(muscle, index) in Object.keys(exercisePlanShow)" :key="index">
                                <span class="font-semibold "> {{ muscle.charAt(0).toUpperCase() +
                                    muscle.slice(1)
                                    }}:</span>
                                {{exercisePlanShow[muscle].map(exercise =>
                                    exercise.name).join(', ')}}
                            </p>
                        </div>
                        <div class="space-y-2">
                            <p class="font-semibold">Please give a name to your workout:</p>
                            <InputText ref="workoutName" v-model="workoutOptions.name" placeholder="Workout name" />
                        </div>
                    </div>
                    <p class="text-red-400 mt-4" v-if="finishWorkoutPlanningError">{{ finishWorkoutPlanningError }}
                    </p>
                    <ConfirmDialog></ConfirmDialog>
                    <Button label="Back" class="!mr-2" @click="activateCallback('2')" />
                    <Button label="Finish" class="!mt-2" @click="makeWorkutPlan" />
                </StepPanel>
            </StepItem>
        </Stepper>

    </div>
</template>

<script setup>
    import Select from 'primevue/select';
    import Slider from 'primevue/slider';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import Stepper from 'primevue/stepper';
    import StepItem from 'primevue/stepitem';
    import Step from 'primevue/step';
    import StepPanel from 'primevue/steppanel';
    import Tabs from 'primevue/tabs';
    import TabList from 'primevue/tablist';
    import Tab from 'primevue/tab';
    import TabPanels from 'primevue/tabpanels';
    import TabPanel from 'primevue/tabpanel';
    import ConfirmDialog from 'primevue/confirmdialog';
    import { useConfirm } from "primevue/useconfirm";
    import { nextTick, onBeforeMount, ref, useTemplateRef } from 'vue';
    import WorkoutList from '../components/WorkoutList.vue';
    import exercises from '../data/exercises.json';
    import { useRouter } from 'vue-router';



    const intensityOptions = [
        { name: 'Low', code: 'low' },
        { name: 'Medium', code: 'medium' },
        { name: 'High', code: 'high' },
    ];
    const categories = {
        allCategories: ['chest', 'biceps', 'quadriceps', 'shoulders', 'triceps', 'abdominals', 'calves', 'hamstrings', 'glutes'],
        backCategory: ['lats', 'middle back', 'lower back'],
    }
    const workoutOptions = ref({
        intensity: "",
        frequency: 1,
        duration: 30,
        name: ''
    })
    const selectedOptionsError = ref(false);
    const selectedTab = ref(0);
    const disableTabs = ref(false);
    const currentExerciseCategory = ref(0);
    const workoutList = useTemplateRef('workoutList')
    const selectedExercisesErrorMessage = ref('')
    const exercisePlan = ref({})
    const exercisePlanShow = ref({})
    const finishWorkoutPlanningError = ref(null)
    const router = useRouter()
    const endConfirmDialog = useConfirm();
    const workoutName = ref()
    let workoutPlan = {}
    let workoutsTable = []
    let exercisesTable = []

    const createId = () => {
        return Math.random().toString(36).substr(2, 9);
    }
    const makeWorkutPlan = () => {
        finishWorkoutPlanningError.value = null
        if (!workoutOptions.value.name) {
            finishWorkoutPlanningError.value = 'Please give a name to your workout'
            return
        }
        if (!workoutsTable.find(workout => workout.name === workoutOptions.value.name)) {
            pushToWorkoutTable()
        } else {
            endConfirmDialog.require({
                message: 'A workout with this name already exists. Do you want to overwrite it?',
                header: 'Overwrite workout?',
                acceptProps: {
                    label: 'Overwrite',
                    severity: 'danger'
                },
                rejectProps: {
                    label: 'Cancel',
                    severity: 'secondary'
                },
                accept: () => {
                    pushToWorkoutTable(true)
                },
                reject: () => {
                    workoutOptions.value.name = ''
                    nextTick(() => {
                        workoutName.value.$el.focus()
                    })
                }

            })
        }
    }

    const pushToWorkoutTable = (replace = false) => {
        let workoutId = replace ? workoutsTable.find(workout => workout.name === workoutOptions.value.name).id : createId()

        if (workoutsTable.length && !replace) {
            while (workoutsTable.find(workout => workout.id === workoutId)) {
                workoutId = createId()
            }
        }
        let workoutEntry = {
            id: workoutId,
            ...workoutOptions.value
        }
        if (replace) {
            workoutsTable = workoutsTable.filter(workout => workout.id !== workoutId)
            exercisesTable = exercisesTable.filter(exercise => exercise.id !== workoutId)
        }
        workoutsTable.push(workoutEntry)
        exercisesTable.push({ id: workoutId, exercisePlan: exercisePlan.value })

        localStorage.setItem('exercisesTable', JSON.stringify(exercisesTable))
        localStorage.setItem('workoutsTable', JSON.stringify(workoutsTable))
        router.push('/workout-plan/' + workoutId)
    }

    const generateExercisePlanShow = (basicExercisePlan) => {

        exercisePlanShow.value = basicExercisePlan.reduce((acc, exercise) => {
            const { primaryMuscle } = exercise
            if (!acc[primaryMuscle]) {
                acc[primaryMuscle] = []
            }
            acc[primaryMuscle].push(exercise)
            return acc
        }, {})
    }

    const randomExercises = (callback) => {
        const valid = []
        workoutList.value.forEach(list => {
            const randomExercises = []
            const noRepeat = []
            for (let i = 0; i < workoutPlan.numberExercisesPerBodyPart; i++) {
                // generate random number from 0 to length of exercises in the list
                const randomExerciseId = Math.floor(Math.random() * (exercisesByCategory.value[list.listName].length))
                if (noRepeat.includes(randomExerciseId)) {
                    i--
                    continue
                }
                noRepeat.push(randomExerciseId)
                randomExercises.push(exercisesByCategory.value[list.listName][randomExerciseId])
            }
            valid.push(...randomExercises)
        })
        exercisePlan.value = valid
        generateExercisePlanShow(valid)
        selectedExercisesErrorMessage.value = "";
        callback('3');
    }

    const getExercisePlan = (callback) => {
        let valid = [], invalid = [];
        selectedExercisesErrorMessage.value = "";
        workoutList.value.forEach(list => {
            if (list.selectedExercises.length == workoutPlan.numberExercisesPerBodyPart) {
                valid.push(...list.selectedExercises)
            }
            else {
                invalid.push(list.listName)
            }

        })
        if (invalid.length) {
            if (invalid.length > 3)
                selectedExercisesErrorMessage.value = 'Please select the correct number of exercises for each muscle group'
            else
                selectedExercisesErrorMessage.value = `Please select the correct number of exercises for the following muscle groups: ${invalid.join(', ')}`
            return
        }
        exercisePlan.value = valid
        generateExercisePlanShow(valid)
        callback('3');
    }
    const blockUserMaxExercises = (index) => {
        if (index == null) {
            disableTabs.value = false;
            return
        }
        disableTabs.value = true;
        currentExerciseCategory.value = index;
    }

    const goToExerciseSelection = (goNextFunction) => {
        if (!workoutOptions.value.intensity)
            return selectedOptionsError.value = true;
        selectedOptionsError.value = false;
        workoutPlan = lawsOfExercise();
        goNextFunction('2');
    }

    // make a function that will take intensity frequency and duration in min and make a workout plan (upper lower/ full body/ full body EOD/ etc)
    const lawsOfExercise = () => {
        const { intensity, frequency, duration } = workoutOptions.value;
        let workoutPlan = {};
        // based off duration you can choose more or less exercises
        let numberExercisesPerBodyPart = 0;
        // based off intensity you can get more or less reps/sets
        let totalSetPerBodyPart = 0;
        // based off frequency you can get the type of workout
        let workoutType = '';
        // based off all of these you can get the type of workout plan

        if (duration <= 45) {
            numberExercisesPerBodyPart = 1;
        } else if (duration <= 90) {
            numberExercisesPerBodyPart = 2;
        } else {
            numberExercisesPerBodyPart = 3;
        }

        if (intensity === 'low') {
            totalSetPerBodyPart = 3;
        } else if (intensity === 'medium') {
            totalSetPerBodyPart = 5;
        } else if (intensity === 'high') {
            totalSetPerBodyPart = 8;
        }

        if (frequency <= 3) {
            workoutType = ['full body'];
        } else {
            workoutType = ['upper lower', 'full body EOD'];
        }

        return workoutPlan = {
            numberExercisesPerBodyPart,
            totalSetPerBodyPart,
            workoutType
        };
    }

    const exercisesByCategory = ref(exercises.reduce((acc, exercise) => {
        const { primaryMuscles } = exercise;

        // Iterate over each muscle in the primaryMuscles array
        primaryMuscles.forEach((muscle) => {

            if (!categories.backCategory.includes(muscle) && !categories.allCategories.includes(muscle)) {
                return
            }

            if (categories.backCategory.includes(muscle)) {
                muscle = "back"
            }

            // If the muscle group doesn't exist in the accumulator, initialize it
            if (!acc[muscle]) {
                acc[muscle] = [];
            }

            // Add the exercise to the corresponding muscle group
            acc[muscle].push(exercise);
        });

        return acc;
    }, {}))

    onBeforeMount(() => {
        let workoutTable = JSON.parse(localStorage.getItem('workoutsTable'))
        if (workoutTable?.length)
            workoutsTable = workoutTable
        let exerciseTable = JSON.parse(localStorage.getItem('exercisesTable'))
        if (exerciseTable?.length)
            exercisesTable = exerciseTable
    })
</script>

<style>
    .p-stepitem .p-steppanel-content {
        margin-inline-start: 0 !important;
    }

    .p-stepper-separator {
        display: none !important;
        margin-left: 0 !important;
    }
</style>