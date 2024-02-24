import { ISplitSessionStorage } from "./SplitSessionStorage";
type Orientation = "horizontal" | "vertical";
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
    static userSession: ISplitSessionStorage;
    static enableSessionStorage: {
        horizontal: boolean;
        vertical: boolean;
    };
    static cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>;
    static minThreshold: number[];
    static setWrapper(wrapper: HTMLDivElement | null, mode?: Orientation, minSizes?: number[], enableSessionStorage?: boolean): void;
    static getHandlebarPosition(handlePosition: number): number;
    static percentageToPixel(percentage: number, referenceWidth: string): number;
    static pixelToPercentage(pixelValue: number, referenceWidth: string): number;
    static isSectionOpen(sectionNumber: number, splitMode: Orientation): boolean;
    static reCheckPaneOpening(splitMode: Orientation): number;
    static closeSplitter(sectionNumber: number, splitMode: Orientation, direction?: "left" | "right" | "top" | "bottom" | null): void;
    static openSplitter(sectionNumber: number, splitMode: Orientation, direction?: "left" | "right" | "top" | "bottom" | null): void;
    static totalPaneCount(splitMode: Orientation): number;
    static totalHandleCount(splitMode: Orientation): number;
    private static saveSizesToLocalStorage;
    static saveHorizontalSizesToLocalStorage(): void;
    static saveVerticalSizesToLocalStorage(): void;
}
export default SplitUtils;
