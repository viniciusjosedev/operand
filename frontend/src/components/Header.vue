<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const logout = async () => {
	await userStore.logout();
}

</script>

<template>
	<header
		class="w-full bg-black flex items-center justify-between p-4"
	>
		<h1
			class="text-5xl text-orange-500"
		>
			Operand
		</h1>

		<div
			class="flex items-center"
		>
			<p
				class="text-white"
			>
				{{ userStore.user.email }}
			</p>

			<button
				@click="logout"
				class="p-2 m-2 text-white rounded-md bg-red-500"
			>
				Sair
			</button>
		</div>
	</header>
</template>