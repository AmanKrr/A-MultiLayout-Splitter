import React, { TouchEvent } from "react";
import "./style/index.css";
import SplitUtils from "./utils/SplitUtils";
import SplitSessionStorage, { ISplitSessionStorage } from "./utils/SplitSessionStorage";

import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import ManageHandleBar from "./helper/ManageHandleBar";
import DragHandle from "./DragHandle/DragHandle";

export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDragEnd"> {
  style?: React.CSSProperties;
  className?: string;
  prefixCls?: string;
  childPrefixCls?: string;
  /**
   * Drag width/height change callback function,
   * the width or height is determined according to the mode parameter
   */
  onDragging?: (preSize: number, nextSize: number, paneNumber: number) => void;
  /** Callback function for dragging end */
  onDragEnd?: (preSize: number, nextSize: number, paneNumber: number) => void;
  /** Support custom drag and drop toolbar */
  renderBar?: (props: React.HTMLAttributes<HTMLDivElement>, position: number) => JSX.Element;
  /** Set the drag and drop toolbar as a line style. */
  lineBar?: boolean;
  /** Set the dragged toolbar, whether it is visible or not */
  visible?: boolean | number[];
  /**
   * @deprecated Use `visible` instead
   */
  visiable?: boolean | number[];
  /**
   * Set the drag and drop toolbar, disable
   */
  disable?: boolean | number[];
  /**
   * type, optional `horizontal` or `vertical`
   */
  mode?: "horizontal" | "vertical";
  /**
   * initial sizes for each pane
   */
  initialSizes?: string[];
  /**
   * minimum sizes for each pane, range 0 to 100
   */
  minSizes?: number[];
  /**
   * maximum sizes for each pane, range 0 to 100
   */
  maxSizes?: number[];
  /**
   * session storage for storing splitter size
   */
  enableSessionStorage?: boolean;
  /**
   * collasped sections, "true" or "false"
   */
  collapsed?: boolean[];
  // /**
  //  * make section collapsible, "true" or "false"
  //  */
  // collapsible?: boolean[];
  height?: string;
  width?: string;
}

/**
 * State for the Split component.
 */
export interface SplitState {
  dragging: boolean;
}

/**
 * Split component for creating resizable split panes.
 */
export default class Split extends React.Component<SplitProps, SplitState> {
  private TOP = "top";
  private BOTTOM = "bottom";
  private LEFT = "left";
  private RIGHT = "right";
  private HORIZONTAL = "horizontal";
  private VERTICAL = "vertical";

  public static defaultProps: SplitProps = {
    prefixCls: "a-split",
    childPrefixCls: "a-split-control-pane",
    visiable: true,
    mode: "horizontal",
    initialSizes: [], // Default to an empty array
    minSizes: [], // Default to an empty array
    maxSizes: [],
    enableSessionStorage: false,
    collapsed: [false, false, false],
    height: "600px",
    width: "600px",
  };
  public state: SplitState = {
    dragging: false,
  };
  public warpper!: HTMLDivElement | null;
  public paneNumber!: number;
  public startX!: number;
  public startY!: number;
  public move!: boolean;
  public target!: HTMLDivElement;

  public boxWidth!: number;
  public boxHeight!: number;
  public preWidth!: number;
  public nextWidth!: number;
  public preHeight!: number;
  public nextHeight!: number;

  public preSize!: number;
  public nextSize!: number;
  private userSession: ISplitSessionStorage;
  private initDragging: boolean;

  private nextToNext!: HTMLElement;
  private prevToPrev!: HTMLElement;
  private breaker: number = 0;

  private onDraggingThrottled: (env: Event) => void;
  private onDragEndThrottled: () => void;
  private saveSizesToLocalStorageDebounced: () => void;

