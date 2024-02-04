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
/**
 * Split component for creating resizable split panes.
 */
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
        if (this.props.initialSizes && this.props.initialSizes.length > 0) {
            const totalInitialSize = this.props.initialSizes.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
            if (totalInitialSize !== 100) {
                throw new Error("Initial Size sum is not euqal to 100.");
            }
            if (this.props.minSizes &&
                this.props.minSizes.length > 0 &&
                this.props.minSizes.length === this.props.initialSizes.length) {
                for (let size = 0; size < this.props.minSizes.length; size++) {
                    if (this.props.minSizes[size] > this.props.initialSizes[size]) {
                        throw new Error("Initial Size should not be less than minSizes");
                    }
                }
            }
            if (this.props.maxSizes &&
                this.props.maxSizes.length > 0 &&
                this.props.maxSizes.length === this.props.initialSizes.length) {
                for (let size = 0; size < this.props.maxSizes.length; size++) {
                    if (this.props.maxSizes[size] < this.props.initialSizes[size]) {
                        throw new Error("Initial Size should not be greater than maxSizes");
                    }
                }
            }
            if (this.props.maxSizes &&
                this.props.maxSizes.length > 0 &&
                this.props.minSizes &&
                this.props.minSizes.length > 0 &&
                this.props.initialSizes &&
                this.props.initialSizes.length > 0 &&
                this.props.maxSizes.length === this.props.minSizes.length &&
                this.props.maxSizes.length === this.props.initialSizes.length &&
                this.props.minSizes.length === this.props.initialSizes.length) {
                for (let size = 0; size < this.props.maxSizes.length; size++) {
                    if (this.props.maxSizes[size] < this.props.minSizes[size]) {
                        throw new Error("maxSizes should not be less than minSizes");
                    }
                    if (this.props.initialSizes[size] <= 0 &&
                        this.props.initialSizes[size] >= 100) {
                        throw new Error("Initial sizes should be in range of 0 to 100.");
                    }
                }
            }
        }
        // Throttle the dragging and drag end functions to control the frequency of execution
        this.onDraggingThrottled = throttle(this.onDragging.bind(this), 16);
        this.onDragEndThrottled = throttle(this.onDragEnd.bind(this), 16);
        // Explicitly bind and debounce the session storage update
        this.saveSizesToLocalStorageDebounced = debounce(SplitUtils.saveSizesToLocalStorage.bind(SplitUtils), 300);
        // Initialize session storage utility and dragging flag
        this.userSession = new SplitSessionStorage();
        this.initDragging = false;
    }
    /**
     * Cleanup: Remove event listeners to prevent memory leaks.
     */
    componentWillUnmount() {
        this.removeTouchEvent();
        this.removeEvent();
    }
    /**
     * Initialization: Set up initial sizes and wrapper based on the provided mode.
     */
    componentDidMount() {
        const { mode } = this.props;
        SplitUtils.setWrapper(this.warpper, mode, this.props.minSizes, this.props.enableSessionStorage);
        // Set initial sizes when the component mounts
        this.setInitialSizes();
    }
    checkTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
    /**
     * add touch event listeners.
     */
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
    /**
     * Remove mouse move and mouse up event listeners.
     */
    removeTouchEvent() {
        if (this.checkTouchDevice()) {
            window.removeEventListener("touchmove", this.onDraggingThrottled, false);
            window.removeEventListener("touchcancel", this.onDragEndThrottled, false);
        }
    }
    /**
     * Remove mouse move and mouse up event listeners.
     */
    removeEvent() {
        window.removeEventListener("mousemove", this.onDraggingThrottled, false);
        window.removeEventListener("mouseup", this.onDragEndThrottled, false);
        window.removeEventListener("beforeunload", this.saveSizesToLocalStorageDebounced, false);
    }
    /**
     * Set initial sizes for the panes.
     */
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
                const sectionIndex = i * 2; // Each section has a content and separator element
                if (sections.length > sectionIndex) {
                    const contentTarget = sections[sectionIndex];
                    if (mode === this.HORIZONTAL && contentTarget) {
                        if (userLayoutDefault &&
                            userLayoutDefault.length > 0 &&
                            this.props.enableSessionStorage) {
                            if (userLayoutDefault[i]["flexGrow"] === "-1") {
                                contentTarget.style.flexBasis =
                                    userLayoutDefault[i]["flexBasis"];
                            }
                            else {
                                if (userLayoutDefault[i]["flexGrow"] === "0") {
                                    contentTarget.classList.add("a-split-hidden");
                                }
                                contentTarget.style.flexBasis =
                                    userLayoutDefault[i]["flexBasis"];
                                contentTarget.style.flexGrow = userLayoutDefault[i]["flexGrow"];
                            }
                        }
                        else {
                            contentTarget.style.flexBasis = `${size}%`;
                            if (collapsedcounter > 0) {
                                contentTarget.style.flexGrow = "1";
                                collapsedcounter = 0;
                            }
                            if (this.props.collapsed[i] && collapsedcounter === 0) {
                                contentTarget.style.flexGrow = "0";
                                contentTarget.classList.add("a-split-hidden");
                                collapsedcounter++;
                            }
                        }
                        contentTarget.setAttribute("min-size", `${this.props.minSizes[i]}`);
                        contentTarget.setAttribute("max-size", `${this.props.maxSizes[i]}`);
                        ManageHandleBar.removeHandleIconOnClose(sectionCounter++, SplitUtils.modeWrapper, SplitUtils.cachedMappedSplitPanePosition, "horizontal");
                        // contentTarget.style.overflow = `hidden`;
                    }
                    else if (mode === this.VERTICAL && contentTarget) {
                        if (userLayoutDefault &&
                            userLayoutDefault.length > 0 &&
                            this.props.enableSessionStorage) {
                            if (userLayoutDefault[i]["flexGrow"] === "-1") {
                                contentTarget.style.flexBasis =
                                    userLayoutDefault[i]["flexBasis"];
                            }
                            else {
                                if (userLayoutDefault[i]["flexGrow"] === "0") {
                                    contentTarget.classList.add("a-split-hidden");
                                }
                                contentTarget.style.flexBasis =
                                    userLayoutDefault[i]["flexBasis"];
                                contentTarget.style.flexGrow = userLayoutDefault[i]["flexGrow"];
                            }
                        }
                        else {
                            contentTarget.style.flexBasis = `${size}%`;
                            if (collapsedcounter > 0) {
                                contentTarget.style.flexGrow = "1";
                                collapsedcounter = 0;
                            }
                            if (this.props.collapsed[i] && collapsedcounter === 0) {
                                contentTarget.style.flexGrow = "0";
                                contentTarget.classList.add("a-split-hidden");
                                collapsedcounter++;
                            }
                        }
                        contentTarget.setAttribute("min-size", `${this.props.minSizes[i]}`);
                        contentTarget.setAttribute("max-size", `${this.props.maxSizes[i]}`);
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
                SplitUtils.saveSizesToLocalStorage(mode);
            }
        }
    }
    /**
     * Handle mouse down event to start dragging.
     * @param paneNumber - The number of the pane being dragged.
     * @param env - MouseEvent.
     */
    onMouseDown(paneNumber, env) {
        if (!env.target || !this.warpper) {
            return;
        }
        // prevent default funcationality on mouse/touch clicked
        if (env.cancelable && !this.checkTouchDevice()) {
            // preventDefault can not be called for touch event because passive is by default true.
            // since passive as false is not a good choice if there is very strong reason to do so.
            env.preventDefault();
        }
        // Use type assertion to handle both MouseEvent and TouchEvent
        const clientX = "touches" in env
            ? env.touches[0].clientX
            : env.clientX;
        const clientY = "touches" in env
            ? env.touches[0].clientY
            : env.clientY;
        this.paneNumber = paneNumber;
        this.startX = clientX;
        this.startY = clientY;
        this.move = true;
        if (env.target.classList.contains("a-splitter-handlebar-icon") ||
            env.target.classList.contains("a-splitter-collapse-icon")) {
            this.target = env.target
                .parentElement;
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
        this.addTouchEvent();
        window.addEventListener("mouseup", this.onDragEndThrottled, false);
        window.addEventListener("mousemove", this.onDraggingThrottled);
        this.setState({ dragging: true });
    }
    /**
     * Handle mouse dragging to resize panes.
     * @param env - MouseEvent.
     */
    onDragging(env) {
        // preventing default functionality on dragging
        if (env.cancelable && !this.checkTouchDevice()) {
            // preventDefault can not be called for touch event because passive is by default true.
            // since passive as false is not a good choice if there is very strong reason to do so.
            env.preventDefault();
        }
        if (!this.move) {
            return;
        }
        if (!this.state.dragging) {
            this.setState({ dragging: true });
        }
        const { mode, onDragging } = this.props;
        const delta = 0.9;
        const nextTarget = this.target.nextElementSibling;
        const prevTarget = this.target.previousElementSibling;
        if (nextTarget && prevTarget) {
            if (nextTarget.classList.contains("a-split-hidden") ||
                prevTarget.classList.contains("a-split-hidden"))
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
                this.preSize =
                    (this.preSize / this.boxWidth >= 1
                        ? 1
                        : this.preSize / this.boxWidth) * 100;
                this.nextSize =
                    (this.nextSize / this.boxWidth >= 1
                        ? 1
                        : this.nextSize / this.boxWidth) * 100;
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
                    prevTarget.style.flexBasis = `${this.preSize + delta}%`;
                    nextTarget.style.flexBasis = `${this.nextSize + delta}%`;
                }
            }
            if (mode === this.VERTICAL &&
                this.preHeight + y > -1 &&
                this.nextHeight - y > -1) {
                this.preSize = this.preHeight + y > -1 ? this.preHeight + y : 0;
                this.nextSize = this.nextHeight - y > -1 ? this.nextHeight - y : 0;
                if (Math.abs(this.preSize - this.preWidth) <= 1)
                    return;
                if (Math.abs(this.nextSize - this.nextWidth) <= 1)
                    return;
                this.preSize =
                    (this.preSize / this.boxHeight >= 1
                        ? 1
                        : this.preSize / this.boxHeight) * 100;
                this.nextSize =
                    (this.nextSize / this.boxHeight >= 1
                        ? 1
                        : this.nextSize / this.boxHeight) * 100;
                if (this.preSize === 0 || this.nextSize === 0) {
                    return;
                }
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
                    // prevTarget.style.height = `${this.preSize}%`;
                    // nextTarget.style.height = `${this.nextSize}%`;
                    prevTarget.style.flexBasis = `${this.preSize}%`;
                    nextTarget.style.flexBasis = `${this.nextSize}%`;
                }
            }
            this.initDragging = true;
            onDragging && onDragging(this.preSize, this.nextSize, this.paneNumber);
        };
        const animateUpdateSize = updateSizes;
        function animate() {
            animateUpdateSize();
            // calling recursively is good for maintaing repaintaing sync
            // but it causing issue while dragging. Pending check. Temporary fix to not to call it here recursively.
            // requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate.bind(this));
    }
    /**
     * Handle mouse up event to end dragging.
     */
    onDragEnd() {
        const { onDragEnd } = this.props;
        this.move = false;
        onDragEnd && onDragEnd(this.preSize, this.nextSize, this.paneNumber);
        this.removeTouchEvent();
        this.removeEvent();
        this.setState({ dragging: false });
        if (this.props.mode === "horizontal" &&
            this.props.enableSessionStorage &&
            this.initDragging) {
            this.saveSizesToLocalStorageDebounced();
            this.initDragging = false;
        }
    }
    render() {
        var _a;
        const _b = this.props, { prefixCls, className, children, mode, visiable, visible = (_a = this.props.visible) !== null && _a !== void 0 ? _a : this.props.visiable, renderBar, lineBar, disable, onDragEnd, onDragging } = _b, other = __rest(_b, ["prefixCls", "className", "children", "mode", "visiable", "visible", "renderBar", "lineBar", "disable", "onDragEnd", "onDragging"]);
        const { dragging } = this.state;
        // Generate CSS classes based on component state
        const cls = [
            prefixCls,
            className,
            `${prefixCls}-${mode}`,
            dragging ? "dragging" : null,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();
        const child = React.Children.toArray(children);
        // Extract needed props from the remaining props
        const { initialSizes, minSizes, maxSizes, enableSessionStorage, collapsed } = other, neededProps = __rest(other, ["initialSizes", "minSizes", "maxSizes", "enableSessionStorage", "collapsed"]);
        return (_jsx("div", Object.assign({ className: cls }, neededProps, { ref: (node) => (this.warpper = node) }, { children: React.Children.map(child, (element, idx) => {
                const props = Object.assign({}, element.props, {
                    className: [`${prefixCls}-pane`, element.props.className]
                        .filter(Boolean)
                        .join(" ")
                        .trim(),
                    style: Object.assign({}, element.props.style),
                });
                const visibleBar = visible === true ||
                    (visible && visible.includes((idx + 1))) ||
                    false;
                const barProps = {
                    className: [
                        `${prefixCls}-bar`,
                        lineBar ? `${prefixCls}-line-bar` : null,
                        !lineBar ? `${prefixCls}-large-bar` : null,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .trim(),
                };
                if (disable === true ||
                    (disable && disable.includes((idx + 1)))) {
                    barProps.className = [
                        barProps.className,
                        disable ? "disable" : null,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .trim();
                }
                let BarCom = null;
                if (idx !== 0 && visibleBar && renderBar) {
                    BarCom = renderBar(Object.assign(Object.assign({}, barProps), { onMouseDown: this.onMouseDown.bind(this, idx + 1), onTouchStart: this.onMouseDown.bind(this, idx + 1) }), idx);
                }
                else if (idx !== 0 && visibleBar) {
                    // BarCom = React.createElement(
                    //   "div",
                    //   { ...barProps },
                    //   <div
                    //     onMouseDown={this.onMouseDown.bind(this, idx + 1)}
                    //     onTouchStart={this.onMouseDown.bind(this, idx + 1)}
                    //   />
                    // );
                    BarCom = (_jsx(DragHandle, { props: barProps, mode: this.props.mode, onMouseDown: this.onMouseDown.bind(this, idx + 1), onTouchStart: this.onMouseDown.bind(this, idx + 1), position: idx }, idx));
                }
                return (_jsxs(React.Fragment, { children: [BarCom, React.cloneElement(element, Object.assign({}, props))] }, idx));
            }) })));
    }
}
Split.defaultProps = {
    prefixCls: "a-split",
    visiable: true,
    mode: "horizontal",
    initialSizes: [],
    minSizes: [],
    maxSizes: [],
    enableSessionStorage: false,
    collapsed: [false, false, false],
};
