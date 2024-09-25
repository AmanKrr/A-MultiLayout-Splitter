import Split from "./base/Split";
import SplitUtils from "./utils/SplitUtils";
import SplitSessionStorage from "./utils/SplitSessionStorage";
import { SplitStateProvider } from "./base/SplitProvider";

const openSplitter = SplitUtils.openSplitter.bind(SplitUtils);
const closeSplitter = SplitUtils.closeSplitter.bind(SplitUtils);
const getSplitPaneInstance = SplitUtils.getSplitPaneInstance.bind(SplitUtils);
const isSectionOpen = SplitUtils.isSectionOpen.bind(SplitUtils);
const setPaneSize = SplitUtils.setPaneSize.bind(SplitUtils);
const fixClass = SplitUtils.fixClass();

export { Split, openSplitter, closeSplitter, getSplitPaneInstance, isSectionOpen, fixClass, setPaneSize, SplitSessionStorage, SplitStateProvider };
