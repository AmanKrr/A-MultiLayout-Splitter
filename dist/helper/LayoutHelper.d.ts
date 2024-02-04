declare class LayoutHelper {
    private static PANE_CLASS;
    static mapElementPosition(wrapper: Record<string, HTMLDivElement | HTMLElement | null>, splitMode: "horizontal" | "vertical", cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>): void;
    static calculateRemainingSectionSize(wrapper: Record<string, HTMLDivElement | HTMLElement>, skipSections: number[], splitMode: "horizontal" | "vertical"): number;
    static getSection(cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, splitMode: "horizontal" | "vertical", sectionNumber: number): number;
}
export default LayoutHelper;
