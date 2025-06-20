<script lang="ts">
	import '../app.css';

	import Dashboard from '$dashboard/+layout.svelte';
</script>

<Dashboard workshopId="W001" lineId="L001" opCode="OP10-3" currentRoute={0}>
	<slot></slot>
</Dashboard>
