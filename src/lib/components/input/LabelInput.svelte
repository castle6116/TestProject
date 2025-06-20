<script lang="ts">
	import { onMount } from "svelte";
	import EyeOff from "$assets/images/eye_off.png";
	import EyeOn from "$assets/images/eye_on.png";

	/** 입력 타입 */
	export let type: string;
	export let placeholder: string;
	export let value: string;
	export let disabled: boolean = false;
	/** Element 명 */
	export let inputName: string;
	/** CSS Style */
	export let style: string;
	/** placeholder 표시 문자열 */
	export let labelString: string;
	export let labelStyle: string = "ml-4";
	export let pwIconStyle: string = "w-6 h-6 top-2.5 right-2";
	export let onEntered: (() => void) | undefined = undefined;

	let pwImgSrc: string = EyeOff;

	onMount(() => {
		const input: HTMLInputElement = document.getElementsByName(inputName)[0] as HTMLInputElement;
		input.addEventListener("input", () => {
			value = input.value;
		});
	});
</script>

<div class="outline relative rounded-md outline-gray-300 outline-1 mb-5">
	<input
		class={style}
		name={inputName}
		{placeholder}
		{type}
		{disabled}
		on:keydown={(e) => {
			if (e.key === "Enter" && onEntered) {
				onEntered();
			}
		}}
	/>
	<label
		class="absolute top-0 -translate-y-3 -translate-x-3.5 z-0 px-1 py-0 bg-black text-white scale-75 text-sm
		{labelStyle}
		"
		for={inputName}
		>{labelString}
	</label>

	<!-- 비밀번호일 때, Eye Icon 표시 -->
	{#if inputName.includes("password")}
		<button
			class="absolute cursor-pointer text-gray-400 duration-300
			{pwIconStyle}
			"
			on:click={() => {
				pwImgSrc = pwImgSrc === EyeOn ? EyeOff : EyeOn;
				type = type === "password" ? "text" : "password";
			}}
		>
			<img src={pwImgSrc} alt="eye" />
		</button>
	{/if}
</div>

<style lang="postcss">
	.outline input:focus-within ~ label,
	/* Input 자동완성시 백그라운드 컬러 , Text 컬러 */
	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 0px inset;
		-webkit-text-fill-color: #ffffff;
	}
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		transition: background-color 5000s ease-in-out 0s;
	}
</style>
