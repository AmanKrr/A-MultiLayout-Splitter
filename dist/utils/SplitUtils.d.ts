import { ISplitSessionStorage } from "./SplitSessionStorage";
type Orientation = "horizontal" | "vertical";
type Instance = Element | null;
export type paneStatus = "open" | "close" | "added" | "removed" | "unknown";
declare class SplitUtils {
    private static TOP;
    private static BOTTOM;
    private static LEFT;
    private static RIGHT;
    private static HORIZONTAL;
    private static VERTICAL;
    private static SECTION_CLASS_HIDE;
    private static FIX_CLASS;
    private static FIX_HELPER_CLASS;
    static layoutCallback?: {
        [key: string]: (sectionNumber: number, paneId: string, reason: string | paneStatus, direction: "left" | "right" | "top" | "bottom" | null) => void | null | undefined;
    };
    static wrapper: HTMLDivElement | null;
    static mode: string;
    static modeWrapper: Record<string, HTMLDivElement | HTMLElement | null>;
    static userSession: ISplitSessionStorage;
    static enableSessionStorage: {
        horizontal: boolean;
        vertical: boolean;
    };
    static cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>;
    static splitPaneInstance: Record<string, Instance> | null;
    /**
     * Sets the wrapper, mode, and other configurations for the SplitUtils.
     * @param wrapper - HTMLDivElement that wraps the split panes.
     * @param mode - Split mode, either "horizontal" or "vertical".
     * @param enableSessionStorage - Flag to enable session storage for storing split sizes.
     */
    static setWrapper(wrapper: HTMLDivElement | null, mode: Orientation | undefined, callback: {
        [key: string]: (sectionNumber: number, paneId: string, reason: string | paneStatus, direction: "left" | "right" | "top" | "bottom" | null) => void | null | undefined;
    }, enableSessionStorage?: boolean): void;
    /**
     * Returns the combined class names for fixing purposes.
     * @returns {string} Combined class names.
     */
    static fixClass(): string;
    /**
     * Sets the split pane instance.
     * @param {Record<string, Instance>} instance - The instance to set.
     */
    static setSplitPaneInstance(instance: Record<string, Instance>): void;
    /**
     * Gets the split pane instance.
     * @returns {Record<string, Instance>} The split pane instance.
     */
    static getSplitPaneInstance(): Record<string, Instance> | null;
    /**
     * Calculates the position of the handlebar based on the position of the section.
     * @param handlePosition The position of the section.
     * @returns The position of the handlebar.
     */
    static getHandlebarPosition(handlePosition: number): number;
    /**
     * Converts a percentage value to pixel value based on the reference width.
     * @param percentage The percentage value to convert.
     * @param referenceWidth The reference width against which the percentage is calculated.
     *                       Can be in viewport width (vw), viewport height (vh), percentage (%), or pixels (px).
     * @returns The corresponding pixel value.
     */
    static percentageToPixel(percentage: number, referenceWidth: string): number;
    /**
     * Converts a pixel value to percentage based on the reference width.
     * @param pixelValue The pixel value to convert.
     * @param referenceWidth The reference width against which the percentage is calculated.
     *                       Can be in viewport width (vw), viewport height (vh), percentage (%), or pixels (px).
     * @returns The corresponding percentage value.
     */
    static pixelToPercentage(pixelValue: number, referenceWidth: string): number;
    /**
     * Checks if a specific split section is open.
     * @param sectionNumber - The section number to be checked.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @returns True if the section is open, false otherwise.
     */
    static isSectionOpen(instance: Instance, sectionNumber: number, splitMode: Orientation): boolean;
    /**
     * Checks and adjusts the layout of split panes based on the specified split mode.
     * This function ensures that all sections are properly opened in the split panes.
     * @param splitMode The mode of splitting, either "horizontal" or "vertical".
     * @returns -1 if the wrapper is not set, otherwise no return value.
     */
    static reCheckPaneOpening(instance: Instance, splitMode: Orientation): -1 | undefined;
    /**
     * Invokes the layout callback function for the specified pane or mode wrapper.
     * @param instance - The instance of the pane or null.
     * @param sectionNumber - The section number.
     * @param splitMode - The split mode (horizontal or vertical).
     * @param reason - The reason for invoking the layout callback.
     */
    static invokeLayoutCallback(instance: Instance | undefined, sectionNumber: number, splitMode: Orientation, reason?: string | paneStatus, direction?: "left" | "right" | "top" | "bottom" | null): void;
    /**
     * Closes a specific split section.
     * @param sectionNumber - The section number to be closed.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param direction - The direction of the close operation, either "left", "right", "top", "bottom" or "null". Direction null is used only when not using arrow icon of handlebar to close the splitter.
     */
    static closeSplitter(instance: Instance | undefined, sectionNumber: number, splitMode: Orientation, reason?: string | paneStatus, direction?: "left" | "right" | "top" | "bottom" | null): void;
    /**
     * Opens a specific split section with a new size.
     * @param sectionNumber - The section number to be opened.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param direction - The direction of the open operation, either "left" or "right".
     */
    static openSplitter(instance: Instance | undefined, sectionNumber: number, splitMode: Orientation, reason?: string | paneStatus, direction?: "left" | "right" | "top" | "bottom" | null): void;
    /**
     * Sets the size of individual panes within a split layout.
     * @param instance - The instance of the pane or null.
     * @param sizes - An object containing pane section numbers as keys and their respective sizes as values.
     * @param splitMode - The split mode (horizontal or vertical).
     */
    static setPaneSize(instance: Instance | undefined, sizes: {
        [key: number]: number;
    }, splitMode: Orientation): void;
    /**
     * Calculates the total number of panes in the split panes based on the split mode.
     * @param splitMode The mode of splitting, either "horizontal" or "vertical".
     * @returns The total number of panes, or -1 if the wrapper is not set.
     */
    static totalPaneCount(instance: Instance, splitMode: Orientation): number;
    /**
     * Calculates the total number of handle bars in the split panes based on the split mode.
     * @param splitMode The mode of splitting, either "horizontal" or "vertical".
     * @returns The total number of handle bars, or -1 if the wrapper is not set.
     */
    static totalHandleCount(instance: Instance, splitMode: Orientation): number;
    /**
     * Saves sizes of split panes to local storage or session storage based on the split mode.
     * @param splitMode The mode of splitting, either "horizontal" or "vertical". Defaults to "horizontal".
     * @param closeSection A boolean indicating whether to close the section or not. Defaults to false.
     * @returns True if the sizes are saved successfully, false otherwise.
     */
    private static saveSizesToLocalStorage;
    /**
     * Saves sizes to local storage for horizontal layout mode.
     */
    static saveHorizontalSizesToLocalStorage(): void;
    /**
     * Saves sizes to local storage for vertical layout mode.
     */
    static saveVerticalSizesToLocalStorage(): void;
    /**
     * Static method to reset stored session data when adding or removing a pane in a split mode.
     * Clears relevant data from local storage.
     * @param splitMode The split mode ("horizontal" or "vertical") for which to reset stored session data.
     */
    static resetLocalStorageOnPaneAddOrRemove(splitMode: "horizontal" | "vertical"): void;
}
export default SplitUtils;
