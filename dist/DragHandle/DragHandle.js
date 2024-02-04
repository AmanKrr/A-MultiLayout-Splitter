import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../style/DragHandle.css";
import SplitUtils from "../utils/SplitUtils";
function DragHandle({ mode, onMouseDown, onTouchStart, props, position, }) {
    function handleTopAndLeftArrowClick(mode, position, direction) {
        if (SplitUtils.isSectionOpen(position + 1, mode) &&
            SplitUtils.isSectionOpen(position, mode)) {
            SplitUtils.closeSplitter(position, mode, direction);
        }
        else if (!SplitUtils.isSectionOpen(position + 1, mode) &&
            SplitUtils.isSectionOpen(position, mode)) {
            SplitUtils.openSplitter(position + 1, mode, direction);
        }
        else {
            SplitUtils.openSplitter(position, mode, direction);
        }
    }
    function handleBottomAndRightArrowClick(mode, position, direction) {
        if (SplitUtils.isSectionOpen(position + 1, mode) &&
            SplitUtils.isSectionOpen(position, mode)) {
            SplitUtils.closeSplitter(position + 1, mode, direction);
        }
        else if (SplitUtils.isSectionOpen(position + 1, mode) &&
            !SplitUtils.isSectionOpen(position, mode)) {
            SplitUtils.openSplitter(position, mode, direction);
        }
        else {
            SplitUtils.openSplitter(position, mode, direction);
        }
    }
    function handleMouseOverParent(e) {
        var _a, _b;
        (_a = e.target.firstChild) === null || _a === void 0 ? void 0 : _a.classList.remove("a-icon-hide");
        (_b = e.target.lastChild) === null || _b === void 0 ? void 0 : _b.classList.remove("a-icon-hide");
    }
    function handleMouseOverChild(e) {
        var _a, _b;
        (_a = e.target.parentElement
            .firstChild) === null || _a === void 0 ? void 0 : _a.classList.remove("a-icon-hide");
        (_b = e.target.parentElement
            .lastChild) === null || _b === void 0 ? void 0 : _b.classList.remove("a-icon-hide");
    }
    function handleMouseOutParent(e) {
        var _a, _b;
        (_a = e.target.firstChild) === null || _a === void 0 ? void 0 : _a.classList.add("a-icon-hide");
        (_b = e.target.lastChild) === null || _b === void 0 ? void 0 : _b.classList.add("a-icon-hide");
    }
    function handleMouseOutChild(e) {
        var _a, _b;
        (_a = e.target.parentElement
            .firstChild) === null || _a === void 0 ? void 0 : _a.classList.add("a-icon-hide");
        (_b = e.target.parentElement
            .lastChild) === null || _b === void 0 ? void 0 : _b.classList.add("a-icon-hide");
    }
    return (_jsxs("div", Object.assign({}, props, { className: `splitterHandleBarContainer-` +
            mode +
            ` splitterHandleBarContainer-` +
            mode +
            "-" +
            position, onMouseDown: onMouseDown, onTouchStart: onTouchStart, onMouseOver: handleMouseOverParent, onMouseOut: handleMouseOutParent }, { children: [_jsx("button", { className: `a-splitter-collapse-icon splitter-${mode}-${mode === "horizontal" ? "left" : "top"}-icon a-icon-hide`, onClick: () => {
                    if (mode === "horizontal") {
                        handleTopAndLeftArrowClick("horizontal", position, "left");
                    }
                    else {
                        handleTopAndLeftArrowClick("vertical", position, "top");
                    }
                }, onMouseOver: handleMouseOverChild, onMouseOut: handleMouseOutChild }), _jsx("div", { className: "a-splitter-handlebar-icon", onMouseOver: handleMouseOverChild, onMouseOut: handleMouseOutChild }), _jsx("button", { className: `a-splitter-collapse-icon splitter-${mode}-${mode === "horizontal" ? "right" : "bottom"}-icon a-icon-hide`, onClick: () => {
                    // here position + 1 is the section which we want to close or open using right arrow
                    if (mode === "horizontal") {
                        handleBottomAndRightArrowClick("horizontal", position, "right");
                    }
                    else {
                        handleBottomAndRightArrowClick("vertical", position, "bottom");
                    }
                }, onMouseOver: handleMouseOverChild, onMouseOut: handleMouseOutChild })] })));
}
export default DragHandle;
