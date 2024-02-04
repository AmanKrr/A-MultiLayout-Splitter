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
        var _a, _b, _c, _d, _e;
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
                currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1].classList.remove(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
            }
            else if (currentTarget && !nextTarget) {
                // remove right icon
                const currentHandleBar = currentTarget.previousElementSibling;
                (_c = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _c === void 0 ? void 0 : _c.classList.remove("disable");
                currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1].classList.remove(splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix");
            }
            else {
                // remove current left icon and right icon of previous
                // previous then current
                const previousHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.nextElementSibling;
                (_d = previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.firstChild) === null || _d === void 0 ? void 0 : _d.classList.remove("disable");
                previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.children[1].classList.remove(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
                // current
                const currentHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.previousElementSibling;
                (_e = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _e === void 0 ? void 0 : _e.classList.remove("disable");
                currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1].classList.remove(splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix");
            }
        }
    }
    /**
     * Hides handle bar icons when a split section is closed.
     * @param sectionNumber - The section number being closed.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     */
    static removeHandleIconOnClose(sectionNumber, wrapper, cachedMappedSplitPanePosition, splitMode) {
        var _a, _b, _c, _d, _e;
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
                    currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1].classList.add(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
                }
                else if (currentTarget && !nextTarget) {
                    // remove right icon
                    const currentHandleBar = currentTarget.previousElementSibling;
                    (_c = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _c === void 0 ? void 0 : _c.classList.add("disable");
                    currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1].classList.add(splitMode === "horizontal"
                        ? "right-margin-fix"
                        : "bottom-margin-fix");
                }
                else {
                    // remove current left icon and right icon of previous
                    // previous then current
                    const previousHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.nextElementSibling;
                    (_d = previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.firstChild) === null || _d === void 0 ? void 0 : _d.classList.add("disable");
                    previousHandleBar === null || previousHandleBar === void 0 ? void 0 : previousHandleBar.children[1].classList.add(splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix");
                    // current
                    const currentHandleBar = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.previousElementSibling;
                    (_e = currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.lastChild) === null || _e === void 0 ? void 0 : _e.classList.add("disable");
                    currentHandleBar === null || currentHandleBar === void 0 ? void 0 : currentHandleBar.children[1].classList.add(splitMode === "horizontal"
                        ? "right-margin-fix"
                        : "bottom-margin-fix");
                }
            }
        }
    }
}
export default ManageHandleBar;
