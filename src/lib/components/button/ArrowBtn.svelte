<script lang="ts">
	import { ChevronDown, Icon } from "svelte-hero-icons";

	export let isClicked: boolean = false;
</script>

<Icon
	class="w-4 mr-3 duration-150
			  {isClicked ? 'rotate-180' : 'rotate-0'}"
	src={ChevronDown}
/>
