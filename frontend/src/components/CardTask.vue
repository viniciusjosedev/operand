<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  task: Object,
  moveTask: Function,
  editTask: Function,
  deleteTask: Function,
  status: String,
});

const moveName = computed(() => {
  if (props.status === 'pending') return {
    movOne: 'in progress',
    movTwo: 'done',
  }

  if (props.status === 'inProgress') return {
    movOne: 'pending',
    movTwo: 'done',
  }

  return {
    movOne: 'pending',
    movTwo: 'in progress',
  }
});
</script>

<template>
  <div class="bg-gray-800 p-4 mb-2 rounded-md">
    <p class="text-white">{{ task.title }}</p>
    <p class="text-gray-400">{{ task.description }}</p>
    <div class="flex flex-col mt-2">
      <button @click="moveTask(task.id, moveName.value.movOne)" class="text-blue-400">{{ `Mover para ${moveName.value.movOne}` }}</button>
      <button @click="moveTask(task.id, moveName.value.movTwo)" class="text-orange-400">{{ `Mover para ${moveName.value.movTwo}` }}</button>
      <button @click="editTask(task)" class="text-yellow-400">Editar</button>
      <button @click="deleteTask(task.id)" class="text-red-400">Excluir</button>
    </div>
  </div>
</template>
