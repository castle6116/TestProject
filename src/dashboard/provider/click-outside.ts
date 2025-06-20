export function clickOutside(node: HTMLElement) {
	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;

		// 특정 클래스나 ID를 가진 요소에서 발생한 클릭 이벤트인 경우 무시
		if (target.closest('.ignore-click-outside')) {
			return;
		}

		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside'));
		}
	};

	document.addEventListener('click', handleClick, { passive: true, capture: true });

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
