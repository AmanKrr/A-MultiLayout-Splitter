import Split from "./base/Split";
import SplitUtils from "./utils/SplitUtils";
import SplitSessionStorage from "./utils/SplitSessionStorage";
declare const openSplitter: typeof SplitUtils.openSplitter;
declare const closeSplitter: typeof SplitUtils.closeSplitter;
declare const getSplitPaneInstance: typeof SplitUtils.getSplitPaneInstance;
declare const isSectionOpen: typeof SplitUtils.isSectionOpen;
declare const fixClass: string;
export { Split, openSplitter, closeSplitter, getSplitPaneInstance, isSectionOpen, fixClass, SplitSessionStorage };
