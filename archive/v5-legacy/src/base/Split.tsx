import React, { TouchEvent } from "react";
import "../style/index.css";
import SplitUtils, { paneStatus } from "../utils/SplitUtils";
import SplitSessionStorage, { ISplitSessionStorage } from "../utils/SplitSessionStorage";

import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import ManageHandleBar from "../helper/ManageHandleBar";
import DragHandle from "../DragHandle/DragHandle";
import { SplitState, SplitStateContextType, withSplitState } from "./SplitProvider";

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
  /**
   * Callback function for layout change. Triggered only on closing and opening of pane.
   */
  onLayoutChange?: (sectionNumber: number, paneId: string, reason: string | paneStatus, direction: "left" | "right" | "top" | "bottom" | null) => void | null;
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
  mode: "horizontal" | "vertical" | undefined;
  initialSizes: string[] | []; // Default to an empty array
  minSizes: number[] | []; // Default to an empty array
  maxSizes: number[] | [];
  enableSessionStorage: boolean;
  collapsed: boolean[] | [];
  height: string | null;
  width: string | null;
}

interface ISplitState {
  dragging: boolean;
}

/**
 * Split component for creating resizable split panes.
 */
class Split extends React.Component<SplitProps & { splitStateContext: SplitStateContextType }, ISplitState> {
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
  public state: ISplitState = {
    dragging: false,
  };
  private currentInstanceProps: SplitState = {
    children: null,
    disable: null,
    lineBar: null,
    visible: null,
    initialSize: null,
    collapsed: null,
    maxSize: null,
    minSize: null,
    modes: null,
    enableLocalStorage: null,
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
  private paneConfig: {
    minPrevSize: null | string;
    maxPrevSize: null | string;
    minNextSize: null | string;
    maxNextSize: null | string;
    prevElement: HTMLDivElement | null;
    nextElement: HTMLDivElement | null;
  } = {
    minPrevSize: null,
    maxPrevSize: null,
    minNextSize: null,
    maxNextSize: null,
    prevElement: null,
    nextElement: null,
  };

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

  constructor(props: SplitProps & { splitStateContext: SplitStateContextType }) {
    super(props);

    this.currentInstanceProps = {
      ...props.splitStateContext.splitState,
      modes: { ...props.splitStateContext.splitState.modes, [props.id]: props.mode! },
      children: {
        ...props.splitStateContext.splitState.children,
        [props.id]: React.Children.toArray(props.children),
      },
      initialSize: {
        ...props.splitStateContext.splitState.initialSize,
        [props.id]: props.initialSizes!,
      },
      collapsed: { ...props.splitStateContext.splitState.collapsed, [props.id]: props.collapsed! },
      visible: {
        ...props.splitStateContext.splitState.visible,
        [props.id]: props.visible ?? props.visiable,
      },
      disable: { ...props.splitStateContext.splitState.disable, [props.id]: props.disable },
      lineBar: { ...props.splitStateContext.splitState.lineBar, [props.id]: props.lineBar },
      maxSize: {
        ...props.splitStateContext.splitState.maxSize,
        [props.id]:
          !props.maxSizes === undefined || (Array.isArray(props.maxSizes) && props.maxSizes.length === 0)
            ? [...Array(React.Children.toArray(props.children).length).fill(100)]
            : props.maxSizes,
      },
      minSize: {
        ...props.splitStateContext.splitState.minSize,
        [props.id]:
          props.minSizes === undefined || (Array.isArray(props.minSizes) && props.minSizes.length === 0)
            ? [...Array(React.Children.toArray(props.children).length).fill(0)]
            : props.minSizes,
      },
    };

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
    this.props.splitStateContext.setSplitState((prev) => ({
      ...prev,
      ...this.currentInstanceProps,
    }));
    // Set initial sizes when the component mounts
    this.setInitialSizes();
  }

  public componentDidUpdate(prevProps: Readonly<SplitProps & { splitStateContext: SplitStateContextType }>, prevState: Readonly<ISplitState>, snapshot?: any): void {
    const { splitState } = this.props.splitStateContext;

    if (
      prevProps.splitStateContext.splitState.children !== splitState.children &&
      this.arraysAreEqual(prevProps.splitStateContext.splitState.initialSize, splitState.initialSize) &&
      this.arraysAreEqual(prevProps.splitStateContext.splitState.collapsed, splitState.collapsed)
    ) {
      this.resetInitialSizes();
    }
  }

  arraysAreEqual(arr1: any, arr2: any) {
    if (!arr1) return false;
    if (!arr2) return false;

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Compare each element in the arrays
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] === arr2[i]) {
        return false;
      }
    }

    // If no elements are different, the arrays are equal
    return true;
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
   * Adds a new pane to the state based on provided configurations.
   * @param id Identifier for the new pane.
   * @param newChild React node representing the content of the new pane.
   * @param setcurrentPaneSize Array of strings representing current pane sizes.
   * @param newPaneConfig Configuration object for the new pane (optional).
   */
  public addPane(
    id: string,
    newChild: React.ReactNode,
    setcurrentPaneSize: Array<string>,
    newPaneConfig: {
      newChildPosition: number | -1;
      collapsed: boolean;
      initialSize: string;
      minSize: number;
      maxSize: number;
      lineBar: number | null;
      visible: number | null;
      disable: number | null;
    } = {
      collapsed: false,
      disable: null,
      initialSize: "",
      lineBar: null,
      maxSize: 100,
      minSize: 0,
      visible: null,
      newChildPosition: -1,
    }
  ) {
    const { setSplitState, splitState } = this.props.splitStateContext;
    // Check if this.state and this.state.modes are defined
    if (splitState && splitState.modes) {
      // Reset local storage related to the mode of the pane being added
      SplitUtils.resetLocalStorageOnPaneAddOrRemove(splitState.modes[id]);
      if (newPaneConfig["newChildPosition"] !== -1) {
        newPaneConfig["newChildPosition"] -= 1;
      }
      // Update state using functional setState to ensure correct previous state handling
      setSplitState((prevState) => {
        // Convert newChild to an array of React elements
        const newChildEle = React.Children.toArray(newChild);

        // Clone necessary collections from prevState or initialize them if undefined
        const collapsedCollection = [...prevState.collapsed![id]];
        let disabledCollection =
          prevState.disable && prevState.disable[id] !== undefined && prevState.disable[id] !== null
            ? Array.isArray(prevState.disable[id])
              ? [...(prevState.disable[id] as number[])]
              : prevState.disable[id]
            : null;
        let visibleCollection =
          prevState.visible && prevState.visible[id] !== undefined && prevState.visible[id] !== null
            ? Array.isArray(prevState.visible[id])
              ? [...(prevState.visible[id] as number[])]
              : prevState.visible[id]
            : null;
        let lineBarCollection =
          prevState.lineBar && prevState.lineBar[id] !== undefined && prevState.lineBar[id] !== null
            ? Array.isArray(prevState.lineBar)
              ? [...(prevState.lineBar[id] as number[])]
              : prevState.lineBar[id]
            : null;
        const initialSizeCollection = [...setcurrentPaneSize];
        const maxSizeCollection = prevState.maxSize && prevState.maxSize[id] !== undefined && prevState.maxSize[id] !== null ? [...(prevState.maxSize[id] as number[])] : undefined;
        const minSizeCollection = prevState.minSize && prevState.minSize[id] !== undefined && prevState.minSize[id] !== null ? [...(prevState.minSize[id] as number[])] : undefined;

        // Update disabledCollection based on newPaneConfig
        if (newPaneConfig && newPaneConfig["disable"] != null) {
          if (Array.isArray(disabledCollection)) {
            disabledCollection =
              newPaneConfig["newChildPosition"] !== -1
                ? [...disabledCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["disable"], ...disabledCollection.slice(newPaneConfig["newChildPosition"])]
                : [...disabledCollection, newPaneConfig["disable"]];
          } else if (typeof disabledCollection === "boolean") {
            disabledCollection = [newPaneConfig["disable"]];
          }
        }

        // Update visibleCollection based on newPaneConfig
        if (newPaneConfig && newPaneConfig["visible"] != null) {
          if (Array.isArray(visibleCollection)) {
            visibleCollection =
              newPaneConfig["newChildPosition"] !== -1
                ? [...visibleCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["visible"], ...visibleCollection.slice(newPaneConfig["newChildPosition"])]
                : [...visibleCollection, newPaneConfig["visible"]];
          } else if (typeof visibleCollection === "boolean") {
            visibleCollection = [newPaneConfig["visible"]];
          }
        }

        // Update lineBarCollection based on newPaneConfig
        if (newPaneConfig && newPaneConfig["lineBar"] != null) {
          if (Array.isArray(lineBarCollection)) {
            lineBarCollection =
              newPaneConfig["newChildPosition"] !== -1
                ? [...lineBarCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["lineBar"], ...lineBarCollection.slice(newPaneConfig["newChildPosition"])]
                : [...lineBarCollection, newPaneConfig["lineBar"]];
          } else if (typeof lineBarCollection === "boolean") {
            lineBarCollection = [newPaneConfig["lineBar"]];
          }
        }

        // Check if prevState contains children for the specified id
        if (prevState && prevState["children"] && prevState["children"][id]) {
          // Clone childrenCollection from prevState
          const childrenCollection = [...prevState.children[id]];

          // Return updated state object
          return {
            ...prevState,
            children: {
              ...prevState.children,
              [id]:
                newPaneConfig["newChildPosition"] !== -1
                  ? [...childrenCollection.slice(0, newPaneConfig["newChildPosition"]), ...newChildEle, ...childrenCollection.slice(newPaneConfig["newChildPosition"])]
                  : [...prevState.children[id], ...newChildEle],
            },
            collapsed: {
              ...prevState.collapsed,
              [id]:
                newPaneConfig["newChildPosition"] !== -1
                  ? [
                      ...collapsedCollection.slice(0, newPaneConfig["newChildPosition"]),
                      newPaneConfig["collapsed"],
                      ...collapsedCollection.slice(newPaneConfig["newChildPosition"]),
                    ]
                  : [...collapsedCollection, newPaneConfig["collapsed"]],
            },
            disable: { ...prevState.disable, [id]: disabledCollection },
            visible: { ...prevState.visible, [id]: visibleCollection },
            lineBar: { ...prevState.lineBar, [id]: lineBarCollection },
            initialSize: {
              ...prevState.initialSize,
              [id]:
                newPaneConfig["newChildPosition"] !== -1
                  ? [
                      ...initialSizeCollection.slice(0, newPaneConfig["newChildPosition"]),
                      newPaneConfig["initialSize"],
                      ...initialSizeCollection.slice(newPaneConfig["newChildPosition"]),
                    ]
                  : [...initialSizeCollection, newPaneConfig["initialSize"]],
            },
            maxSize: {
              ...prevState.maxSize,
              [id]: maxSizeCollection
                ? newPaneConfig["newChildPosition"] !== -1
                  ? [...maxSizeCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["maxSize"], ...maxSizeCollection.slice(newPaneConfig["newChildPosition"])]
                  : [...maxSizeCollection, newPaneConfig["maxSize"]]
                : undefined,
            },
            minSize: {
              ...prevState.minSize,
              [id]: minSizeCollection
                ? newPaneConfig["newChildPosition"] !== -1
                  ? [...minSizeCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["minSize"], ...minSizeCollection.slice(newPaneConfig["newChildPosition"])]
                  : [...minSizeCollection, newPaneConfig["minSize"]]
                : undefined,
            },
          };
        }

        // Fallback return in case prevState or prevState.children[id] is undefined
        return {
          ...splitState,
          children: {
            ...splitState.children,
            [id]: [newChild],
          },
          collapsed: {
            ...prevState.collapsed,
            [id]:
              newPaneConfig["newChildPosition"] !== -1
                ? [...collapsedCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["collapsed"], ...collapsedCollection.slice(newPaneConfig["newChildPosition"])]
                : [...collapsedCollection, newPaneConfig["collapsed"]],
          },
          disable: { ...prevState.disable, [id]: disabledCollection },
          visible: { ...prevState.visible, [id]: visibleCollection },
          lineBar: { ...prevState.lineBar, [id]: lineBarCollection },
          initialSize: {
            ...prevState.initialSize,
            [id]:
              newPaneConfig["newChildPosition"] !== -1
                ? [
                    ...initialSizeCollection.slice(0, newPaneConfig["newChildPosition"]),
                    newPaneConfig["initialSize"],
                    ...initialSizeCollection.slice(newPaneConfig["newChildPosition"]),
                  ]
                : [...initialSizeCollection, newPaneConfig["initialSize"]],
          },
          maxSize: {
            ...prevState.maxSize,
            [id]: maxSizeCollection
              ? newPaneConfig["newChildPosition"] !== -1
                ? [...maxSizeCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["maxSize"], ...maxSizeCollection.slice(newPaneConfig["newChildPosition"])]
                : [...maxSizeCollection, newPaneConfig["maxSize"]]
              : undefined,
          },
          minSize: {
            ...prevState.minSize,
            [id]: minSizeCollection
              ? newPaneConfig["newChildPosition"] !== -1
                ? [...minSizeCollection.slice(0, newPaneConfig["newChildPosition"]), newPaneConfig["minSize"], ...minSizeCollection.slice(newPaneConfig["newChildPosition"])]
                : [...minSizeCollection, newPaneConfig["minSize"]]
              : undefined,
          },
        };
      });
    }
  }

  /**
   * Removes a pane at the specified position from the state, distributing its size among remaining panes.
   * @param id - The identifier of the pane to remove.
   * @param panePosition - The position of the pane to remove.
   */
  public removePane(id: string, panePosition: number): void {
    /**
     * Distributes the size of the removed pane among the remaining panes.
     * @param sizes - Array of sizes to distribute.
     * @param position - Position of the removed pane.
     * @returns Updated array of sizes after distribution.
     */
    function distributeSize(sizes: string[], position: number): string[] {
      const removedSize = sizes.splice(position, 1); // Remove the size at the specified position
      const distributeSizeValue = parseFloat(removedSize[0]) / sizes.length; // Calculate size to distribute
      for (let i = 0; i < sizes.length; i++) {
        // Distribute the size among remaining panes
        sizes[i] = `${parseFloat(sizes[i]) + distributeSizeValue}${sizes[i].includes("%") ? "%" : "px"}`;
      }
      return sizes;
    }

    const { setSplitState } = this.props.splitStateContext;
    // remove local storage for removing conflict with previous layout which does not match with current layout
    SplitUtils.resetLocalStorageOnPaneAddOrRemove("horizontal");
    // Update the state using prevState to ensure state consistency
    setSplitState((prevState) => {
      if (prevState) {
        // Destructure state properties

        const { children, collapsed, disable, lineBar, maxSize, minSize, visible } = prevState;

        // Create deep copies of state properties to avoid mutation
        const newCollapsed = collapsed ? { ...collapsed, [id]: [...collapsed[id]] } : {};
        const newMaxSize = maxSize ? { ...maxSize, [id]: maxSize[id] ? [...(maxSize[id] as number[])] : [] } : {};
        const newMinSize = minSize ? { ...minSize, [id]: minSize[id] ? [...(minSize[id] as number[])] : [] } : {};
        const newChildren = children ? { ...children, [id]: [...children[id]] } : {};
        const newLineBar = lineBar
          ? {
              ...lineBar,
              [id]: Array.isArray(lineBar[id]) ? [...(lineBar[id] as number[])] : lineBar[id],
            }
          : {};
        const newVisible = visible
          ? {
              ...visible,
              [id]: Array.isArray(visible[id]) ? [...(visible[id] as number[])] : visible[id],
            }
          : {};
        const newDisable = disable
          ? {
              ...disable,
              [id]: Array.isArray(disable[id]) ? [...(disable[id] as number[])] : disable[id],
            }
          : {};

        // Remove the pane from respective arrays
        newCollapsed[id].splice(panePosition - 1, 1);
        newMaxSize[id]?.splice(panePosition - 1, 1);
        newMinSize[id]?.splice(panePosition - 1, 1);
        newChildren[id].splice(panePosition - 1, 1);
        if (Array.isArray(newLineBar[id])) (newLineBar[id] as number[])?.splice(panePosition - 1, 1);
        if (Array.isArray(newVisible[id])) (newVisible[id] as number[])?.splice(panePosition - 1, 1);
        if (Array.isArray(newDisable[id])) (newDisable[id] as number[])?.splice(panePosition - 1, 1);

        // Return updated state object with modified pane sizes
        return {
          ...prevState,
          initialSize:
            prevState.initialSize && prevState.initialSize[id]
              ? {
                  ...prevState.initialSize,
                  [id]: distributeSize([...prevState.initialSize[id]], panePosition),
                }
              : { ...prevState.initialSize },
          collapsed: { ...newCollapsed },
          maxSize: { ...newMaxSize },
          minSize: { ...newMinSize },
          children: { ...newChildren },
          lineBar: { ...newLineBar },
          visible: { ...newVisible },
          disable: { ...newDisable },
        };
      }

      return prevState; // Return previous state if undefined
    });
  }

  /**
   * Invoke Set initial sizes for the panes on state updates.
   */
  private resetInitialSizes(): void {
    const { splitState } = this.props.splitStateContext;

    if (splitState.modes && splitState.initialSize) {
      splitState.children &&
        Object.keys(splitState.children).map((item: any, index: number) => {
          this.setInitialSizes({
            mode: splitState.modes![item],
            initialSizesConfig: splitState.initialSize?.[item],
            collapseConfig: splitState.collapsed?.[item],
            maxSizeConfig: splitState.maxSize?.[item],
            minSizeConfig: splitState.minSize?.[item],
          });
          return item;
        });
    }
  }

  /**
   * Set initial sizes for the panes.
   */
  private setInitialSizes(
    config: {
      mode: "horizontal" | "vertical";
      initialSizesConfig: string[] | undefined;
      collapseConfig: boolean[] | undefined;
      maxSizeConfig: number[] | undefined;
      minSizeConfig: number[] | undefined;
    } | null = null
  ): void {
    let { mode, initialSizes } = this.props;
    const sections = this.warpper?.children;

    mode = config?.["mode"] || mode;

    if (mode === this.HORIZONTAL && this.warpper) {
      if (!this.warpper.classList.contains("a-split-horizontal")) {
        return;
      }
    } else {
      if (this.warpper && !this.warpper.classList.contains("a-split-vertical")) {
        return;
      }
    }

    if (sections && sections.length > 0) {
      SplitUtils.setWrapper(this.warpper, mode, { [this.props.id]: this.props.onLayoutChange } as any, this.props.enableSessionStorage);
      // on the basis of given id by user setting instance. Id is the key to correctly access the instance.
      if (this.props.id) {
        SplitUtils.setSplitPaneInstance({
          [this.props.id]: this.warpper,
        });
      }

      const initialSizeProps = config?.["initialSizesConfig"] || initialSizes;
      const collpasedProps = config?.["collapseConfig"] || this.props.collapsed;
      const maxSizeProps = config?.["maxSizeConfig"] || this.props.maxSizes;
      const minSizeProps = config?.["minSizeConfig"] || this.props.minSizes;

      const userLayoutDefault = this.userSession.GetSession(mode!);
      const totalPaneSize = (sections.length + 1) / 2;
      const totalHandleCount = Math.abs((sections.length + 1) / 2 - sections.length);
      // for maintaing perfect size, exclude the handle bar sizes which can not be calculated dynamically.
      // Because pseudo element can not be accessed by javascript.
      // Noteable issue: If user tries to modify the css of handlebar this size will cause issue and splitter can show unexpected behaviour.
      const totalHandleBarLayoutValue = (this.handleBarLayoutInfo.marginLeft + this.handleBarLayoutInfo.marginRight + this.handleBarLayoutInfo.width) * totalHandleCount;
      const sizeToReduce = totalHandleBarLayoutValue / totalPaneSize;
      let sectionCounter = 1;
      let lastNonCollapsiblePane = -1,
        encounterCollapse = false;

      // if initialSize props are given distributing the width and height.
      if (initialSizeProps && initialSizeProps.length > 0) {
        let indexCounter = 0;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].classList.contains("a-split-control-pane")) {
            const size = initialSizeProps[indexCounter];
            const sectionIndex = i; // Each section has a content and separator element

            if (sections.length > sectionIndex) {
              const contentTarget = sections[sectionIndex] as HTMLDivElement;

              // if localStorage storage is enabled then check localStorage have some stored data related to splitter and set the size
              if (userLayoutDefault && userLayoutDefault.length > 0 && userLayoutDefault.length === initialSizeProps.length && this.props.enableSessionStorage) {
                if (userLayoutDefault[indexCounter]["flexGrow"] === "-1") {
                  contentTarget.style.flexBasis = userLayoutDefault[indexCounter]["flexBasis"];
                } else {
                  if (userLayoutDefault[indexCounter]["flexGrow"] === "0") {
                    contentTarget.classList.add("a-split-hidden");
                  }
                  contentTarget.style.flexBasis = userLayoutDefault[indexCounter]["flexBasis"];
                  contentTarget.style.flexGrow = userLayoutDefault[indexCounter]["flexGrow"];
                }
              } else {
                const getDimension = contentTarget.parentElement?.getBoundingClientRect();
                if (sizeToReduce > -1) {
                  if (size && size.includes("%")) {
                    contentTarget.style.flexBasis = `${
                      parseFloat(size) - SplitUtils.pixelToPercentage(sizeToReduce, `${mode === this.HORIZONTAL ? getDimension?.width : getDimension?.height}px`)
                    }%`;
                  } else {
                    contentTarget.style.flexBasis = `${parseFloat(size) - sizeToReduce}px`;
                  }
                } else {
                  contentTarget.style.flexBasis = `${size}`;
                }

                if (!collpasedProps![indexCounter] || false) {
                  lastNonCollapsiblePane = sectionIndex;
                }

                // by default not collapsing any horizontal
                if (collpasedProps![indexCounter] || false) {
                  contentTarget.style.flexGrow = "0";
                  contentTarget.classList.add("a-split-hidden");
                  encounterCollapse = true;
                }
              }

              // setting min and max limit by default 0 and 100
              contentTarget.setAttribute("min-size", `${minSizeProps![indexCounter] || 0}`);
              contentTarget.setAttribute("max-size", `${maxSizeProps![indexCounter] || 100}`);

              // remove handlebar icons if some sections are closed
              ManageHandleBar.removeHandleIconOnClose(
                this.warpper,
                sectionCounter++,
                SplitUtils.modeWrapper,
                SplitUtils.cachedMappedSplitPanePosition,
                mode === this.HORIZONTAL ? "horizontal" : "vertical"
              );

              ++indexCounter;
            }
          }
        }
      }

      // if initialSize props are not given
      // this will dynamically distribute the layout width according to parent width and height.
      if (initialSizeProps && initialSizeProps.length === 0) {
        let counter = 0;
        for (let pane = 0; pane < sections.length; pane++) {
          if (sections[pane].classList.contains("a-split-control-pane")) {
            const contentTarget = sections[pane] as HTMLDivElement;
            const getDimension = contentTarget.parentElement?.getBoundingClientRect();
            contentTarget.style.flexBasis = `${(mode === this.HORIZONTAL ? getDimension?.width! : getDimension?.height!) / totalPaneSize - sizeToReduce}px`;
            // setting min and max limit by default 0 and 100
            contentTarget.setAttribute("min-size", `${minSizeProps![counter] || 0}`);
            contentTarget.setAttribute("max-size", `${maxSizeProps![counter] || 100}`);

            if (!collpasedProps![counter] || false) {
              lastNonCollapsiblePane = pane;
            }

            // by default not collapsing any horizontal
            if (collpasedProps![counter] || false) {
              contentTarget.style.flexGrow = "0";
              contentTarget.classList.add("a-split-hidden");
              encounterCollapse = true;
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
      }

      if (lastNonCollapsiblePane > -1 && encounterCollapse) {
        if (sections[lastNonCollapsiblePane]) {
          (sections[lastNonCollapsiblePane] as HTMLDivElement).style.flexGrow = "1";
          encounterCollapse = false;
        }
      }

      // Remove the stored layout from localStorage if the current splitter panes configuration differs
      // from the stored configuration (e.g., the number of panes does not match).
      if (userLayoutDefault && initialSizeProps && userLayoutDefault.length > 0 && userLayoutDefault.length !== initialSizeProps.length) {
        if (mode === this.HORIZONTAL) {
          SplitUtils.resetLocalStorageOnPaneAddOrRemove("horizontal");
        } else {
          SplitUtils.resetLocalStorageOnPaneAddOrRemove("vertical");
        }
      }

      setTimeout(() => {
        if (userLayoutDefault && userLayoutDefault.length === 0) {
          if (mode === this.HORIZONTAL) {
            SplitUtils.saveHorizontalSizesToLocalStorage();
          } else {
            SplitUtils.saveVerticalSizesToLocalStorage();
          }
        }
      }, 600);
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
            nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis)}px`;
          } else {
            nextTarget.style.flexBasis = `${this.nextSize - SplitUtils.pixelToPercentage(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)}%`;
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
          const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth) < 0;
          if (limit) return;
          if (nextTarget.style.flexBasis.includes("px")) {
            nextTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)
            }px`;
          } else {
            nextTarget.style.flexBasis = `${this.nextSize - parseFloat(this.prevToPrev.style.flexBasis)}%`;
          }
          prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth)}px`;
        } else {
          // Calculate the new value for the previous target in pixels
          prevTargetVal = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth);
        }
      } else if (this.prevToPrev.style.flexBasis.includes("px") && prevTarget.style.flexBasis.includes("px")) {
        pixel = true;
        // distributing size
        if (prevTarget.style.flexGrow === "") {
          const limit = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis) < 0;
          if (limit) return;
          if (nextTarget.style.flexBasis.includes("px")) {
            nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - parseFloat(this.prevToPrev.style.flexBasis)}px`;
          } else {
            nextTarget.style.flexBasis = `${this.nextSize - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)}%`;
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
              SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.prevToPrev.style.flexBasis), referenceWidth)
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
            prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis)}px`;
          } else {
            prevTarget.style.flexBasis = `${this.preSize - SplitUtils.pixelToPercentage(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)}%`;
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
          const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth) < 0;
          if (limit) return;
          if (prevTarget.style.flexBasis.includes("px")) {
            prevTarget.style.flexBasis = `${
              SplitUtils.percentageToPixel(this.preSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)
            }px`;
          } else {
            prevTarget.style.flexBasis = `${this.preSize - parseFloat(this.nextToNext.style.flexBasis)}%`;
          }
          nextTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.nextSize, referenceWidth)}px`;
        } else {
          // Calculate the new value for the next target in pixels
          nextTargetVal = SplitUtils.percentageToPixel(this.nextSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth);
        }
      } else if (this.nextToNext.style.flexBasis.includes("px") && nextTarget.style.flexBasis.includes("px")) {
        pixel = true;
        // distributing size
        if (nextTarget.style.flexGrow === "") {
          const limit = SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis) < 0;
          if (limit) return;
          if (prevTarget.style.flexBasis.includes("px")) {
            prevTarget.style.flexBasis = `${SplitUtils.percentageToPixel(this.preSize, referenceWidth) - parseFloat(this.nextToNext.style.flexBasis)}px`;
          } else {
            prevTarget.style.flexBasis = `${this.preSize - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)}%`;
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
              SplitUtils.percentageToPixel(this.preSize, referenceWidth) - SplitUtils.percentageToPixel(parseFloat(this.nextToNext.style.flexBasis), referenceWidth)
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
   * Checks if resizing boundaries are reached for the previous and next targets.
   * @param prevTarget - The previous target HTMLDivElement.
   * @param nextTarget - The next target HTMLDivElement.
   * @param preSize - The size of the previous target.
   * @param nextSize - The size of the next target.
   * @returns 1 if resizing boundary is reached, otherwise 0.
   */
  private checkResizingBound(prevTarget: HTMLDivElement | null, nextTarget: HTMLDivElement | null, preSize: number, nextSize: number) {
    // Check if both previous and next targets exist.
    if (prevTarget && nextTarget) {
      // Check if minimum size constraints are set and reached.
      if (this.paneConfig["minPrevSize"] && preSize <= parseInt(this.paneConfig["minPrevSize"])) return 1;
      if (this.paneConfig["minNextSize"] && nextSize <= parseInt(this.paneConfig["minNextSize"])) return 1;
    }
    // Check if both previous and next targets exist.
    if (prevTarget && nextTarget) {
      // Check if maximum size constraints are set and reached.
      if (this.paneConfig["maxPrevSize"] && preSize >= parseInt(this.paneConfig["maxPrevSize"])) return 1;
      if (this.paneConfig["maxNextSize"] && nextSize >= parseInt(this.paneConfig["maxNextSize"])) return 1;
    }

    // Ensure the paneConfig is properly initialized before updating pane sizes.
    // Issue: During rapid or sudden mouse movements, the paneConfig may become null or invalid (missing nextElement or prevElement).
    // This causes unintended behavior where the pane moves beyond the specified min and max boundaries.
    // Resolution: Prevent updating pane sizes unless paneConfig has valid references to both previous and next elements.
    // This safeguard ensures resizing logic only operates on properly initialized and updated elements.
    if (prevTarget && nextTarget) {
      if (!this.paneConfig["nextElement"] && !this.paneConfig["prevElement"]) {
        return 1;
      }
    }

    return 0;
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
    if ((env.target as HTMLDivElement).classList.contains("a-splitter-handlebar-icon") || (env.target as HTMLDivElement).classList.contains("a-splitter-collapse-icon")) {
      this.target = (env.target as HTMLDivElement).parentElement as HTMLDivElement;
    } else {
      this.target = env.target as HTMLDivElement;
    }
    const prevTarget = this.target.previousElementSibling;
    const nextTarget = this.target.nextElementSibling;
    this.paneConfig = {
      ...this.paneConfig,
      prevElement: prevTarget as HTMLDivElement,
      nextElement: nextTarget as HTMLDivElement,
    };
    this.boxWidth = this.warpper.offsetWidth;
    this.boxHeight = this.warpper.offsetHeight;
    if (prevTarget) {
      this.preWidth = (prevTarget as HTMLElement).offsetWidth;
      this.preHeight = (prevTarget as HTMLElement).offsetHeight;
      this.paneConfig = {
        ...this.paneConfig,
        minPrevSize: prevTarget.getAttribute("min-size"),
        maxPrevSize: prevTarget.getAttribute("max-size"),
      };
    }
    if (nextTarget) {
      this.nextWidth = (nextTarget as HTMLElement).offsetWidth;
      this.nextHeight = (nextTarget as HTMLElement).offsetHeight;
      this.paneConfig = {
        ...this.paneConfig,
        minNextSize: nextTarget.getAttribute("min-size"),
        maxNextSize: nextTarget.getAttribute("max-size"),
      };
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
    const nextTarget = this.paneConfig.nextElement;
    const prevTarget = this.paneConfig.prevElement;

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
        if (this.checkResizingBound(prevTarget, nextTarget, this.preSize, this.nextSize)) return;
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
        if (this.checkResizingBound(prevTarget, nextTarget, this.preSize, this.nextSize)) return;
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
    this.paneConfig = {
      maxNextSize: null,
      maxPrevSize: null,
      minNextSize: null,
      minPrevSize: null,
      prevElement: null,
      nextElement: null,
    };
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
    const { splitState } = this.props.splitStateContext;
    const { children } = splitState;
    // Generate CSS classes based on component state
    const cls = [prefixCls, className, `${prefixCls}-${mode}`, dragging ? "dragging" : null, fixClass ? "a-split-pane-fix a-split-pane-helper-fix" : null]
      .filter(Boolean)
      .join(" ")
      .trim();
    // if (children) {
    const child = React.Children.toArray(children![id]);
    // Extract needed props from the remaining props
    const { initialSizes, minSizes, maxSizes, enableSessionStorage, collapsed, height, width, onLayoutChange, splitStateContext, ...neededProps } = other;
    return (
      <div className={cls} {...neededProps} ref={(node) => (this.warpper = node)} style={{ height: height || "", width: width || "", ...neededProps.style }} id={id}>
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
          const visibleBar =
            splitState.visible?.[id] === true ||
            (splitState.visible && Array.isArray(splitState.visible?.[id]) && (splitState.visible?.[id] as number[])?.includes((idx + 1) as never)) ||
            false;
          const barProps = {
            className: [`${prefixCls}-bar`].filter(Boolean).join(" ").trim(),
          };
          // lineBar ? `${prefixCls}-line-bar` : null, !lineBar ? `${prefixCls}-large-bar` : null
          if (
            idx !== 0 &&
            (splitState.lineBar?.[id] === true || (splitState.lineBar && Array.isArray(splitState.lineBar?.[id]) && (splitState.lineBar?.[id] as number[])?.includes(idx)))
          ) {
            barProps.className = [barProps.className, splitState.lineBar?.[id] ? `${prefixCls}-line-bar` : null].filter(Boolean).join(" ").trim();
          }
          if (
            idx !== 0 &&
            (splitState.disable?.[id] === true || (splitState.disable && Array.isArray(splitState.disable?.[id]) && (splitState.disable?.[id] as number[])?.includes(idx)))
          ) {
            barProps.className = [barProps.className, splitState.disable?.[id] ? "a-split-handle-disable" : null].filter(Boolean).join(" ").trim();
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
              {React.cloneElement(element && element.props && (element.props.mode === "horizontal" || element.props.mode === "vertical") ? element : <div>{element}</div>, {
                ...props,
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
    // }
  }
}

export default withSplitState(Split);
