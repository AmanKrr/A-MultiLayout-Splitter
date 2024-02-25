import SplitUtils from "../utils/SplitUtils";
import LayoutHelper from "./LayoutHelper";
class ManageHandleBar {
    /**
     * Shows handle bar icon on open of a split section.
     * @param sectionNumber - The section number being opened.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param direction - The direction of the open operation, either "left" or "right".
     * Don't provide the direction if this function is not used inside the SplitUtils class itself.
     */
    static showHandleIconOnOpen(sectionNumber, wrapper, cachedMappedSplitPanePosition, splitMode) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // Implementation for handling handle bar icons on open
        const sections = (_a = wrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && sections.length > 0) {
            const currentSectionIndex = LayoutHelper.getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber);
            const previousSectionIndex = LayoutHelper.getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber - 1);
            const nextSectionIndex = LayoutHelper.getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber + 1);
            const currentTarget = sections[currentSectionIndex == null ? -1 : currentSectionIndex];
            const prevTarget = sections[previousSectionIndex == null ? -1 : previousSectionIndex];
            const nextTarget = sections[nextSectionIndex == null ? -1 : nextSectionIndex];
            // remove left icon
            if (currentTarget && !prevTarget) {
                const currentHandleBar = currentTarget.nextElementSibling;
                (_b = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.firstChild) === null || _b === void 0 ? void 0 : _b.classList.remove("disable");
                (_c = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1]) === null || _c === void 0 ? void 0 : _c.classList.remove(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
            }
            else if (currentTarget && !nextTarget) {
                // remove right icon
                const currentHandleBar = currentTarget.previousElementSibling;
                (_d = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _d === void 0 ? void 0 : _d.classList.remove("disable");
                (_e = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1]) === null || _e === void 0 ? void 0 : _e.classList.remove(splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix");
            }
            else {
                // remove current left icon and right icon of previous
                // previous then current
                const previousHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.nextElementSibling;
                (_f = previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.firstChild) === null || _f === void 0 ? void 0 : _f.classList.remove("disable");
                (_g = previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.children[1]) === null || _g === void 0 ? void 0 : _g.classList.remove(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
                // current
                const currentHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.previousElementSibling;
                (_h = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _h === void 0 ? void 0 : _h.classList.remove("disable");
                (_j = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1]) === null || _j === void 0 ? void 0 : _j.classList.remove(splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix");
            }
        }
    }
    /**
     * Hides handle bar icons when a split section is closed.
     * @param sectionNumber - The section number being closed.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     */
    static removeHandleIconOnClose(sectionNumber, wrapper, cachedMappedSplitPanePosition, splitMode) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // Implementation for hiding handle bar icons on close
        const sections = (_a = wrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        /*
          - Closing to left (means left arrow button is clicked)
            - If left arrow button is clicked then remove the right of previous section and left icon of current section.
        */
        if (sections && sections.length > 0) {
            const currentSectionIndex = LayoutHelper.getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber);
            const previousSectionIndex = LayoutHelper.getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber - 1);
            const nextSectionIndex = LayoutHelper.getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber + 1);
            const currentTarget = sections[currentSectionIndex == null ? -1 : currentSectionIndex];
            const prevTarget = sections[previousSectionIndex == null ? -1 : previousSectionIndex];
            const nextTarget = sections[nextSectionIndex == null ? -1 : nextSectionIndex];
            if (!SplitUtils.isSectionOpen(sectionNumber, splitMode)) {
                // remove left icon
                if (currentTarget && !prevTarget) {
                    const currentHandleBar = currentTarget.nextElementSibling;
                    (_b = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.firstChild) === null || _b === void 0 ? void 0 : _b.classList.add("disable");
                    (_c = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1]) === null || _c === void 0 ? void 0 : _c.classList.add(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
                }
                else if (currentTarget && !nextTarget) {
                    // remove right icon
                    const currentHandleBar = currentTarget.previousElementSibling;
                    (_d = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _d === void 0 ? void 0 : _d.classList.add("disable");
                    (_e = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1]) === null || _e === void 0 ? void 0 : _e.classList.add(splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix");
                }
                else {
                    // remove current left icon and right icon of previous
                    // previous then current
                    const previousHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.nextElementSibling;
                    (_f = previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.firstChild) === null || _f === void 0 ? void 0 : _f.classList.add("disable");
                    (_g = previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.children[1]) === null || _g === void 0 ? void 0 : _g.classList.add(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
                    // current
                    const currentHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.previousElementSibling;
                    (_h = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _h === void 0 ? void 0 : _h.classList.add("disable");
                    (_j = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1]) === null || _j === void 0 ? void 0 : _j.classList.add(splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix");
                }
            }
        }
    }
}
export default ManageHandleBar;
