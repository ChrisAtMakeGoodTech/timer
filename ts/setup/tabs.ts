export default function setUpTabs() {
	const TabContainer = document.getElementById('tabs')!;
	const SectionContainer = document.getElementById('sections')!;

	const Tabs = <HTMLElement[]>Array.prototype.map.call(TabContainer.children, e => e);
	const Sections = <HTMLElement[]>Array.prototype.map.call(SectionContainer.children, e => e);

	Array.prototype.forEach.call(TabContainer.children, (tab: HTMLElement) => {
		const TabName = tab.getAttribute('data-tabname');
		const Section = SectionContainer.querySelector(`[data-tabname="${TabName}"]`)!;
		tab.addEventListener('click', function () {
			Tabs.forEach(t => t.classList.remove('active'));
			Sections.forEach(s => s.classList.remove('active'));
			tab.classList.add('active');
			Section.classList.add('active');
		});
	});
}