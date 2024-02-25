declare class ManageHandleBar {
    /**
     * Shows handle bar icon on open of a split section.
     * @param sectionNumber - The section number being opened.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param direction - The direction of the open operation, either "left" or "right".
     * Don't provide the direction if this function is not used inside the SplitUtils class itself.
     */
    static showHandleIconOnOpen(sectionNumber: number, wrapper: Record<string, HTMLDivElement | HTMLElement | null>, cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, splitMode: "horizontal" | "vertical"): void;
    /**
     * Hides handle bar icons when a split section is closed.
     * @param sectionNumber - The section number being closed.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     */
    static removeHandleIconOnClose(sectionNumber: number, wrapper: Record<string, HTMLDivElement | HTMLElement | null>, cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, splitMode: "horizontal" | "vertical"): void;
}
export default ManageHandleBar;
