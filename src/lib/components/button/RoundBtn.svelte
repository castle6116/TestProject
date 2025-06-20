<script lang="ts">
	// #region State
	/** Button 타입 */
	export let type: "submit" | "button" | "reset" | undefined | null;
	/** Button 텍스트 */
	export let caption: string;
	/** Button 클릭 이벤트 처리기 */
	export let onClick: (() => void) | undefined | null;
	export let style: string;
	// #endregion
</script>

<button {type} on:click={onClick} class={style}>{caption}</button>
