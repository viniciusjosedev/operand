<script setup>
import { onMounted, computed, ref } from 'vue';
import Header from '@/components/Header.vue';
import { useTaskStore } from '@/stores/task';
import { useToast } from 'primevue/usetoast';

const taskStore = useTaskStore();
const loading = ref(false);
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const editingTask = ref({});

const toast = useToast();

const tasksByStatus = computed(() => {
  return {
    pending: taskStore.tasks.pending,
    inProgress: taskStore.tasks.inProgress,
    done: taskStore.tasks.done,
  };
});

const loadMoreTasks = async (status) => {
  if (loading.value || !taskStore.hasMore[status]) return;
  loading.value = true;
  const pageNumber = Math.ceil(taskStore.tasks[status].length / 40) + 1;
  await taskStore.fetchTask(pageNumber.toString(), status);
  loading.value = false;
};

const handleScroll = async (event, status) => {
  const el = event.target;
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
    await loadMoreTasks(status);
  }
};

const moveTask = async (task, newStatus) => {
  await taskStore.updateTaskStatus(task, newStatus);
	toast.add({severity: 'success', summary: 'Sucesso', detail: 'Task atualizada com sucesso', life: 3000});
};

const cancelEdit = () => {
	editingTask.value = {};
	newTaskTitle.value = '';
	newTaskDescription.value = '';
};

const saveTask = async () => {	
  if (newTaskTitle.value && newTaskDescription.value) {
    if (editingTask.value.id) {
      await taskStore.updateTask(editingTask.value.id, {
        title: newTaskTitle.value,
        description: newTaskDescription.value,
				status: editingTask.value.status
      });
      editingTask.value = {};
			toast.add({severity: 'success', summary: 'Sucesso', detail: 'Task atualizada com sucesso', life: 3000});
    } else {
      await taskStore.createTask({
        title: newTaskTitle.value,
        description: newTaskDescription.value,
        status: 'pending',
      });
			toast.add({severity: 'success', summary: 'Sucesso', detail: 'Task criada com sucesso', life: 3000});
    }

    newTaskTitle.value = '';
    newTaskDescription.value = '';
  }
};

const deleteTask = async (task) => {
  await taskStore.deleteTask(task);
	toast.add({severity: 'success', summary: 'Sucesso', detail: 'Task deletada com sucesso', life: 3000});
};

const editTask = (task) => {	
  newTaskTitle.value = task.title;
  newTaskDescription.value = task.description;
  editingTask.value = task;
};

onMounted(async () => {
  await taskStore.fetchTask('1', 'pending');
  await taskStore.fetchTask('1', 'inProgress');
  await taskStore.fetchTask('1', 'done');
});
</script>

<template>
  <main class="w-full min-h-screen bg-[#111111] flex flex-col">
    <Header />

    <div class="flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold text-orange-500 p-5">Tarefas</h1>

      <div class="flex mb-4 gap-x-4">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Título da tarefa"
          class="p-2 rounded-md"
        />
        <input
          v-model="newTaskDescription"
          type="text"
          placeholder="Descrição da tarefa"
          class="p-2 rounded-md"
        />
        <button @click="saveTask" class="bg-green-500 text-white p-2 rounded-md">
          {{ editingTask.id ? 'Atualizar Tarefa' : 'Adicionar Tarefa' }}
        </button>

				<button v-if="editingTask.id" @click="cancelEdit" class="bg-red-500 text-white p-2 rounded-md">
					Cancelar
				</button>
      </div>

      <div class="flex gap-8 w-[90%] justify-center">
        <div
          class="flex flex-col w-1/3 bg-gray-900 p-4 rounded-md max-h-[500px] overflow-y-scroll"
          @scroll="event => handleScroll(event, 'pending')"
        >
          <h2 class="text-white text-xl mb-4">A Fazer</h2>
          <div v-for="task in tasksByStatus.pending" :key="task.id" class="bg-gray-800 p-4 mb-2 rounded-md">
            <p class="text-white">{{ task.title }}</p>
            <p class="text-gray-400">{{ task.description }}</p>
            <div class="flex flex-col mt-2">
              <button @click="moveTask(task, 'in progress')" class="text-blue-400">Mover para Em Progresso</button>
              <button @click="moveTask(task, 'done')" class="text-green-400">Mover para Concluído</button>
              <button @click="editTask(task)" class="text-yellow-400">Editar</button>
              <button @click="deleteTask(task)" class="text-red-400">Excluir</button>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col w-1/3 bg-gray-900 p-4 rounded-md max-h-[500px] overflow-y-scroll"
          @scroll="event => handleScroll(event, 'inProgress')"
        >
          <h2 class="text-white text-xl mb-4">Em Progresso</h2>
          <div v-for="task in tasksByStatus.inProgress" :key="task.id" class="bg-gray-800 p-4 mb-2 rounded-md">
            <p class="text-white">{{ task.title }}</p>
            <p class="text-gray-400">{{ task.description }}</p>
            <div class="flex flex-col mt-2">
              <button @click="moveTask(task, 'pending')" class="text-orange-400">Mover para A Fazer</button>
              <button @click="moveTask(task, 'done')" class="text-green-400">Mover para Concluído</button>
              <button @click="editTask(task)" class="text-yellow-400">Editar</button>
              <button @click="deleteTask(task)" class="text-red-400">Excluir</button>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col w-1/3 bg-gray-900 p-4 rounded-md max-h-[500px] overflow-y-scroll"
          @scroll="event => handleScroll(event, 'done')"
        >
          <h2 class="text-white text-xl mb-4">Concluído</h2>
          <div v-for="task in tasksByStatus.done" :key="task.id" class="bg-gray-800 p-4 mb-2 rounded-md">
            <p class="text-white">{{ task.title }}</p>
            <p class="text-gray-400">{{ task.description }}</p>
            <div class="flex flex-col mt-2">
              <button @click="moveTask(task, 'in progress')" class="text-blue-400">Mover para Em Progresso</button>
              <button @click="moveTask(task, 'pending')" class="text-orange-400">Mover para A Fazer</button>
              <button @click="editTask(task)" class="text-yellow-400">Editar</button>
              <button @click="deleteTask(task)" class="text-red-400">Excluir</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-white mt-4">Carregando mais tarefas...</div>
    </div>
  </main>
</template>
