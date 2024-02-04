import { ISplitSessionStorage } from "./SplitSessionStorage";
declare class SplitUtils {
    private static TOP;
    private static BOTTOM;
    private static LEFT;
    private static RIGHT;
    private static HORIZONTAL;
    private static VERTICAL;
    private static SECTION_CLASS_HIDE;
    static wrapper: HTMLDivElement | null;
    static mode: string;
    static modeWrapper: Record<string, HTMLDivElement | HTMLElement | null>;
    static userSession: ISplitSessionStorage | null;
    static enableSessionStorage: {
        horizontal: boolean;
        vertical: boolean;
    };
    static cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>;
    static minThreshold: number[];
    /**
     * Sets the wrapper, mode, and other configurations for the SplitUtils.
     * @param wrapper - HTMLDivElement that wraps the split panes.
     * @param mode - Split mode, either "horizontal" or "vertical".
     * @param enableSessionStorage - Flag to enable session storage for storing split sizes.
     */
    static setWrapper(wrapper: HTMLDivElement, mode?: "horizontal" | "vertical", minSizes?: number[], enableSessionStorage?: boolean): void;
    /**
     * Checks if a specific split section is open.
     * @param sectionNumber - The section number to be checked.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @returns True if the section is open, false otherwise.
     */
    static isSectionOpen(sectionNumber: number, splitMode: "horizontal" | "vertical"): boolean;
    /**
     * Closes a specific split section.
     * @param sectionNumber - The section number to be closed.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param direction - The direction of the close operation, either "left", "right", "top", "bottom" or "null". Direction null is used only when not using arrow icon of handlebar to close the splitter.
     */
    static closeSplitter(sectionNumber: number, splitMode: "horizontal" | "vertical", direction?: "left" | "right" | "top" | "bottom" | null): void;
    /**
     * Opens a specific split section with a new size.
     * @param sectionNumber - The section number to be opened.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param direction - The direction of the open operation, either "left" or "right".
     */
    static openSplitter(sectionNumber: number, splitMode: "horizontal" | "vertical", direction?: "left" | "right" | "top" | "bottom" | null): void;
    /**
     * Save sizes to local storage.
     */
    static saveSizesToLocalStorage(splitMode?: "horizontal" | "vertical", closeSection?: boolean): boolean;
}
export default SplitUtils;
