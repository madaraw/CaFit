<template>
  <div class="flex flex-col gap-6 lg:flex-row justify-center items-center px-6 py-20 md:px-12 lg:px-20">
    <div class="order-last lg:order-first text-surface-100 text-center flex flex-col items-center gap-4">

      <div class="text-primary font-bold text-lg leading-tight flex justify-center items-center gap-1">
        <i class="pi pi-github !text-lg !leading-none" />
        <a href="https://github.com/Madaraw" target="_blank">
          <p>POWERED BY MADARAW</p>
        </a>
      </div>
      <div class="text-surface-0 font-bold text-4xl leading-tight">Your Fitness Journey Starts Here.</div>
      <div class="text-surface-100 text-xl leading-normal">Build a personalized workout plan tailored to your goals and
        preferences.</div>
      <div class="flex justify-center items-center gap-4 mt-4">
        <Button @click="createWorkout" label="Create Workout" rounded />
        <Button @click="browseWorkouts" label="Browse Workouts" rounded outlined />
      </div>
    </div>
    <div v-if="!isMobile" class="w-1/2 lg:w-2/3 xl:w-1/2">
      <img src="https://www.pngplay.com/wp-content/uploads/8/Gym-Workout-Transparent-File.png" alt="Fitness" />
    </div>
  </div>
</template>
<script setup>
  import Button from 'primevue/button';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const isMobile = ref(screen.width <= 640)

  const handleResize = () => {
    isMobile.value = screen.width <= 640;
  }
  const createWorkout = () => {
    router.push({ name: 'workout-setup' })
  }
  const browseWorkouts = () => {
    router.push({ name: 'workout-list' })
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  })
</script>
