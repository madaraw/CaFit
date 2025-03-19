<template>
  <div class="bg-surface-950 flex items-center min-h-screen px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-100 text-center flex flex-col items-center gap-4">

      <div class="text-primary font-bold text-lg leading-tight flex justify-center items-center gap-1"><i
          class="pi pi-discord !text-lg !leading-none" />
        <p>POWERED BY MADARAW</p>
      </div>
      <div class="text-surface-0 font-bold text-4xl leading-tight">Your Fitness Journey Starts Here.</div>
      <div class="text-surface-100 text-xl leading-normal">Build a personalized workout plan tailored to your goals and
        preferences.</div>
      <div class="flex justify-center items-center gap-4 mt-4">
        <Button @click="createWorkout" label="Create Workout" rounded />
        <Button @click="browseWorkouts" label="Browse Workouts" rounded outlined />
      </div>
    </div>
  </div>
</template>
<script setup>
  import Button from 'primevue/button';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const createWorkout = () => {
    router.push({ name: 'workout-setup' })
  }
  const browseWorkouts = () => {
    router.push({ name: 'workout-list' })
  }
</script>
