declare class LayoutHelper {
    private static PANE_CLASS;
    /**
     * Maps the position of split panes within a wrapper element and stores them in a cached dictionary.
     * @param {Element | null} instance - The instance element containing split panes (if applicable).
     * @param {Record<string, HTMLDivElement | HTMLElement | null>} wrapper - The wrapper containing split panes.
     * @param {"horizontal" | "vertical"} splitMode - The split mode, either "horizontal" or "vertical".
     * @param {Record<string, Record<string, string | null> | null>} cachedMappedSplitPanePosition - The cached dictionary to store mapped positions.
     * @param {boolean} [force=false] - If true, forces remapping even if positions are already cached.
     */
    static mapElementPosition(instance: Element | null, wrapper: Record<string, HTMLDivElement | HTMLElement | null>, splitMode: "horizontal" | "vertical", cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, force?: boolean): void;
    /**
     * Calculates the total size of remaining sections based on the provided parameters.
     * @param {Record<string, HTMLDivElement | HTMLElement>} wrapper - The wrapper containing sections.
     * @param {number[]} skipSections - The indices of sections to skip while calculating the size.
     * @param {"horizontal" | "vertical"} splitMode - The split mode, either "horizontal" or "vertical".
     * @returns {number | undefined} The total size of remaining sections, or undefined if an error occurs.
     */
    static calculateRemainingSectionSize(wrapper: Record<string, HTMLDivElement | HTMLElement>, skipSections: number[], splitMode: "horizontal" | "vertical"): number;
    /**
     * Gets the section index based on the provided parameters.
     * @param {Record<string, Record<string, string | null> | null>} cachedMappedSplitPanePosition - The cached mapped split pane position.
     * @param {"horizontal" | "vertical"} splitMode - The split mode, either "horizontal" or "vertical".
     * @param {number} sectionNumber - The section number to retrieve.
     * @returns {number | null} The section index, or null if not found.
     */
    static getSection(cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>, splitMode: "horizontal" | "vertical", sectionNumber: number): number;
}
export default LayoutHelper;
