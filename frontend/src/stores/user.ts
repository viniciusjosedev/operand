import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import {useRouter} from 'vue-router'

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'done' | 'in progress';
  createdAt: string;
};


export const useUserStore = defineStore('user', () => {
	const router = useRouter();

  const user = ref({
		email: '',
	});

	const tasks = ref<Task[]>([]);
	const hasMore = ref(true);

	const isAuthenticatedChecked = ref(false);

  const fetchUser = async () => {
		const { data } = await api.get<{ email: string }>('/user/me');
		user.value = data;
		isAuthenticatedChecked.value = true;
  };

	const logout = async () => {
		try {
			await api.post('/user/logout');
		} catch (error) {
			console.error(error);
		} finally {
			user.value = { email: '' };
			router.push('/');
		}
	};

	const fetchTask = async (pageNumber: string) => {
		console.log({pageNumber});
		
		const { data } = await api.get<{tasks: Task[], hasMore: boolean}>('/task', {
			params: {
				pageNumber,
			}
		});
		
		if (pageNumber === '1')	tasks.value = data.tasks;
		else tasks.value = [...tasks.value, ...data.tasks];
		hasMore.value = data.hasMore;
	}

  return { user, fetchUser, isAuthenticatedChecked, logout, fetchTask, tasks, hasMore }
})


