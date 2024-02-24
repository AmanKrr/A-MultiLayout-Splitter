declare class ManageHandleBar {
    static showHandleIconOnOpen(sectionNumber: number, wrapper: Record<string, HTMLDivElement | HTMLElement | null>, cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, splitMode: "horizontal" | "vertical"): void;
    static removeHandleIconOnClose(sectionNumber: number, wrapper: Record<string, HTMLDivElement | HTMLElement | null>, cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, splitMode: "horizontal" | "vertical"): void;
}
export default ManageHandleBar;
