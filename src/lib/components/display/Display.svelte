<script lang="ts">
	export let caption: string | number;
	export let backgroundColor: string;
	export let borderColor: string;
	export let textColor: string;
	export let textAlign: string = "text-center";
	export let width: string = "w-14";
	export let minWidth: string = "min-w-14";
	export let margin: string = "";
</script>

<div
	class="rounded-sm px-1.5 py-0.5 flex justify-center border-[0.9px]
  {borderColor} {backgroundColor} {textColor} {width} {minWidth} {margin}"
>
	<span class="text-xs w-full {textAlign}">{caption}</span>
</div>
