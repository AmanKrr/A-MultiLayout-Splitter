class LayoutHelper {
    static mapElementPosition(wrapper, splitMode, cachedMappedSplitPanePosition) {
        var _a;
        // Check if the wrapper is set
        if (!wrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using closeSplitter.");
            return;
        }
        let splitIndex = 1;
        const elements = (_a = wrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        // Check if elements exist and the split index is not already cached
        if (elements && !cachedMappedSplitPanePosition[splitMode]) {
            // Iterate through elements to find split panes
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                // Check if the element is a split pane (not a handle bar)
                if (splitMode === "horizontal") {
                    if (element.classList.contains(this.PANE_CLASS)) {
                        // Cache the position of the split pane
                        cachedMappedSplitPanePosition[splitMode] = Object.assign(Object.assign({}, cachedMappedSplitPanePosition[splitMode]), { [`${splitIndex}`]: `${i}` });
                        ++splitIndex;
                    }
                }
                else {
                    if (element.classList.contains(this.PANE_CLASS)) {
                        // Cache the position of the split pane
                        cachedMappedSplitPanePosition[splitMode] = Object.assign(Object.assign({}, cachedMappedSplitPanePosition[splitMode]), { [`${splitIndex}`]: `${i}` });
                        ++splitIndex;
                    }
                }
            }
        }
    }
    static calculateRemainingSectionSize(wrapper, skipSections, splitMode) {
        var _a;
        if (!wrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using getRestSectionSize.");
            return -1;
        }
        const sections = (_a = wrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && sections.length > 0) {
            let totalSize = 0;
            for (let i = 0; i < sections.length; i += 2) {
                if (!skipSections.includes(i)) {
                    const contentTarget = sections[i];
                    totalSize += parseFloat(contentTarget.style.flexBasis.replace("%", ""));
                }
            }
            return totalSize;
        }
        else {
            console.error("No elements found.");
        }
    }
    static getSection(cachedMappedSplitPanePosition, splitMode, sectionNumber) {
        var _a;
        const position = (_a = cachedMappedSplitPanePosition === null || cachedMappedSplitPanePosition === void 0 ? void 0 : cachedMappedSplitPanePosition[splitMode]) === null || _a === void 0 ? void 0 : _a[sectionNumber];
        return position == null ? null : parseInt(position);
    }
}
LayoutHelper.PANE_CLASS = "a-split-pane";
export default LayoutHelper;
