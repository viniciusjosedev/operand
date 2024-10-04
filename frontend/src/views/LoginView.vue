<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index'
import { useUserStore } from '@/stores/user';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const form = ref({
	email: '',
	password: ''
})

const formForgot = ref({
	email: ''
})

const tab = ref<'signin' | 'signup' | 'forgot'>('signin')
const styleButton = ref("p-2 m-2 text-white rounded-md w-80")

const submit = async () => {
	const data = {
		email: form.value.email.trim(),
		password: form.value.password.trim(),
	};

	if (tab.value === 'signin') {
		await api.post('/auth/signin', data);

		await userStore.fetchUser();
		toast.add({severity:'success', summary:'Sucesso', detail:'Login efetuado com sucesso', life: 3000});
		router.push('/tasks');
	} else if (tab.value === 'signup') {
		await api.post('/auth/signup', data);
		toast.add({severity:'success', summary:'Sucesso', detail:'Cadastro efetuado com sucesso', life: 3000});
		tab.value = 'signin';
		form.value.email = '';
		form.value.password = '';
	} else {
		await userStore.forgot(formForgot.value.email);
		toast.add({severity:'success', summary:'Sucesso', detail:'Email enviado com sucesso', life: 3000});
		tab.value = 'signin';
		formForgot.value.email = '';
	}
}

</script>

<template>
  <main class="w-full min-h-screen bg-[#111111] flex flex-col items-center justify-center">
		<h1 class="text-7xl font-bold text-orange-500 mb-5">Operand</h1>

		<div
			v-if="tab === 'signin'"
			class="flex flex-col"
		>
			<div class="flex flex-col gap-2">
				<input type="text" v-model="form.email" placeholder="Email" class="p-2 m-2 border border-gray-300 rounded-md w-80" />
				<input type="password" v-model="form.password" placeholder="Senha" class="p-2 m-2 border border-gray-300 rounded-md w-80" />
			</div>

			<button 
				@click="submit" 
				:disabled="!form.email || !form.password" 
				:class="!form.email || !form.password ? `${styleButton} bg-gray-500` : `${styleButton}	 bg-green-500`"
			>
				Entrar
			</button>

			<div
				class="flex items-center justify-between"
			>
				<p
					class="text-blue-500 ml-2 text-sm cursor-pointer" 
					@click="tab = 'forgot'"
				>
					Esqueceu a senha?
				</p>

				<p
					@click="tab = 'signup'" 
					class="text-blue-500 mr-2 text-sm cursor-pointer"
				>
					Criar conta		
				</p>
			</div>
		</div>

		<div
			v-else-if="tab === 'signup'"
			class="flex flex-col"
		>
			<div class="flex flex-col gap-2">
				<input type="text" v-model="form.email" placeholder="Email" class="p-2 m-2 border border-gray-300 rounded-md w-80" />
				<input type="password" v-model="form.password" placeholder="Senha" class="p-2 m-2 border border-gray-300 rounded-md w-80" />
			</div>

			<button 
				@click="submit" 
				:disabled="!form.email || !form.password" 
				:class="!form.email || !form.password ? `${styleButton} bg-gray-500` : `${styleButton} bg-green-500`"
			>
				Cadastrar
			</button>
		
			<div
				class="flex items-center justify-between"
			>
				<p
					@click="tab = 'signin'" 
					class="text-blue-500 ml-2 text-sm cursor-pointer"
				>
					Já tem uma conta? Entrar
				</p>
			</div>
		</div>

		<div
			v-else-if="tab === 'forgot'"
			class="flex flex-col"
		>
			<div class="flex flex-col gap-2">
				<input type="text" v-model="formForgot.email" placeholder="Email" class="p-2 m-2 border border-gray-300 rounded-md w-80" />
			</div>

			<button 
				@click="submit" 
				:disabled="!formForgot.email" 
				:class="!formForgot.email ? `${styleButton} bg-gray-500` : `${styleButton} bg-green-500`"
			>
				Enviar
			</button>

			<div
				class="flex items-center justify-between"
			>
				<p
					@click="tab = 'signin'" 
					class="text-blue-500 ml-2 text-sm cursor-pointer"
				>
					Voltar
				</p>
			</div>
		</div>
  </main>
</template>
