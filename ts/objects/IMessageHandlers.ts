export default interface IMessageHandlers {
	[index: string]: (ev: MessageEvent) => void;
}
