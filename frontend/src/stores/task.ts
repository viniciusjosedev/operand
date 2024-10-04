import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'done' | 'in progress';
  createdAt: string;
};


export const useTaskStore = defineStore('task', () => {
	const tasks = ref<{
		pending: Task[],
		done: Task[],
		inProgress: Task[],
	}>({
		pending: [],
		done: [],
		inProgress: [],
	});
	const hasMore = ref({
		pending: true,
		done: true,
		inProgress: true,
	});

	const parseStatusToRequest = (status: 'pending' | 'done' | 'inProgress') => {
		if (status === 'inProgress') return 'in progress';
		return status;
	};

	const fetchTask = async (pageNumber: string, status: 'pending' | 'done' | 'inProgress') => {		
		const { data } = await api.get<{tasks: Task[], hasMore: boolean}>('/task', {
			params: {
				pageNumber,
				status: parseStatusToRequest(status),
			}
		});		
		
		if (pageNumber === '1')	tasks.value[status] = data.tasks;
		else tasks.value[status] = [...tasks.value[status], ...data.tasks];
		hasMore.value[status] = data.hasMore;
	}

	const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
			await api.post('/task/create', task);
			await fetchTask('1', 'pending');
	}

	const updateTask = async (id: string, task: Omit<Task, 'id' | 'createdAt'>) => {
		await api.put(`/task/update/${id}`, task)
		await fetchTask('1', task.status === 'in progress' ? 'inProgress' : task.status)
	}

	const updateTaskStatus = async (task: Task, newStatus: 'pending' | 'done' | 'in progress') => {
		await api.put(`/task/update/${task.id}`, {
			...task,
			status: newStatus
		});

		await fetchTask('1', task.status === 'in progress' ? 'inProgress' : task.status)
		await fetchTask('1', newStatus === 'in progress' ? 'inProgress' : newStatus)
	}

	const deleteTask = async (task: Task) => {
		await api.delete(`/task/delete/${task.id}`);

		await fetchTask('1', task.status === 'in progress' ? 'inProgress' : task.status)
	}

  return { fetchTask, tasks, hasMore, createTask, updateTask, updateTaskStatus, deleteTask }
})


