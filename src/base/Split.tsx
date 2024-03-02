import React, { TouchEvent } from "react";
import "./style/index.css";
import SplitUtils from "../utils/SplitUtils";
import SplitSessionStorage, { ISplitSessionStorage } from "../utils/SplitSessionStorage";

import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import ManageHandleBar from "../helper/ManageHandleBar";
import DragHandle from "../DragHandle/DragHandle";

export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDragEnd"> {
  style?: React.CSSProperties;
  className?: string;
  /**
   * Helps in identifying unique Splitter instance
   */
  id: string;
  /**
   * Fix layout issues for deep nested layout
   */
  prefixCls?: string;
  childPrefixCls?: string;
  fixClass?: boolean;
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
  lineBar?: boolean | number[];
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
  /**
   * Height for splitter parent
   */
  height?: null | string;
  /**
   * Width for splitter parent
   */
  width?: null | string;
}

interface DefaultProps {
  prefixCls: string;
  childPrefixCls: string;
  visiable: boolean;
  mode: string;
  initialSizes: string[] | []; // Default to an empty array
  minSizes: number[] | []; // Default to an empty array
  maxSizes: number[] | [];
  enableSessionStorage: boolean;
  collapsed: boolean[] | [];
  height: string | null;
  width: string | null;
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

  public static defaultProps: DefaultProps = {
    prefixCls: "a-split",
    childPrefixCls: "a-split-control-pane",
    visiable: true,
    mode: "horizontal",
    initialSizes: [], // Default to an empty array
    minSizes: [], // Default to an empty array
    maxSizes: [],
    enableSessionStorage: false,
    collapsed: [],
    height: null,
    width: null,
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

  // fixed computed layout of handlebar
  private handleBarLayoutInfo = {
    width: 1,
    afterElementWidth: 16,
    marginLeft: 5,
    marginRight: 5,
  };

  private onDraggingThrottled: (env: Event) => void;
  private onDragEndThrottled: () => void;
  private saveHorizontalSizesToLocalStorageDebounced: () => void;
  private saveVerticalSizesToLocalStorageDebounced: () => void;

  constructor(props: SplitProps) {
    super(props);

    // Throttle the dragging and drag end functions to control the frequency of execution
    this.onDraggingThrottled = throttle(this.onDragging.bind(this), 16);
    this.onDragEndThrottled = throttle(this.onDragEnd.bind(this), 16);

    // Explicitly bind and debounce the session storage update
    this.saveHorizontalSizesToLocalStorageDebounced = debounce(SplitUtils.saveHorizontalSizesToLocalStorage.bind(SplitUtils), 300);
    this.saveVerticalSizesToLocalStorageDebounced = debounce(SplitUtils.saveVerticalSizesToLocalStorage.bind(SplitUtils), 300);

    // Initialize session storage utility and dragging flag
    this.userSession = new SplitSessionStorage();
    this.initDragging = false;

    window.addEventListener("beforeunload", this.saveHorizontalSizesToLocalStorageDebounced);
    window.addEventListener("beforeunload", this.saveVerticalSizesToLocalStorageDebounced);
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
  public componentDidMount() {
    const { mode } = this.props;
    SplitUtils.setWrapper(this.warpper, mode, this.props.enableSessionStorage);
    // Set initial sizes when the component mounts
    this.setInitialSizes();
  }

  /**
   * Checks if the current device supports touch input.
   * @returns {boolean} Returns true if the device supports touch input, otherwise false.
   */
  private checkTouchDevice(): boolean {
    // Check if the 'ontouchstart' event is supported in the window object
    // or if the device reports that it has touch points through the navigator object
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  /**
   * add touch event listeners.
   */
  private addTouchEvent(): void {
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
  private removeTouchEvent(): void {
    if (this.checkTouchDevice()) {
      window.removeEventListener("touchmove", this.onDraggingThrottled, false);
      window.removeEventListener("touchcancel", this.onDragEndThrottled, false);
    }
  }

  /**
   * Remove mouse move and mouse up event listeners.
   */
  private removeEvent(): void {
    window.removeEventListener("mousemove", this.onDraggingThrottled, false);
    window.removeEventListener("mouseup", this.onDragEndThrottled, false);
    window.removeEventListener("beforeunload", this.saveHorizontalSizesToLocalStorageDebounced, false);
    window.removeEventListener("beforeunload", this.saveVerticalSizesToLocalStorageDebounced, false);
  }

  /**
   * Set initial sizes for the panes.
   */
  private setInitialSizes(): void {
    const { mode, initialSizes } = this.props;
    const sections = this.warpper?.children;

    if (sections && sections.length > 0) {
      // on the basis of given id by user setting instance. Id is the key to correctly access the instance.
      if (this.props.id) {
        SplitUtils.setSplitPaneInstance({
          [this.props.id]: this.warpper,
        });
      }

      const userLayoutDefault = this.userSession.GetSession(mode!);
      const totalPaneSize = (sections.length + 1) / 2;
      const totalHandleCount = Math.abs((sections.length + 1) / 2 - sections.length);
      // for maintaing perfect size, exclude the handle bar sizes which can not be calculated dynamically.
      // Because pseudo element can not be accessed by javascript.
      // Noteable issue: If user tries to modify the css of handlebar this size will cause issue and splitter can show unexpected behaviour.
      const totalHandleBarLayoutValue =
        (this.handleBarLayoutInfo.marginLeft + this.handleBarLayoutInfo.marginRight + this.handleBarLayoutInfo.width) * totalHandleCount;
      const sizeToReduce = totalHandleBarLayoutValue / totalPaneSize;
      let collapsedcounter = 0;
      let sectionCounter = 1;

      // if initialSize props are given distributing the width and height.
      if (initialSizes && initialSizes.length > 0) {
        for (let i = 0; i < initialSizes.length; i++) {
          const size = initialSizes[i];
          const sectionIndex = i * 2; // Each section has a content and separator element

          if (sections.length > sectionIndex) {
            const contentTarget = sections[sectionIndex] as HTMLDivElement;

            // if localStorage storage is enabled then check localStorage have some stored data related to splitter and set the size
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
              const getDimension = contentTarget.parentElement?.getBoundingClientRect();
              if (sizeToReduce > -1) {
                if (size && size.includes("%")) {
                  contentTarget.style.flexBasis = `${
                    parseFloat(size) -
                    SplitUtils.pixelToPercentage(sizeToReduce, `${mode === this.HORIZONTAL ? getDimension?.width : getDimension.height}px`)
                  }%`;
                } else {
                  contentTarget.style.flexBasis = `${parseFloat(size) - sizeToReduce}px`;
                }
              } else {
                contentTarget.style.flexBasis = `${size}`;
              }
              // checks for collaped props
              if (collapsedcounter > 0) {
                contentTarget.style.flexGrow = "1";
                collapsedcounter = 0;
              }
              // by default not collapsing any horizontal
              if ((this.props.collapsed![i] || false) && collapsedcounter === 0) {
                contentTarget.style.flexGrow = "0";
                contentTarget.classList.add("a-split-hidden");
                collapsedcounter++;
              }
            }
            // setting min and max limit by default 0 and 100
            contentTarget.setAttribute("min-size", `${this.props.minSizes![i] || 0}`);
            contentTarget.setAttribute("max-size", `${this.props.maxSizes![i] || 100}`);

            // remove handlebar icons if some sections are closed
            ManageHandleBar.removeHandleIconOnClose(
              this.warpper,
              sectionCounter++,
              SplitUtils.modeWrapper,
              SplitUtils.cachedMappedSplitPanePosition,
              mode === this.HORIZONTAL ? "horizontal" : "vertical"
            );
          }
        }
      }

      // if initialSize props are not given
      // this will dynamically distribute the layout width according to parent width and height.
      if (initialSizes && initialSizes.length === 0) {
        let counter = 0;
        for (let pane = 0; pane < sections.length; pane += 2) {
          const contentTarget = sections[pane] as HTMLDivElement;
          const getDimension = contentTarget.parentElement?.getBoundingClientRect();
          contentTarget.style.flexBasis = `${
            mode === this.HORIZONTAL ? getDimension?.width! : getDimension?.height! / totalPaneSize - sizeToReduce
          }px`;
          // setting min and max limit by default 0 and 100
          contentTarget.setAttribute("min-size", `${this.props.minSizes![counter] || 0}`);
          contentTarget.setAttribute("max-size", `${this.props.maxSizes![counter] || 100}`);

          // checks for collaped props
          if (collapsedcounter > 0) {
            contentTarget.style.flexGrow = "1";
            collapsedcounter = 0;
          }
          // by default not collapsing any vertical section
          if ((this.props.collapsed![counter] || false) && collapsedcounter === 0) {
            contentTarget.style.flexGrow = "0";
            contentTarget.classList.add("a-split-hidden");
            collapsedcounter++;
          }
          ++counter;
          // remove handlebar icons if some sections are closed
          ManageHandleBar.removeHandleIconOnClose(
            this.warpper,
            sectionCounter++,
            SplitUtils.modeWrapper,
            SplitUtils.cachedMappedSplitPanePosition,
            mode === this.HORIZONTAL ? "horizontal" : "vertical"
          );
        }
      }

      // check for opened section
      let openSectionCounter = 0;
      if (sections && sections.length > 0) {
        for (let pane = 0; pane < initialSizes.length; pane++) {
          if (SplitUtils.isSectionOpen(this.warpper, pane + 1, mode!)) {
            openSectionCounter++;
          }
        }
      }

      // corner case: if only one section is opened then grow first section
      if (openSectionCounter === 1 && !this.props.collapsed![0]) {
        if (sections[0]) {
          (sections[0] as HTMLDivElement).style.flexGrow = "1";
        }
      }

      if (userLayoutDefault && userLayoutDefault.length === 0) {
        if (mode === this.HORIZONTAL) {
          SplitUtils.saveHorizontalSizesToLocalStorage();
        } else {
          SplitUtils.saveVerticalSizesToLocalStorage();
        }
      }
    }
  }

  /**
   * This function adjusts the layout of two adjacent elements while resizing,
   * ensuring that the flex basis of the elements is updated correctly based on the resizing mode.
   * @param nextTarget - The next target HTMLElement.
   * @param prevTarget - The previous target HTMLElement.
   * @param mode - The layout mode, either "horizontal" or "vertical".
   */
  private setResizingLayout(nextTarget: HTMLElement, prevTarget: HTMLElement, mode: "horizontal" | "vertical"): void {
    // Determine the reference width based on the layout mode
    const referenceWidth = String(
      mode === "horizontal"
        ? this.props.width || nextTarget?.parentElement?.getBoundingClientRect().width || prevTarget?.parentElement?.getBoundingClientRect().width
        : this.props.height || nextTarget?.parentElement?.getBoundingClientRect().height || prevTarget?.parentElement?.getBoundingClientRect().height
    );

    // Check if the previous target element is hidden
    if (this.prevToPrev && this.prevToPrev.classList.contains("a-split-hidden")) {
      let prevTargetVal = -1; // Initialize the previous target value
      let pixel = false; // Initialize a flag to determine if the value is in pixels or percentage

      // Check if the previous target is in pixels and the next target is in percentage
      if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("%")) {
        // distributing size
        if (prevTarget.style.flexGrow === "") {
          const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis) < 0;
          if (limit) return;
          if (nextTarget.style.flexBasis.includes("px")) {
            nextTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis)
            }px`;
          } else {
            nextTarget.style.flexBasis = `${
              this.nextSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)
            }%`;
          }
          prevTarget.style.flexBasis = `${this.preSize}%`;
        } else {
          // Calculate the new value for the previous target in pixels
          prevTargetVal = this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
        }
      } else if (this.prevToPrev.style.flexBasis.includes("%") && prevTarget.style.flexBasis.includes("px")) {
        pixel = true; // Set the flag to true since the value will be in pixels
        // distributing size
        if (prevTarget.style.flexGrow === "") {
          const limit =
            SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
              SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth) <
            0;
          if (limit) return;
          if (nextTarget.style.flexBasis.includes("px")) {
            nextTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
              SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)
            }px`;
          } else {
            nextTarget.style.flexBasis = `${this.nextSize - parseFloat(this.prevToPrev.style.flexBasis)}%`;
          }
          prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
        } else {
          // Calculate the new value for the previous target in pixels
          prevTargetVal =
            SplitUtils.percentageToPixel(this.preSize, referenceWidth) -
            SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
        }
      } else if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("px")) {
        pixel = true;
        // distributing size
        if (prevTarget.style.flexGrow === "") {
          const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis) < 0;
          if (limit) return;
          if (nextTarget.style.flexBasis.includes("px")) {
            nextTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis)
            }px`;
          } else {
            nextTarget.style.flexBasis = `${
              this.nextSize - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)
            }%`;
          }
          prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
        } else {
          prevTargetVal = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis);
        }
      } else {
        // distributing size
        if (prevTarget.style.flexGrow === "") {
          const limit = this.nextSize - parseFloat(this.prevToPrev.style.flexBasis) < 0;
          if (limit) return;
          if (nextTarget.style.flexBasis.includes("px")) {
            nextTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.nextSize, referenceWidth) -
              SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)
            }px`;
          } else {
            nextTarget.style.flexBasis = `${this.nextSize - parseFloat(this.prevToPrev.style.flexBasis)}%`;
          }
          prevTarget.style.flexBasis = `${this.preSize}%`;
        } else {
          // Calculate the new value for the previous target directly
          prevTargetVal = this.preSize - parseFloat(this.prevToPrev.style.flexBasis);
        }
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
        // distributing size
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
        // distributing size
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
        // distributing size
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
        // distributing size
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
        if (Math.abs(this.preSize - this.preWidth) <= 1) return; // check to ensure there is no unecessary displacement
        if (Math.abs(this.nextSize - this.nextWidth) <= 1) return; // check to ensure there is no unecessary displacement
        // calculating prevSize and nextSize
        this.preSize = (this.preSize / this.boxWidth >= 1 ? 1 : this.preSize / this.boxWidth) * 100;
        this.nextSize = (this.nextSize / this.boxWidth >= 1 ? 1 : this.nextSize / this.boxWidth) * 100;
        // checks for controlling dragging for max check
        if (prevTarget && nextTarget) {
          const minPrevSize = prevTarget.getAttribute("min-size");
          const minNextSize = nextTarget.getAttribute("min-size");
          if (minPrevSize && this.preSize <= parseInt(minPrevSize)) return;
          if (minNextSize && this.nextSize <= parseInt(minNextSize)) return;
        }
        // checks for controlling dragging for min check
        if (prevTarget && nextTarget) {
          const maxPrevSize = prevTarget.getAttribute("max-size");
          const maxNextSize = nextTarget.getAttribute("max-size");
          if (maxPrevSize && this.preSize >= parseInt(maxPrevSize)) return;
          if (maxNextSize && this.nextSize >= parseInt(maxNextSize)) return;
        }
        // set layout size
        if (prevTarget && nextTarget) {
          this.setResizingLayout(nextTarget, prevTarget, this.HORIZONTAL);
        }
      }
      if (mode === this.VERTICAL && this.preHeight + y > -1 && this.nextHeight - y > -1) {
        this.preSize = this.preHeight + y > -1 ? this.preHeight + y : 0;
        this.nextSize = this.nextHeight - y > -1 ? this.nextHeight - y : 0;
        // calculating prevSize and nextSize
        this.preSize = (this.preSize / this.boxHeight >= 1 ? 1 : this.preSize / this.boxHeight) * 100;
        this.nextSize = (this.nextSize / this.boxHeight >= 1 ? 1 : this.nextSize / this.boxHeight) * 100;

        if (this.preSize === 0 || this.nextSize === 0) {
          return;
        }

        if (Math.abs(this.preSize - this.preHeight) <= 1) return; // check to ensure there is no unecessary displacement
        if (Math.abs(this.nextSize - this.nextHeight) <= 1) return; // check to ensure there is no unecessary displacement
        // checks for controlling dragging for max check
        if (prevTarget && nextTarget) {
          const minPrevSize = prevTarget.getAttribute("min-size");
          const minNextSize = nextTarget.getAttribute("min-size");
          if (minPrevSize && this.preSize <= parseInt(minPrevSize)) return;
          if (minNextSize && this.nextSize <= parseInt(minNextSize)) return;
        }
        // checks for controlling dragging for min check
        if (prevTarget && nextTarget) {
          const maxPrevSize = prevTarget.getAttribute("max-size");
          const maxNextSize = nextTarget.getAttribute("max-size");
          if (maxPrevSize && this.preSize >= parseInt(maxPrevSize)) return;
          if (maxNextSize && this.nextSize >= parseInt(maxNextSize)) return;
        }
        // set layout size
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
    if (this.props.enableSessionStorage && this.initDragging) {
      if (this.props.mode === this.HORIZONTAL) {
        this.saveHorizontalSizesToLocalStorageDebounced();
      } else {
        this.saveVerticalSizesToLocalStorageDebounced();
      }
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
      fixClass,
      id,
      ...other
    } = this.props;
    const { dragging } = this.state;
    // Generate CSS classes based on component state
    const cls = [
      prefixCls,
      className,
      `${prefixCls}-${mode}`,
      dragging ? "dragging" : null,
      fixClass ? "a-split-pane-fix a-split-pane-helper-fix" : null,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
    const child = React.Children.toArray(children);
    // Extract needed props from the remaining props
    const { initialSizes, minSizes, maxSizes, enableSessionStorage, collapsed, height, width, ...neededProps } = other;
    return (
      <div
        className={cls}
        {...neededProps}
        ref={(node) => (this.warpper = node)}
        style={{ height: height || "", width: width || "", ...neededProps.style }}
        id={id}
      >
        {React.Children.map(child, (element: any, idx: number) => {
          const props = Object.assign({}, element.props, {
            className: [
              childPrefixCls,
              `${prefixCls}-pane`,
              element && element.props && element.props.mode !== "horizontal" && element.props.mode !== "vertical" && "a-split-scrollable",
              element.props.className,
            ]
              .filter(Boolean)
              .join(" ")
              .trim(),
            style: { ...element.props.style },
          });
          const visibleBar = visible === true || (visible && visible.includes((idx + 1) as never)) || false;
          const barProps = {
            className: [`${prefixCls}-bar`].filter(Boolean).join(" ").trim(),
          };
          // lineBar ? `${prefixCls}-line-bar` : null, !lineBar ? `${prefixCls}-large-bar` : null
          if (idx !== 0 && (lineBar === true || (lineBar && lineBar.includes(idx)))) {
            barProps.className = [barProps.className, lineBar ? `${prefixCls}-line-bar` : null].filter(Boolean).join(" ").trim();
          }
          if (idx !== 0 && (disable === true || (disable && disable.includes(idx)))) {
            barProps.className = [barProps.className, disable ? "a-split-handle-disable" : null].filter(Boolean).join(" ").trim();
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
              {React.cloneElement(
                element && element.props && (element.props.mode === "horizontal" || element.props.mode === "vertical") ? (
                  element
                ) : (
                  <div>{element}</div>
                ),
                { ...props }
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}
