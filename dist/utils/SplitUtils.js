import LayoutHelper from "../helper/LayoutHelper";
import ManageHandleBar from "../helper/ManageHandleBar";
import SplitSessionStorage from "./SplitSessionStorage";
class SplitUtils {
    static setWrapper(wrapper, mode = "horizontal", minSizes = [], enableSessionStorage = false) {
        this.wrapper = wrapper;
        this.mode = mode;
        this.modeWrapper = Object.assign(Object.assign({}, this.modeWrapper), { [mode]: wrapper });
        this.minThreshold = minSizes;
        this.userSession = new SplitSessionStorage();
        this.enableSessionStorage[mode] = enableSessionStorage;
        this.cachedMappedSplitPanePosition[mode] = null;
        LayoutHelper.mapElementPosition(this.modeWrapper, mode, this.cachedMappedSplitPanePosition);
    }
    static getHandlebarPosition(handlePosition) {
        if (handlePosition < 1) {
            console.error("Section index must be greater than or equal to 1.");
            return -1;
        }
        return handlePosition * 2 - 1;
    }
    static percentageToPixel(percentage, referenceWidth) {
        if (referenceWidth && referenceWidth.includes("vw")) {
            return (percentage / 100) * window.innerWidth * (parseFloat(referenceWidth.replace("vw", "")) / 100);
        }
        else if (referenceWidth && referenceWidth.includes("vh")) {
            return (percentage / 100) * window.innerHeight * (parseFloat(referenceWidth.replace("vh", "")) / 100);
        }
        else if (referenceWidth && referenceWidth.includes("%")) {
            return (percentage / 100) * parseFloat(referenceWidth.replace("%", ""));
        }
        else {
            return (percentage / 100) * parseFloat(referenceWidth.replace("px", ""));
        }
    }
    static pixelToPercentage(pixelValue, referenceWidth) {
        if (referenceWidth.includes("vw")) {
            return (pixelValue / window.innerWidth) * 100;
        }
        else if (referenceWidth.includes("vh")) {
            return (pixelValue / window.innerHeight) * 100;
        }
        else if (referenceWidth.includes("px")) {
            return (pixelValue / parseFloat(referenceWidth.replace("px", ""))) * 100;
        }
        else {
            return (pixelValue / parseFloat(referenceWidth.replace("%", ""))) * 100;
        }
    }
    static isSectionOpen(sectionNumber, splitMode) {
        var _a;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using isSectionOpen.");
            return false;
        }
        const sections = (_a = this.modeWrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && sectionNumber > 0 && sections.length >= sectionNumber) {
            let sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, sectionNumber);
            if (sectionIndex == null || sectionIndex === undefined) {
                console.error(`Section number ${sectionIndex}. Provide correct section number.`);
                return;
            }
            if (sectionIndex !== null && sectionIndex !== undefined) {
                const currentTarget = sections[sectionIndex];
                return !currentTarget.classList.contains(this.SECTION_CLASS_HIDE);
            }
        }
        return false;
    }
    static reCheckPaneOpening(splitMode) {
        var _a;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using totalHandleCount.");
            return -1;
        }
        const sections = (_a = this.modeWrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && sections.length > 0) {
            const totalPaneSize = this.totalPaneCount(splitMode);
            let openedSectionCount = 0;
            for (let i = 1; i <= totalPaneSize; i++) {
                this.isSectionOpen(i, splitMode) ? ++openedSectionCount : openedSectionCount;
            }
            if (openedSectionCount === totalPaneSize) {
                for (let i = 1; i <= totalPaneSize; i++) {
                    const sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, i);
                    if (sectionIndex == null || sectionIndex === undefined) {
                        console.error(`Section number ${sectionIndex}. Provide correct section number.`);
                        return -1;
                    }
                    if (sections[sectionIndex].style.flexGrow === "1") {
                        sections[sectionIndex].style.removeProperty("flex-grow");
                    }
                }
            }
        }
    }
    static closeSplitter(sectionNumber, splitMode, direction = null) {
        var _a;
        const mode = splitMode || this.mode;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using closeSplitter.");
            return;
        }
        const sections = (_a = this.modeWrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && sectionNumber > 0 && sections.length >= sectionNumber) {
            const sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, sectionNumber);
            if (sectionIndex == null || sectionIndex === undefined) {
                console.error(`Section number ${sectionIndex}. Provide correct section number.`);
                return;
            }
            if (sectionIndex != null && sectionIndex !== undefined) {
                const currentTarget = sections[sectionIndex];
                const prevTarget = sections[sectionIndex - 2];
                const nextTarget = sections[sectionIndex + 2];
                if (mode === this.HORIZONTAL && currentTarget) {
                    currentTarget.style.flexGrow = "0";
                    currentTarget.classList.add(this.SECTION_CLASS_HIDE);
                    if (direction === this.RIGHT) {
                        prevTarget.style.flexGrow = "1";
                    }
                    else if (direction === this.LEFT) {
                        nextTarget.style.flexGrow = "1";
                    }
                    else {
                        if (nextTarget) {
                            nextTarget.style.flexGrow = "1";
                        }
                        else {
                            if (prevTarget) {
                                prevTarget.style.flexGrow = "1";
                            }
                        }
                    }
                    ManageHandleBar.removeHandleIconOnClose(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "horizontal");
                    this.saveSizesToLocalStorage(this.HORIZONTAL);
                }
                else if (mode === this.VERTICAL && currentTarget) {
                    currentTarget.style.flexGrow = "0";
                    currentTarget.classList.add(this.SECTION_CLASS_HIDE);
                    if (direction === this.BOTTOM) {
                        prevTarget.style.flexGrow = "1";
                    }
                    else if (direction === this.TOP) {
                        nextTarget.style.flexGrow = "1";
                    }
                    else {
                        if (nextTarget) {
                            nextTarget.style.flexGrow = "1";
                        }
                        else {
                            if (prevTarget) {
                                prevTarget.style.flexGrow = "1";
                            }
                        }
                    }
                    ManageHandleBar.removeHandleIconOnClose(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "vertical");
                    this.saveSizesToLocalStorage(this.VERTICAL);
                }
            }
        }
    }
    static openSplitter(sectionNumber, splitMode, direction = null) {
        var _a;
        const mode = splitMode || this.mode;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using openSplitter.");
            return;
        }
        const sections = (_a = this.modeWrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && sectionNumber > 0 && sections.length >= sectionNumber) {
            let sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, sectionNumber);
            if (sectionIndex === null || sectionIndex === undefined) {
                console.error(`Section number ${sectionIndex}. Provide correct section number.`);
                return;
            }
            if (sectionIndex !== null && sectionIndex !== undefined) {
                const currentTarget = sections[sectionIndex];
                const prevTarget = sections[sectionIndex - 2];
                const nextTarget = sections[sectionIndex + 2];
                const totalPaneSize = (sections.length + 1) / 2;
                let openSectionCounter = 0;
                for (let pane = 0; pane < totalPaneSize; pane++) {
                    if (this.isSectionOpen(pane + 1, splitMode)) {
                        openSectionCounter++;
                    }
                }
                if (mode === this.HORIZONTAL && currentTarget) {
                    currentTarget.style.removeProperty("flex-grow");
                    currentTarget.classList.remove(this.SECTION_CLASS_HIDE);
                    if (direction === this.RIGHT) {
                        if (openSectionCounter !== 1) {
                            nextTarget.style.removeProperty("flex-grow");
                            if (prevTarget) {
                                prevTarget.style.removeProperty("flex-grow");
                            }
                        }
                        else {
                            nextTarget.style.flexGrow = "1";
                        }
                    }
                    else if (direction === this.LEFT) {
                        if (openSectionCounter !== 1) {
                            prevTarget.style.removeProperty("flex-grow");
                            if (nextTarget) {
                                nextTarget.style.removeProperty("flex-grow");
                            }
                        }
                        else {
                            prevTarget.style.flexGrow = "1";
                        }
                    }
                    else {
                        if (nextTarget) {
                            if (openSectionCounter !== 1) {
                                nextTarget.style.removeProperty("flex-grow");
                                if (prevTarget) {
                                    prevTarget.style.removeProperty("flex-grow");
                                }
                            }
                            else {
                                nextTarget.style.flexGrow = "1";
                            }
                        }
                        else {
                            if (prevTarget) {
                                if (openSectionCounter !== 1) {
                                    prevTarget.style.removeProperty("flex-grow");
                                    if (nextTarget) {
                                        nextTarget.style.removeProperty("flex-grow");
                                    }
                                }
                                else {
                                    prevTarget.style.flexGrow = "1";
                                }
                            }
                        }
                    }
                    this.reCheckPaneOpening(this.HORIZONTAL);
                    ManageHandleBar.showHandleIconOnOpen(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "horizontal");
                    this.saveSizesToLocalStorage(mode);
                }
                else if (mode === this.VERTICAL && currentTarget) {
                    currentTarget.style.removeProperty("flex-grow");
                    currentTarget.classList.remove(this.SECTION_CLASS_HIDE);
                    if (direction === this.BOTTOM) {
                        if (openSectionCounter !== 1) {
                            nextTarget.style.removeProperty("flex-grow");
                        }
                        else {
                            nextTarget.style.flexGrow = "1";
                        }
                    }
                    else if (direction === this.TOP) {
                        if (openSectionCounter !== 1) {
                            prevTarget.style.removeProperty("flex-grow");
                        }
                        else {
                            prevTarget.style.flexGrow = "1";
                        }
                    }
                    else {
                        if (nextTarget) {
                            if (openSectionCounter !== 1) {
                                nextTarget.style.removeProperty("flex-grow");
                            }
                            else {
                                nextTarget.style.flexGrow = "1";
                            }
                        }
                        else {
                            if (prevTarget) {
                                if (openSectionCounter !== 1) {
                                    prevTarget.style.removeProperty("flex-grow");
                                }
                                else {
                                    prevTarget.style.flexGrow = "1";
                                }
                            }
                        }
                    }
                    this.reCheckPaneOpening(this.VERTICAL);
                    ManageHandleBar.showHandleIconOnOpen(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "vertical");
                    this.saveSizesToLocalStorage(mode);
                }
            }
        }
    }
    static totalPaneCount(splitMode) {
        var _a;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using totalPaneCount.");
            return -1;
        }
        const sections = (_a = this.modeWrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections) {
            const totalPaneSize = (sections.length + 1) / 2;
            return totalPaneSize;
        }
        return -1;
    }
    static totalHandleCount(splitMode) {
        var _a;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using totalHandleCount.");
            return -1;
        }
        const sections = (_a = this.modeWrapper[splitMode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections) {
            const totalPaneSize = Math.abs((sections.length + 1) / 2 - sections.length);
            return totalPaneSize;
        }
        return -1;
    }
    static saveSizesToLocalStorage(splitMode = "horizontal", closeSection = false) {
        var _a;
        const mode = splitMode || this.mode;
        if (!this.modeWrapper[splitMode]) {
            console.error("Wrapper not set. Call setWrapper before using saveSizesToLocalStorage.");
            return false;
        }
        const sections = (_a = this.modeWrapper[mode]) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && this.enableSessionStorage[splitMode]) {
            const sizes = [];
            for (let i = 0; i < sections.length; i += 2) {
                let userLayoutData = {};
                const contentTarget = sections[i];
                if (contentTarget.style.flexGrow === "0" || contentTarget.style.flexGrow === "1") {
                    userLayoutData = Object.assign(Object.assign({}, userLayoutData), { flexGrow: contentTarget.style.flexGrow, flexBasis: contentTarget.style.flexBasis });
                }
                else {
                    userLayoutData = Object.assign(Object.assign({}, userLayoutData), { flexBasis: contentTarget.style.flexBasis, flexGrow: "-1" });
                }
                sizes.push(userLayoutData);
            }
            this.userSession.SetSession(sizes, mode === "horizontal" ? "horizontal" : "vertical", closeSection);
            return true;
        }
        return false;
    }
    static saveHorizontalSizesToLocalStorage() {
        this.saveSizesToLocalStorage("horizontal");
    }
    static saveVerticalSizesToLocalStorage() {
        this.saveSizesToLocalStorage("vertical");
    }
}
SplitUtils.TOP = "top";
SplitUtils.BOTTOM = "bottom";
SplitUtils.LEFT = "left";
SplitUtils.RIGHT = "right";
SplitUtils.HORIZONTAL = "horizontal";
SplitUtils.VERTICAL = "vertical";
SplitUtils.SECTION_CLASS_HIDE = "a-split-hidden";
SplitUtils.wrapper = null;
SplitUtils.mode = "horizontal";
SplitUtils.modeWrapper = {
    horizontal: null,
    vertical: null,
};
SplitUtils.enableSessionStorage = {
    horizontal: false,
    vertical: false,
};
SplitUtils.cachedMappedSplitPanePosition = {
    horizontal: null,
    vertical: null,
};
export default SplitUtils;
