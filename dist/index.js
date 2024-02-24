var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import "./style/index.css";
import SplitUtils from "./utils/SplitUtils";
import SplitSessionStorage from "./utils/SplitSessionStorage";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import ManageHandleBar from "./helper/ManageHandleBar";
import DragHandle from "./DragHandle/DragHandle";
export default class Split extends React.Component {
    constructor(props) {
        super(props);
        this.TOP = "top";
        this.BOTTOM = "bottom";
        this.LEFT = "left";
        this.RIGHT = "right";
        this.HORIZONTAL = "horizontal";
        this.VERTICAL = "vertical";
        this.state = {
            dragging: false,
        };
        this.breaker = 0;
        this.handleBarLayoutInfo = {
            width: 1,
            afterElementWidth: 16,
            marginLeft: 5,
            marginRight: 5,
        };
        this.onDraggingThrottled = throttle(this.onDragging.bind(this), 16);
        this.onDragEndThrottled = throttle(this.onDragEnd.bind(this), 16);
        this.saveHorizontalSizesToLocalStorageDebounced = debounce(SplitUtils.saveHorizontalSizesToLocalStorage.bind(SplitUtils), 300);
        this.saveVerticalSizesToLocalStorageDebounced = debounce(SplitUtils.saveVerticalSizesToLocalStorage.bind(SplitUtils), 300);
        this.userSession = new SplitSessionStorage();
        this.initDragging = false;
        window.addEventListener("beforeunload", this.saveHorizontalSizesToLocalStorageDebounced);
        window.addEventListener("beforeunload", this.saveVerticalSizesToLocalStorageDebounced);
    }
    componentWillUnmount() {
        this.removeTouchEvent();
        this.removeEvent();
    }
    componentDidMount() {
        const { mode } = this.props;
        SplitUtils.setWrapper(this.warpper, mode, this.props.minSizes, this.props.enableSessionStorage);
        this.setInitialSizes();
    }
    checkTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
    addTouchEvent() {
        if (this.checkTouchDevice()) {
            window.addEventListener("touchmove", this.onDraggingThrottled, {
                passive: false,
            });
            window.addEventListener("touchend", this.onDragEndThrottled, {
                passive: false,
            });
        }
    }
    removeTouchEvent() {
        if (this.checkTouchDevice()) {
            window.removeEventListener("touchmove", this.onDraggingThrottled, false);
            window.removeEventListener("touchcancel", this.onDragEndThrottled, false);
        }
    }
    removeEvent() {
        window.removeEventListener("mousemove", this.onDraggingThrottled, false);
        window.removeEventListener("mouseup", this.onDragEndThrottled, false);
        window.removeEventListener("beforeunload", this.saveHorizontalSizesToLocalStorageDebounced, false);
        window.removeEventListener("beforeunload", this.saveVerticalSizesToLocalStorageDebounced, false);
    }
    setInitialSizes() {
        var _a;
        const { mode, initialSizes } = this.props;
        const sections = (_a = this.warpper) === null || _a === void 0 ? void 0 : _a.children;
        if (sections && initialSizes && initialSizes.length > 0) {
            const userLayoutDefault = this.userSession.GetSession(mode);
            let collapsedcounter = 0;
            let sectionCounter = 1;
            for (let i = 0; i < initialSizes.length; i++) {
                const size = initialSizes[i];
                const sectionIndex = i * 2;
                if (sections.length > sectionIndex) {
                    const contentTarget = sections[sectionIndex];
                    if (mode === this.HORIZONTAL && contentTarget) {
                        if (userLayoutDefault && userLayoutDefault.length > 0 && this.props.enableSessionStorage) {
                            if (userLayoutDefault[i]["flexGrow"] === "-1") {
                                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
                            }
                            else {
                                if (userLayoutDefault[i]["flexGrow"] === "0") {
                                    contentTarget.classList.add("a-split-hidden");
                                }
                                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
                                contentTarget.style.flexGrow = userLayoutDefault[i]["flexGrow"];
                            }
                        }
                        else {
                            const totalHandleBarLayoutValue = (this.handleBarLayoutInfo.afterElementWidth +
                                this.handleBarLayoutInfo.marginLeft +
                                this.handleBarLayoutInfo.marginRight +
                                this.handleBarLayoutInfo.width) *
                                SplitUtils.totalHandleCount(this.HORIZONTAL);
                            const sizeToReduce = totalHandleBarLayoutValue / SplitUtils.totalPaneCount(this.HORIZONTAL);
                            if (sizeToReduce > -1) {
                                if (size && size.includes("%")) {
                                    contentTarget.style.flexBasis = `${parseFloat(size) - SplitUtils.pixelToPercentage(sizeToReduce, this.props.width)}%`;
                                }
                                else {
                                    contentTarget.style.flexBasis = `${parseFloat(size) - sizeToReduce}px`;
                                }
                            }
                            else {
                                contentTarget.style.flexBasis = `${size}`;
                            }
                            if (collapsedcounter > 0) {
                                contentTarget.style.flexGrow = "1";
                                collapsedcounter = 0;
                            }
                            if ((this.props.collapsed[i] || false) && collapsedcounter === 0) {
                                contentTarget.style.flexGrow = "0";
                                contentTarget.classList.add("a-split-hidden");
                                collapsedcounter++;
                            }
                        }
                        contentTarget.setAttribute("min-size", `${this.props.minSizes[i] || 0}`);
                        contentTarget.setAttribute("max-size", `${this.props.maxSizes[i] || 100}`);
                        ManageHandleBar.removeHandleIconOnClose(sectionCounter++, SplitUtils.modeWrapper, SplitUtils.cachedMappedSplitPanePosition, "horizontal");
                    }
                    else if (mode === this.VERTICAL && contentTarget) {
                        if (userLayoutDefault && userLayoutDefault.length > 0 && this.props.enableSessionStorage) {
                            if (userLayoutDefault[i]["flexGrow"] === "-1") {
                                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
                            }
                            else {
                                if (userLayoutDefault[i]["flexGrow"] === "0") {
                                    contentTarget.classList.add("a-split-hidden");
                                }
                                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
                                contentTarget.style.flexGrow = userLayoutDefault[i]["flexGrow"];
                            }
                        }
                        else {
                            const totalHandleBarLayoutValue = (this.handleBarLayoutInfo.afterElementWidth +
                                this.handleBarLayoutInfo.marginLeft +
                                this.handleBarLayoutInfo.marginRight +
                                this.handleBarLayoutInfo.width) *
                                SplitUtils.totalHandleCount(this.VERTICAL);
                            const sizeToReduce = totalHandleBarLayoutValue / SplitUtils.totalPaneCount(this.VERTICAL);
                            if (sizeToReduce > -1) {
                                if (size && size.includes("%")) {
                                    contentTarget.style.flexBasis = `${parseFloat(size) - SplitUtils.pixelToPercentage(sizeToReduce, this.props.height)}%`;
                                }
                                else {
                                    contentTarget.style.flexBasis = `${parseFloat(size) - sizeToReduce}px`;
                                }
                            }
                            else {
                                contentTarget.style.flexBasis = `${size}`;
                            }
                            if (collapsedcounter > 0) {
                                contentTarget.style.flexGrow = "1";
                                collapsedcounter = 0;
                            }
                            if ((this.props.collapsed[i] || false) && collapsedcounter === 0) {
                                contentTarget.style.flexGrow = "0";
                                contentTarget.classList.add("a-split-hidden");
                                collapsedcounter++;
                            }
                        }
                        contentTarget.setAttribute("min-size", `${this.props.minSizes[i] || 0}`);
                        contentTarget.setAttribute("max-size", `${this.props.maxSizes[i] || 100}`);
                        ManageHandleBar.removeHandleIconOnClose(sectionCounter++, SplitUtils.modeWrapper, SplitUtils.cachedMappedSplitPanePosition, "vertical");
                    }
                }
            }
            let openSectionCounter = 0;
            if (sections && sections.length > 0) {
                for (let pane = 0; pane < initialSizes.length; pane++) {
                    if (SplitUtils.isSectionOpen(pane + 1, mode)) {
                        openSectionCounter++;
                    }
                }
            }
            if (openSectionCounter === 1 && !this.props.collapsed[0]) {
                if (sections[0]) {
                    sections[0].style.flexGrow = "1";
                }
            }
            if (userLayoutDefault && userLayoutDefault.length === 0) {
                if (mode === this.HORIZONTAL) {
                    SplitUtils.saveHorizontalSizesToLocalStorage();
                }
                else {
                    SplitUtils.saveVerticalSizesToLocalStorage();
                }
            }
        }
    }
    setResizingLayout(nextTarget, prevTarget, mode) {
        const referenceWidth = mode === "horizontal" ? this.props.width : this.props.height;
        if (this.prevToPrev && this.prevToPrev.classList.contains("a-split-hidden")) {
            let prevTargetVal = -1;
            let pixel = false;
            if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("%")) {
                if (prevTarget.style.flexGrow === "") {
                    const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis) < 0;
                    if (limit)
                        return;
                    if (nextTarget.style.flexBasis.includes("px")) {
                        nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis)}px`;
                    }
                    else {
                        nextTarget.style.flexBasis = `${this.nextSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)}%`;
                    }
                    prevTarget.style.flexBasis = `${this.preSize}%`;
                }
                else {
                    prevTargetVal = this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
                }
            }
            else if (this.prevToPrev.style.flexBasis.includes("%") && prevTarget.style.flexBasis.includes("px")) {
                pixel = true;
                if (prevTarget.style.flexGrow === "") {
                    const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
                        SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth) <
                        0;
                    if (limit)
                        return;
                    if (nextTarget.style.flexBasis.includes("px")) {
                        nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
                            SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)}px`;
                    }
                    else {
                        nextTarget.style.flexBasis = `${this.nextSize - parseFloat(this.prevToPrev.style.flexBasis)}%`;
                    }
                    prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
                }
                else {
                    prevTargetVal =
                        SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
                            SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
                }
            }
            else if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("px")) {
                pixel = true;
                if (prevTarget.style.flexGrow === "") {
                    const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis) < 0;
                    if (limit)
                        return;
                    if (nextTarget.style.flexBasis.includes("px")) {
                        nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis)}px`;
                    }
                    else {
                        nextTarget.style.flexBasis = `${this.nextSize - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)}%`;
                    }
                    prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
                }
                else {
                    prevTargetVal = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis);
                }
            }
            else {
                if (prevTarget.style.flexGrow === "") {
                    const limit = this.nextSize - parseFloat(this.prevToPrev.style.flexBasis) < 0;
                    if (limit)
                        return;
                    if (nextTarget.style.flexBasis.includes("px")) {
                        nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
                            SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)}px`;
                    }
                    else {
                        nextTarget.style.flexBasis = `${this.nextSize - parseFloat(this.prevToPrev.style.flexBasis)}%`;
                    }
                    prevTarget.style.flexBasis = `${this.preSize}%`;
                }
                else {
                    prevTargetVal = this.preSize - parseFloat(this.prevToPrev.style.flexBasis);
                }
            }
            if (prevTargetVal >= 0) {
                prevTarget.style.flexBasis = `${prevTargetVal}${pixel ? "px" : "%"}`;
                if (nextTarget.style.flexBasis.includes("px")) {
                    nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
                }
                else {
                    nextTarget.style.flexBasis = `${this.nextSize}%`;
                }
            }
        }
        else if (this.nextToNext && this.nextToNext.classList.contains("a-split-hidden")) {
            let nextTargetVal = -1;
            let pixel = false;
            if (this.nextToNext.style.flexBasis.includes("px") && nextTarget.style.flexBasis.includes("%")) {
                if (nextTarget.style.flexGrow === "") {
                    const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis) < 0;
                    if (limit)
                        return;
                    if (prevTarget.style.flexBasis.includes("px")) {
                        prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis)}px`;
                    }
                    else {
                        prevTarget.style.flexBasis = `${this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)}%`;
                    }
                    nextTarget.style.flexBasis = `${this.nextSize}%`;
                }
                else {
                    nextTargetVal = this.nextSize - SplitUtils.pixelToPercentage(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
                }
            }
            else if (this.nextToNext.style.flexBasis.includes("%") && nextTarget.style.flexBasis.includes("px")) {
                pixel = true;
                if (nextTarget.style.flexGrow === "") {
                    const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
                        SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth) <
                        0;
                    if (limit)
                        return;
                    if (prevTarget.style.flexBasis.includes("px")) {
                        prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
                            SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)}px`;
                    }
                    else {
                        prevTarget.style.flexBasis = `${this.preSize - parseFloat(this.nextToNext.style.flexBasis)}%`;
                    }
                    nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
                }
                else {
                    nextTargetVal =
                        SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
                            SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
                }
            }
            else if (this.nextToNext.style.flexBasis.includes("px") && nextTarget.style.flexBasis.includes("px")) {
                pixel = true;
                if (nextTarget.style.flexGrow === "") {
                    const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis) < 0;
                    if (limit)
                        return;
                    if (prevTarget.style.flexBasis.includes("px")) {
                        prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis)}px`;
                    }
                    else {
                        prevTarget.style.flexBasis = `${this.preSize - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)}%`;
                    }
                    nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
                }
                else {
                    nextTargetVal = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis);
                }
            }
            else {
                if (nextTarget.style.flexGrow === "") {
                    const limit = this.preSize - parseFloat(this.nextToNext.style.flexBasis) < 0;
                    if (limit)
                        return;
                    if (prevTarget.style.flexBasis.includes("px")) {
                        prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
                            SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)}px`;
                    }
                    else {
                        prevTarget.style.flexBasis = `${this.preSize - parseFloat(this.nextToNext.style.flexBasis)}%`;
                    }
                    nextTarget.style.flexBasis = `${this.nextSize}%`;
                }
                else {
                    nextTargetVal = this.nextSize - parseFloat(this.nextToNext.style.flexBasis);
                }
            }
            if (nextTargetVal >= 0) {
                if (prevTarget.style.flexBasis.includes("px")) {
                    prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
                }
                else {
                    prevTarget.style.flexBasis = `${this.preSize}%`;
                }
                nextTarget.style.flexBasis = `${nextTargetVal}${pixel ? "px" : "%"}`;
            }
        }
        else {
            if (prevTarget.style.flexBasis.includes("px")) {
                prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
            }
            else {
                prevTarget.style.flexBasis = `${this.preSize}%`;
            }
            if (nextTarget.style.flexBasis.includes("px")) {
                nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
            }
            else {
                nextTarget.style.flexBasis = `${this.nextSize}%`;
            }
        }
    }
    onMouseDown(paneNumber, env) {
        if (!env.target || !this.warpper) {
            return;
        }
        if (env.cancelable && !this.checkTouchDevice()) {
            env.preventDefault();
        }
        const clientX = "touches" in env ? env.touches[0].clientX : env.clientX;
        const clientY = "touches" in env ? env.touches[0].clientY : env.clientY;
        this.paneNumber = paneNumber;
        this.startX = clientX;
        this.startY = clientY;
        this.move = true;
        if (env.target.classList.contains("a-splitter-handlebar-icon") ||
            env.target.classList.contains("a-splitter-collapse-icon")) {
            this.target = env.target.parentElement;
        }
        else {
            this.target = env.target;
        }
        const prevTarget = this.target.previousElementSibling;
        const nextTarget = this.target.nextElementSibling;
        this.boxWidth = this.warpper.offsetWidth;
        this.boxHeight = this.warpper.offsetHeight;
        if (prevTarget) {
            this.preWidth = prevTarget.offsetWidth;
            this.preHeight = prevTarget.offsetHeight;
        }
        if (nextTarget) {
            this.nextWidth = nextTarget.offsetWidth;
            this.nextHeight = nextTarget.offsetHeight;
        }
        if (prevTarget && prevTarget.previousElementSibling && prevTarget.previousElementSibling.previousElementSibling)
            this.prevToPrev = prevTarget.previousElementSibling.previousElementSibling;
        if (nextTarget && nextTarget.nextElementSibling && nextTarget.nextElementSibling.nextElementSibling)
            this.nextToNext = nextTarget.nextElementSibling.nextElementSibling;
        this.addTouchEvent();
        window.addEventListener("mouseup", this.onDragEndThrottled, false);
        window.addEventListener("mousemove", this.onDraggingThrottled);
        this.setState({ dragging: true });
    }
    onDragging(env) {
        if (env.cancelable && !this.checkTouchDevice()) {
            env.preventDefault();
        }
        if (!this.move) {
            return;
        }
        if (!this.state.dragging) {
            this.setState({ dragging: true });
        }
        const { mode, onDragging } = this.props;
        const nextTarget = this.target.nextElementSibling;
        const prevTarget = this.target.previousElementSibling;
        if (nextTarget && prevTarget) {
            if (nextTarget.classList.contains("a-split-hidden") || prevTarget.classList.contains("a-split-hidden"))
                return;
        }
        const clientX = "touches" in env ? env.touches[0].clientX : env.clientX;
        const clientY = "touches" in env ? env.touches[0].clientY : env.clientY;
        const x = clientX - this.startX;
        const y = clientY - this.startY;
        this.preSize = 0;
        this.nextSize = 0;
        const updateSizes = () => {
            if (mode === this.HORIZONTAL) {
                this.preSize = this.preWidth + x > -1 ? this.preWidth + x : 0;
                this.nextSize = this.nextWidth - x > -1 ? this.nextWidth - x : 0;
                if (this.preSize === 0 || this.nextSize === 0) {
                    return;
                }
                if (Math.abs(this.preSize - this.preWidth) <= 1)
                    return;
                if (Math.abs(this.nextSize - this.nextWidth) <= 1)
                    return;
                this.preSize = (this.preSize / this.boxWidth >= 1 ? 1 : this.preSize / this.boxWidth) * 100;
                this.nextSize = (this.nextSize / this.boxWidth >= 1 ? 1 : this.nextSize / this.boxWidth) * 100;
                if (prevTarget && nextTarget) {
                    const minPrevSize = prevTarget.getAttribute("min-size");
                    const minNextSize = nextTarget.getAttribute("min-size");
                    if (minPrevSize && this.preSize <= parseInt(minPrevSize))
                        return;
                    if (minNextSize && this.nextSize <= parseInt(minNextSize))
                        return;
                }
                if (prevTarget && nextTarget) {
                    const maxPrevSize = prevTarget.getAttribute("max-size");
                    const maxNextSize = nextTarget.getAttribute("max-size");
                    if (maxPrevSize && this.preSize >= parseInt(maxPrevSize))
                        return;
                    if (maxNextSize && this.nextSize >= parseInt(maxNextSize))
                        return;
                }
                if (prevTarget && nextTarget) {
                    this.setResizingLayout(nextTarget, prevTarget, this.HORIZONTAL);
                }
            }
            if (mode === this.VERTICAL && this.preHeight + y > -1 && this.nextHeight - y > -1) {
                this.preSize = this.preHeight + y > -1 ? this.preHeight + y : 0;
                this.nextSize = this.nextHeight - y > -1 ? this.nextHeight - y : 0;
                this.preSize = (this.preSize / this.boxHeight >= 1 ? 1 : this.preSize / this.boxHeight) * 100;
                this.nextSize = (this.nextSize / this.boxHeight >= 1 ? 1 : this.nextSize / this.boxHeight) * 100;
                if (this.preSize === 0 || this.nextSize === 0) {
                    return;
                }
                if (Math.abs(this.preSize - this.preHeight) <= 1)
                    return;
                if (Math.abs(this.nextSize - this.nextHeight) <= 1)
                    return;
                if (prevTarget && nextTarget) {
                    const minPrevSize = prevTarget.getAttribute("min-size");
                    const minNextSize = nextTarget.getAttribute("min-size");
                    if (minPrevSize && this.preSize <= parseInt(minPrevSize))
                        return;
                    if (minNextSize && this.nextSize <= parseInt(minNextSize))
                        return;
                }
                if (prevTarget && nextTarget) {
                    const maxPrevSize = prevTarget.getAttribute("max-size");
                    const maxNextSize = nextTarget.getAttribute("max-size");
                    if (maxPrevSize && this.preSize >= parseInt(maxPrevSize))
                        return;
                    if (maxNextSize && this.nextSize >= parseInt(maxNextSize))
                        return;
                }
                if (prevTarget && nextTarget) {
                    this.setResizingLayout(nextTarget, prevTarget, this.VERTICAL);
                }
            }
            this.initDragging = true;
            onDragging && onDragging(this.preSize, this.nextSize, this.paneNumber);
        };
        const animateUpdateSize = updateSizes;
        function animate() {
            animateUpdateSize();
        }
        requestAnimationFrame(animate.bind(this));
    }
    onDragEnd() {
        const { onDragEnd } = this.props;
        this.move = false;
        onDragEnd && onDragEnd(this.preSize, this.nextSize, this.paneNumber);
        this.removeTouchEvent();
        this.removeEvent();
        this.setState({ dragging: false });
        if (this.props.enableSessionStorage && this.initDragging) {
            if (this.props.mode === this.HORIZONTAL) {
                this.saveHorizontalSizesToLocalStorageDebounced();
            }
            else {
                this.saveVerticalSizesToLocalStorageDebounced();
            }
            this.initDragging = false;
        }
    }
    render() {
        var _a;
        const _b = this.props, { prefixCls, childPrefixCls, className, children, mode, visiable, visible = (_a = this.props.visible) !== null && _a !== void 0 ? _a : this.props.visiable, renderBar, lineBar, disable, onDragEnd, onDragging } = _b, other = __rest(_b, ["prefixCls", "childPrefixCls", "className", "children", "mode", "visiable", "visible", "renderBar", "lineBar", "disable", "onDragEnd", "onDragging"]);
        const { dragging } = this.state;
        const cls = [prefixCls, className, `${prefixCls}-${mode}`, dragging ? "dragging" : null].filter(Boolean).join(" ").trim();
        const child = React.Children.toArray(children);
        const { initialSizes, minSizes, maxSizes, enableSessionStorage, collapsed, height, width } = other, neededProps = __rest(other, ["initialSizes", "minSizes", "maxSizes", "enableSessionStorage", "collapsed", "height", "width"]);
        return (_jsx("div", Object.assign({ className: cls }, neededProps, { ref: (node) => (this.warpper = node), style: { height: height, width: width } }, { children: React.Children.map(child, (element, idx) => {
                const props = Object.assign({}, element.props, {
                    className: [childPrefixCls, `${prefixCls}-pane`, "a-split-scrollable", element.props.className].filter(Boolean).join(" ").trim(),
                    style: Object.assign({}, element.props.style),
                });
                const visibleBar = visible === true || (visible && visible.includes((idx + 1))) || false;
                const barProps = {
                    className: [`${prefixCls}-bar`].filter(Boolean).join(" ").trim(),
                };
                if (idx !== 0 && (lineBar === true || (lineBar && lineBar.includes(idx)))) {
                    barProps.className = [barProps.className, lineBar ? `${prefixCls}-line-bar` : null].filter(Boolean).join(" ").trim();
                }
                if (idx !== 0 && (disable === true || (disable && disable.includes(idx)))) {
                    barProps.className = [barProps.className, disable ? "a-split-handle-disable" : null].filter(Boolean).join(" ").trim();
                }
                let BarCom = null;
                if (idx !== 0 && visibleBar && renderBar) {
                    BarCom = renderBar(Object.assign(Object.assign({}, barProps), { onMouseDown: this.onMouseDown.bind(this, idx + 1), onTouchStart: this.onMouseDown.bind(this, idx + 1) }), idx);
                }
                else if (idx !== 0 && visibleBar) {
                    BarCom = (_jsx(DragHandle, { props: barProps, mode: this.props.mode, onMouseDown: this.onMouseDown.bind(this, idx + 1), onTouchStart: this.onMouseDown.bind(this, idx + 1), position: idx }, idx));
                }
                return (_jsxs(React.Fragment, { children: [BarCom, React.cloneElement(_jsx("div", { children: element }), Object.assign({}, props))] }, idx));
            }) })));
    }
}
Split.defaultProps = {
    prefixCls: "a-split",
    childPrefixCls: "a-split-control-pane",
    visiable: true,
    mode: "horizontal",
    initialSizes: [],
    minSizes: [],
    maxSizes: [],
    enableSessionStorage: false,
    collapsed: [],
    height: "600px",
    width: "600px",
};
