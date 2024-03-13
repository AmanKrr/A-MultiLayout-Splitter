import Split from "./base/Split";
import SplitUtils from "./utils/SplitUtils";
import SplitSessionStorage from "./utils/SplitSessionStorage";

const openSplitter = SplitUtils.openSplitter;
const closeSplitter = SplitUtils.closeSplitter;
const getSplitPaneInstance = SplitUtils.getSplitPaneInstance;
const isSectionOpen = SplitUtils.isSectionOpen;
const fixClass = SplitUtils.fixClass();

export { Split, openSplitter, closeSplitter, getSplitPaneInstance, isSectionOpen, fixClass, SplitSessionStorage };
