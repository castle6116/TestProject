<script lang="ts">
	import "./style.css";
	import Spinner from "$assets/images/spinner.gif";
	import { isDarkMode } from "../../../dashboard/provider/store";

	export let caption: string = "Loading...";
	export let spinner: boolean = true;
	export let gradationEffect:
		| {
				color?: string;
				duration?: string;
		  }
		| undefined = undefined;
</script>

<div
	class="text-white w-full h-full flex justify-center items-center m-auto {$isDarkMode
		? 'gradient-animation-effect'
		: ''}"
	style="
		--gradation-second-color: {gradationEffect?.color};
		--animation-duration: {gradationEffect?.duration};"
>
	<span class="font-semibold text-black dark:text-white">{caption}</span>
	{#if spinner}
		<img class="bg-transparent h-8" src={Spinner} alt="loading" />
	{/if}
</div>

<style>
	.gradient-animation-effect {
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0),
			var(--gradation-second-color),
			rgba(255, 255, 255, 0) 70%
		);

		background-repeat: repeat-y;

		background-position:
			-400px 10px,
			5px 10px,
			5px 30px,
			5px 50px;

		background-size:
			500px 400px,
			100px 400px,
			450px 100px,
			450px 100px;
		animation: shine var(--animation-duration) ease infinite;
	}

	@keyframes shine {
		to {
			background-position:
				700% 10px,
				5px 10px,
				5px 30px,
				5px 50px;
		}
	}
</style>
