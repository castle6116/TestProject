//#region Import
import { ComputerDesktop, DocumentDuplicate, Film, WrenchScrewdriver } from 'svelte-hero-icons';
//#endregion

export interface IMenuItem {
	title: string;
	icon: any;
	subMenu: ISubMenu[];
}
interface ISubMenu {
	title: string;
	link: string;
}

const data: IMenuItem[] = [
	{
		title: 'AI 모니터링',
		icon: ComputerDesktop,
		subMenu: [
			{
				title: 'AI 모니터링',
				link: '/monitoring'
			}
		]
	},
	{
		title: '제품 생산 이력',
		icon: WrenchScrewdriver,
		subMenu: [
			{
				title: '제품 생산 이력',
				link: '/product'
			}
		]
	},
	{
		title: '이상 감지 이력',
		icon: DocumentDuplicate,
		subMenu: [
			{
				title: '이상 감지 이력',
				link: '/abnormal'
			}
		]
	}
	// {
	// 	title: "Setting",
	// 	icon: Cog6Tooth,
	// 	link: "/admin/setting",
	// },
];

export default data;