  constructor(props: SplitProps) {
    super(props);

    // if (this.props.initialSizes && this.props.initialSizes.length > 0) {
    //   const totalInitialSize = this.props.initialSizes.reduce(
    //     (accumulator, currentValue) => {
    //       return accumulator + currentValue;
    //     },
    //     0
    //   );
    //   if (totalInitialSize !== 100) {
    //     throw new Error("Initial Size sum is not euqal to 100.");
    //   }

    //   if (
    //     this.props.minSizes &&
    //     this.props.minSizes.length > 0 &&
    //     this.props.minSizes.length === this.props.initialSizes.length
    //   ) {
    //     for (let size = 0; size < this.props.minSizes.length; size++) {
    //       if (this.props.minSizes[size] > this.props.initialSizes[size]) {
    //         throw new Error("Initial Size should not be less than minSizes");
    //       }
    //     }
    //   }

    //   if (
    //     this.props.maxSizes &&
    //     this.props.maxSizes.length > 0 &&
    //     this.props.maxSizes.length === this.props.initialSizes.length
    //   ) {
    //     for (let size = 0; size < this.props.maxSizes.length; size++) {
    //       if (this.props.maxSizes[size] < this.props.initialSizes[size]) {
    //         throw new Error("Initial Size should not be greater than maxSizes");
    //       }
    //     }
    //   }

    //   if (
    //     this.props.maxSizes &&
    //     this.props.maxSizes.length > 0 &&
    //     this.props.minSizes &&
    //     this.props.minSizes.length > 0 &&
    //     this.props.initialSizes &&
    //     this.props.initialSizes.length > 0 &&
    //     this.props.maxSizes.length === this.props.minSizes.length &&
    //     this.props.maxSizes.length === this.props.initialSizes.length &&
    //     this.props.minSizes.length === this.props.initialSizes.length
    //   ) {
    //     for (let size = 0; size < this.props.maxSizes.length; size++) {
    //       if (this.props.maxSizes[size] < this.props.minSizes[size]) {
    //         throw new Error("maxSizes should not be less than minSizes");
    //       }

    //       if (
    //         this.props.initialSizes[size] <= 0 &&
    //         this.props.initialSizes[size] >= 100
    //       ) {
    //         throw new Error("Initial sizes should be in range of 0 to 100.");
    //       }
    //     }
    //   }
    // }

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
  public componentWillUnmount() {
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

  private checkTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  /**
   * add touch event listeners.
   */
  private addTouchEvent() {
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
  private removeTouchEvent() {
    if (this.checkTouchDevice()) {
      window.removeEventListener("touchmove", this.onDraggingThrottled, false);
      window.removeEventListener("touchcancel", this.onDragEndThrottled, false);
    }
  }

  /**
   * Remove mouse move and mouse up event listeners.
   */
  private removeEvent() {
    window.removeEventListener("mousemove", this.onDraggingThrottled, false);
    window.removeEventListener("mouseup", this.onDragEndThrottled, false);
    window.removeEventListener("beforeunload", this.saveSizesToLocalStorageDebounced, false);
  }

  /**
   * Set initial sizes for the panes.
   */
  setInitialSizes() {
    const { mode, initialSizes } = this.props;
    const sections = this.warpper?.children;
    console.log("###", sections);
    let totalHandleBarSize =
      mode &&
      sections &&
      Array.from(sections).reduce(
        (accumulator, currentValue) =>
          currentValue.classList.contains(mode === "horizontal" ? "splitterHandleBarContainer-horizontal" : "splitterHandleBarContainer-vertical")
            ? (currentValue as HTMLElement).offsetWidth + accumulator
            : accumulator,
        0
      );
    console.log(mode, totalHandleBarSize);

    if (sections && initialSizes && initialSizes.length > 0) {
      const userLayoutDefault = this.userSession.GetSession(mode!);
      let collapsedcounter = 0;
      let sectionCounter = 1;

      for (let i = 0; i < initialSizes.length; i++) {
        const size = initialSizes[i];
        const sectionIndex = i * 2; // Each section has a content and separator element

        if (sections.length > sectionIndex) {
          const contentTarget = sections[sectionIndex] as HTMLDivElement;

          if (mode === this.HORIZONTAL && contentTarget) {
            if (userLayoutDefault && userLayoutDefault.length > 0 && this.props.enableSessionStorage) {
              if (userLayoutDefault[i]["flexGrow"] === "-1") {
                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
              } else {
                if (userLayoutDefault[i]["flexGrow"] === "0") {
                  contentTarget.classList.add("a-split-hidden");
                }
                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
                contentTarget.style.flexGrow = userLayoutDefault[i]["flexGrow"];
              }
            } else {
              contentTarget.style.flexBasis = `${size}`;
              if (collapsedcounter > 0) {
                contentTarget.style.flexGrow = "1";
                collapsedcounter = 0;
              }
              if (this.props.collapsed![i] && collapsedcounter === 0) {
                contentTarget.style.flexGrow = "0";
                contentTarget.classList.add("a-split-hidden");
                collapsedcounter++;
              }
            }
            contentTarget.setAttribute("min-size", `${this.props.minSizes![i]}`);
            contentTarget.setAttribute("max-size", `${this.props.maxSizes![i]}`);
            ManageHandleBar.removeHandleIconOnClose(sectionCounter++, SplitUtils.modeWrapper, SplitUtils.cachedMappedSplitPanePosition, "horizontal");
            // contentTarget.style.overflow = `hidden`;
          } else if (mode === this.VERTICAL && contentTarget) {
            if (userLayoutDefault && userLayoutDefault.length > 0 && this.props.enableSessionStorage) {
              if (userLayoutDefault[i]["flexGrow"] === "-1") {
                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
              } else {
                if (userLayoutDefault[i]["flexGrow"] === "0") {
                  contentTarget.classList.add("a-split-hidden");
                }
                contentTarget.style.flexBasis = userLayoutDefault[i]["flexBasis"];
                contentTarget.style.flexGrow = userLayoutDefault[i]["flexGrow"];
              }
            } else {
              contentTarget.style.flexBasis = `${size}`;
              if (collapsedcounter > 0) {
                contentTarget.style.flexGrow = "1";
                collapsedcounter = 0;
              }
              if (this.props.collapsed![i] && collapsedcounter === 0) {
                contentTarget.style.flexGrow = "0";
                contentTarget.classList.add("a-split-hidden");
                collapsedcounter++;
              }
            }
            contentTarget.setAttribute("min-size", `${this.props.minSizes![i]}`);
            contentTarget.setAttribute("max-size", `${this.props.maxSizes![i]}`);
            ManageHandleBar.removeHandleIconOnClose(sectionCounter++, SplitUtils.modeWrapper, SplitUtils.cachedMappedSplitPanePosition, "vertical");
          }
        }
      }

      let openSectionCounter = 0;
      if (sections && sections.length > 0) {
        for (let pane = 0; pane < initialSizes.length; pane++) {
          if (SplitUtils.isSectionOpen(pane + 1, mode!)) {
            openSectionCounter++;
          }
        }
      }

      if (openSectionCounter === 1 && !this.props.collapsed![0]) {
        if (sections[0]) {
          (sections[0] as HTMLDivElement).style.flexGrow = "1";
        }
      }

      if (userLayoutDefault && userLayoutDefault.length === 0) {
        SplitUtils.saveSizesToLocalStorage(mode);
      }
    }
  }

  // /**
  //  *
  //  * @param nextTarget - Accepts next target HTMLElement
  //  * @param prevTarget - Accepts previous target HTMLElemen
  //  * @param mode - layout
  //  */
  // private setResizingLayout(nextTarget: HTMLElement, prevTarget: HTMLElement, mode: "horizontal" | "vertical") {
  //   const referenceWidth = mode === "horizontal" ? this.props.width! : this.props.height!;
  //   if (this.prevToPrev && this.prevToPrev.classList.contains("a-split-hidden")) {
  //     let prevTargetVal = -1,
  //       pixel = false;
  //     if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("%")) {
  //       prevTargetVal = this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
  //     } else if (this.nextToNext.style.flexBasis.includes("%") && prevTarget.style.flexBasis.includes("px")) {
  //       pixel = true;
  //       prevTargetVal =
  //         SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
  //         SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
  //     } else {
  //       prevTargetVal = this.preSize - parseFloat(this.prevToPrev.style.flexBasis);
  //     }
  //     if (prevTargetVal >= 0) {
  //       prevTarget.style.flexBasis = `${prevTargetVal}${pixel ? "px" : "%"}`;
  //       if (nextTarget.style.flexBasis.includes("px")) {
  //         nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
  //       } else {
  //         nextTarget.style.flexBasis = `${this.nextSize}%`;
  //       }
  //     }
  //   } else if (this.nextToNext && this.nextToNext.classList.contains("a-split-hidden")) {
  //     let nextTargetVal = -1,
  //       pixel = false;
  //     if (this.nextToNext.style.flexBasis.includes("px") && nextTarget.style.flexBasis.includes("%")) {
  //       nextTargetVal = this.nextSize - SplitUtils.pixelToPercentage(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
  //     } else if (this.nextToNext.style.flexBasis.includes("%") && nextTarget.style.flexBasis.includes("px")) {
  //       pixel = true;
  //       nextTargetVal =
  //         SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
  //         SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
  //     } else {
  //       nextTargetVal = this.nextSize - parseFloat(this.nextToNext.style.flexBasis);
  //     }

  //     if (nextTargetVal >= 0) {
  //       if (prevTarget.style.flexBasis.includes("px")) {
  //         prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
  //       } else {
  //         prevTarget.style.flexBasis = `${this.preSize}%`;
  //       }
  //       nextTarget.style.flexBasis = `${nextTargetVal}${pixel ? "px" : "%"}`;
  //     }
  //   } else {
  //     // if no sections are found collapsed normal resizing
  //     if (prevTarget.style.flexBasis.includes("px")) {
  //       prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
  //     } else {
  //       prevTarget.style.flexBasis = `${this.preSize}%`;
  //     }

  //     if (nextTarget.style.flexBasis.includes("px")) {
  //       nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
  //     } else {
  //       nextTarget.style.flexBasis = `${this.nextSize}%`;
  //     }
  //   }
  // }

  /**
   * This function adjusts the layout of two adjacent elements while resizing,
   * ensuring that the flex basis of the elements is updated correctly based on the resizing mode.
   * @param nextTarget - The next target HTMLElement.
   * @param prevTarget - The previous target HTMLElement.
   * @param mode - The layout mode, either "horizontal" or "vertical".
   */
  private setResizingLayout(nextTarget: HTMLElement, prevTarget: HTMLElement, mode: "horizontal" | "vertical") {
    // Determine the reference width based on the layout mode
    const referenceWidth = mode === "horizontal" ? this.props.width! : this.props.height!;

    // Check if the previous target element is hidden
    if (this.prevToPrev && this.prevToPrev.classList.contains("a-split-hidden")) {
      let prevTargetVal = -1; // Initialize the previous target value
      let pixel = false; // Initialize a flag to determine if the value is in pixels or percentage

      // Check if the previous target is in pixels and the next target is in percentage
      if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("%")) {
        // Calculate the new value for the previous target in pixels
        prevTargetVal = this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
      } else if (this.prevToPrev.style.flexBasis.includes("%") && prevTarget.style.flexBasis.includes("px")) {
        pixel = true; // Set the flag to true since the value will be in pixels
        // Calculate the new value for the previous target in pixels
        prevTargetVal =
          SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
          SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
      } else if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("px")) {
        pixel = true;
        prevTargetVal = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis);
      } else {
        // Calculate the new value for the previous target directly
        prevTargetVal = this.preSize - parseFloat(this.prevToPrev.style.flexBasis);
      }

      // Check if the new value for the previous target is valid
      if (prevTargetVal >= 0) {
        // Set the flex basis of the previous target with the new value
        prevTarget.style.flexBasis = `${prevTargetVal}${pixel ? "px" : "%"}`;
        // Set the flex basis of the next target based on its unit (px or %)
        if (nextTarget.style.flexBasis.includes("px")) {
          nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
        } else {
          nextTarget.style.flexBasis = `${this.nextSize}%`;
        }
      }
    }
    // Check if the next target element is hidden
    else if (this.nextToNext && this.nextToNext.classList.contains("a-split-hidden")) {
      let nextTargetVal = -1; // Initialize the next target value
      let pixel = false; // Initialize a flag to determine if the value is in pixels or percentage

      // Check if the next target is in pixels and the previous target is in percentage
      if (this.nextToNext.style.flexBasis.includes("px") && nextTarget.style.flexBasis.includes("%")) {
        if (nextTarget.style.flexGrow === "") {
          const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis) < 0;
          if (limit) return;
          if (prevTarget.style.flexBasis.includes("px")) {
            prevTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis)
            }px`;
          } else {
            prevTarget.style.flexBasis = `${
              this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)
            }%`;
          }
          nextTarget.style.flexBasis = `${this.nextSize}%`;
        } else {
          // Calculate the new value for the next target in pixels
          nextTargetVal = this.nextSize - SplitUtils.pixelToPercentage(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
        }
      } else if (this.nextToNext.style.flexBasis.includes("%") && nextTarget.style.flexBasis.includes("px")) {
        pixel = true; // Set the flag to true since the value will be in pixels
        if (nextTarget.style.flexGrow === "") {
          const limit =
            SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
              SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth) <
            0;
          if (limit) return;
          if (prevTarget.style.flexBasis.includes("px")) {
            prevTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
              SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)
            }px`;
          } else {
            prevTarget.style.flexBasis = `${this.preSize - parseFloat(this.nextToNext.style.flexBasis)}%`;
          }
          nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
        } else {
          // Calculate the new value for the next target in pixels
          nextTargetVal =
            SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
            SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
        }
      } else if (this.nextToNext.style.flexBasis.includes("px") && nextTarget.style.flexBasis.includes("px")) {
        pixel = true;
        if (nextTarget.style.flexGrow === "") {
          const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis) < 0;
          if (limit) return;
          if (prevTarget.style.flexBasis.includes("px")) {
            prevTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis)
            }px`;
          } else {
            prevTarget.style.flexBasis = `${
              this.preSize - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)
            }%`;
          }
          nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
        } else {
          nextTargetVal = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis);
        }
      } else {
        if (nextTarget.style.flexGrow === "") {
          const limit = this.preSize - parseFloat(this.nextToNext.style.flexBasis) < 0;
          if (limit) return;
          if (prevTarget.style.flexBasis.includes("px")) {
            prevTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
              SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)
            }px`;
          } else {
            prevTarget.style.flexBasis = `${this.preSize - parseFloat(this.nextToNext.style.flexBasis)}%`;
          }
          nextTarget.style.flexBasis = `${this.nextSize}%`;
        } else {
          // Calculate the new value for the next target directly
          nextTargetVal = this.nextSize - parseFloat(this.nextToNext.style.flexBasis);
        }
      }

      // Check if the new value for the next target is valid
      if (nextTargetVal >= 0) {
        // Set the flex basis of the previous target based on its unit (px or %)
        if (prevTarget.style.flexBasis.includes("px")) {
          prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
        } else {
          prevTarget.style.flexBasis = `${this.preSize}%`;
        }
        // Set the flex basis of the next target with the new value
        nextTarget.style.flexBasis = `${nextTargetVal}${pixel ? "px" : "%"}`;
        // nextTargetVal = -1;
      }
    }
    // If neither the previous nor the next target is hidden
    else {
      // Set the flex basis of the previous target based on its unit (px or %)
      if (prevTarget.style.flexBasis.includes("px")) {
        prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
      } else {
        prevTarget.style.flexBasis = `${this.preSize}%`;
      }
      // Set the flex basis of the next target based on its unit (px or %)
      if (nextTarget.style.flexBasis.includes("px")) {
        nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
      } else {
        nextTarget.style.flexBasis = `${this.nextSize}%`;
      }
    }
  }

  /**
   * Handle mouse down event to start dragging.
   * @param paneNumber - The number of the pane being dragged.
   * @param env - MouseEvent.
   */
  onMouseDown(paneNumber: number, env: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) {
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
    const clientX = "touches" in env ? env.touches[0].clientX : (env as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX;
    const clientY = "touches" in env ? env.touches[0].clientY : (env as React.MouseEvent<HTMLDivElement, MouseEvent>).clientY;
    this.paneNumber = paneNumber;
    this.startX = clientX;
    this.startY = clientY;
    this.move = true;
    if (
      (env.target as HTMLDivElement).classList.contains("a-splitter-handlebar-icon") ||
      (env.target as HTMLDivElement).classList.contains("a-splitter-collapse-icon")
    ) {
      this.target = (env.target as HTMLDivElement).parentElement as HTMLDivElement;
    } else {
      this.target = env.target as HTMLDivElement;
    }
    const prevTarget = this.target.previousElementSibling;
    const nextTarget = this.target.nextElementSibling;
    this.boxWidth = this.warpper.offsetWidth;
    this.boxHeight = this.warpper.offsetHeight;
    if (prevTarget) {
      this.preWidth = (prevTarget as HTMLElement).offsetWidth;
      this.preHeight = (prevTarget as HTMLElement).offsetHeight;
    }
    if (nextTarget) {
      this.nextWidth = (nextTarget as HTMLElement).offsetWidth;
      this.nextHeight = (nextTarget as HTMLElement).offsetHeight;
    }

    /* 
      - After collapsing need to maintain the equal size distribution.
      - Without affecting performance the best approach to achieve is this.
      - On mouse down update the siblings for checking siblings are collapsed or not. Will use the updated element to check which side is collapsed and restrict the resizing 
        on section on the basis of collapsed section size. So that size remains equal.
    */
    if (prevTarget && prevTarget.previousElementSibling && prevTarget.previousElementSibling.previousElementSibling)
      this.prevToPrev = prevTarget.previousElementSibling.previousElementSibling as HTMLElement;
    if (nextTarget && nextTarget.nextElementSibling && nextTarget.nextElementSibling.nextElementSibling)
      this.nextToNext = nextTarget.nextElementSibling.nextElementSibling as HTMLElement;

    this.addTouchEvent();
    window.addEventListener("mouseup", this.onDragEndThrottled, false);
    window.addEventListener("mousemove", this.onDraggingThrottled);
    this.setState({ dragging: true });
  }

  /**
   * Handle mouse dragging to resize panes.
   * @param env - MouseEvent.
   */
  onDragging(env: Event | TouchEvent) {
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
    const nextTarget = this.target.nextElementSibling as HTMLDivElement;
    const prevTarget = this.target.previousElementSibling as HTMLDivElement;

    if (nextTarget && prevTarget) {
      if (nextTarget.classList.contains("a-split-hidden") || prevTarget.classList.contains("a-split-hidden")) return;
    }

    const clientX = "touches" in env ? env.touches[0].clientX : (env as MouseEvent).clientX;
    const clientY = "touches" in env ? env.touches[0].clientY : (env as MouseEvent).clientY;
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
        if (Math.abs(this.preSize - this.preWidth) <= 1) return;
        if (Math.abs(this.nextSize - this.nextWidth) <= 1) return;
        this.preSize = (this.preSize / this.boxWidth >= 1 ? 1 : this.preSize / this.boxWidth) * 100;
        this.nextSize = (this.nextSize / this.boxWidth >= 1 ? 1 : this.nextSize / this.boxWidth) * 100;
        // if (prevTarget && nextTarget) {
        //   const minPrevSize = prevTarget.getAttribute("min-size");
        //   const minNextSize = nextTarget.getAttribute("min-size");
        //   if (minPrevSize && this.preSize <= parseInt(minPrevSize)) return;
        //   if (minNextSize && this.nextSize <= parseInt(minNextSize)) return;
        // }
        // if (prevTarget && nextTarget) {
        //   const maxPrevSize = prevTarget.getAttribute("max-size");
        //   const maxNextSize = nextTarget.getAttribute("max-size");
        //   if (maxPrevSize && this.preSize >= parseInt(maxPrevSize)) return;
        //   if (maxNextSize && this.nextSize >= parseInt(maxNextSize)) return;
        // }
        if (prevTarget && nextTarget) {
          this.setResizingLayout(nextTarget, prevTarget, this.HORIZONTAL);
        }
      }
      if (mode === this.VERTICAL && this.preHeight + y > -1 && this.nextHeight - y > -1) {
        this.preSize = this.preHeight + y > -1 ? this.preHeight + y : 0;
        this.nextSize = this.nextHeight - y > -1 ? this.nextHeight - y : 0;
        if (Math.abs(this.preSize - this.preWidth) <= 1) return;
        if (Math.abs(this.nextSize - this.nextWidth) <= 1) return;
        this.preSize = (this.preSize / this.boxHeight >= 1 ? 1 : this.preSize / this.boxHeight) * 100;
        this.nextSize = (this.nextSize / this.boxHeight >= 1 ? 1 : this.nextSize / this.boxHeight) * 100;
        if (this.preSize === 0 || this.nextSize === 0) {
          return;
        }
        if (prevTarget && nextTarget) {
          const minPrevSize = prevTarget.getAttribute("min-size");
          const minNextSize = nextTarget.getAttribute("min-size");
          if (minPrevSize && this.preSize <= parseInt(minPrevSize)) return;
          if (minNextSize && this.nextSize <= parseInt(minNextSize)) return;
        }
        if (prevTarget && nextTarget) {
          const maxPrevSize = prevTarget.getAttribute("max-size");
          const maxNextSize = nextTarget.getAttribute("max-size");
          if (maxPrevSize && this.preSize >= parseInt(maxPrevSize)) return;
          if (maxNextSize && this.nextSize >= parseInt(maxNextSize)) return;
        }
        if (prevTarget && nextTarget) {
          this.setResizingLayout(nextTarget, prevTarget, this.VERTICAL);
          // prevTarget.style.flexBasis = `${this.preSize}%`;
          // nextTarget.style.flexBasis = `${this.nextSize}%`;
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
    if (this.props.mode === "horizontal" && this.props.enableSessionStorage && this.initDragging) {
      this.saveSizesToLocalStorageDebounced();
      this.initDragging = false;
    }
  }

  render() {
    const {
      prefixCls,
      childPrefixCls,
      className,
      children,
      mode,
      visiable,
      visible = this.props.visible ?? this.props.visiable,
      renderBar,
      lineBar,
      disable,
      onDragEnd,
      onDragging,
      ...other
    } = this.props;
    const { dragging } = this.state;
    // Generate CSS classes based on component state
    const cls = [prefixCls, className, `${prefixCls}-${mode}`, dragging ? "dragging" : null].filter(Boolean).join(" ").trim();
    const child = React.Children.toArray(children);
    // Extract needed props from the remaining props
    const { initialSizes, minSizes, maxSizes, enableSessionStorage, collapsed, height, width, ...neededProps } = other;
    return (
      <div className={cls} {...neededProps} ref={(node) => (this.warpper = node)} style={{ height: height, width: width }}>
        {React.Children.map(child, (element: any, idx: number) => {
          const props = Object.assign({}, element.props, {
            className: [childPrefixCls, `${prefixCls}-pane`, "a-split-scrollable", element.props.className].filter(Boolean).join(" ").trim(),
            style: { ...element.props.style },
          });
          const visibleBar = visible === true || (visible && visible.includes((idx + 1) as never)) || false;
          const barProps = {
            className: [`${prefixCls}-bar`, lineBar ? `${prefixCls}-line-bar` : null, !lineBar ? `${prefixCls}-large-bar` : null]
              .filter(Boolean)
              .join(" ")
              .trim(),
          };
          if (disable === true || (disable && disable.includes((idx + 1) as never))) {
            barProps.className = [barProps.className, disable ? "disable" : null].filter(Boolean).join(" ").trim();
          }
          let BarCom = null;
          if (idx !== 0 && visibleBar && renderBar) {
            BarCom = renderBar(
              {
                ...barProps,
                onMouseDown: this.onMouseDown.bind(this, idx + 1),
                onTouchStart: this.onMouseDown.bind(this, idx + 1),
              },
              idx
            );
          } else if (idx !== 0 && visibleBar) {
            // BarCom = React.createElement(
            //   "div",
            //   { ...barProps },
            //   <div
            //     onMouseDown={this.onMouseDown.bind(this, idx + 1)}
            //     onTouchStart={this.onMouseDown.bind(this, idx + 1)}
            //   />
            // );
            BarCom = (
              <DragHandle
                key={idx}
                props={barProps}
                mode={this.props.mode!}
                onMouseDown={this.onMouseDown.bind(this, idx + 1)}
                onTouchStart={this.onMouseDown.bind(this, idx + 1)}
                position={idx}
              />
            );
          }
          return (
            <React.Fragment key={idx}>
              {BarCom}
              {React.cloneElement(<div>{element}</div>, { ...props })}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}
