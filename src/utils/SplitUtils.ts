import LayoutHelper from "../helper/LayoutHelper";
import ManageHandleBar from "../helper/ManageHandleBar";
import SplitSessionStorage, { ISplitSessionStorage } from "./SplitSessionStorage";

type Orientation = "horizontal" | "vertical";
type Instance = Element | null;
export type paneStatus = "open" | "close" | "added" | "removed" | "unknown";

// Define the SplitUtils class
class SplitUtils {
  // constant variables
  private static TOP = "top";
  private static BOTTOM = "bottom";
  private static LEFT = "left";
  private static RIGHT = "right";
  private static HORIZONTAL: Orientation = "horizontal";
  private static VERTICAL: Orientation = "vertical";
  private static SECTION_CLASS_HIDE = "a-split-hidden";
  private static FIX_CLASS = "a-split-pane-fix";
  private static FIX_HELPER_CLASS = "a-split-pane-helper-fix";

  // callback prop
  static layoutCallback?: {
    [key: string]: (
      sectionNumber: number,
      paneId: string,
      reason: string | paneStatus,
      direction: "left" | "right" | "top" | "bottom" | null
    ) => void | null | undefined;
  } = {};

  // Reference to the HTML wrapper element for split panes
  static wrapper: HTMLDivElement | null = null;

  // Default split mode ("horizontal")
  static mode = "horizontal";

  // Wrapper elements for both horizontal and vertical modes
  static modeWrapper: Record<string, HTMLDivElement | HTMLElement | null> = {
    horizontal: null,
    vertical: null,
  };

  // Interface for user session storage
  static userSession: ISplitSessionStorage;

  // Flags to enable or disable session storage for both modes
  static enableSessionStorage = {
    horizontal: false,
    vertical: false,
  };

  // Cached split pane positions for both modes
  static cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null> = {
    horizontal: null,
    vertical: null,
  };

  static splitPaneInstance: Record<string, Instance> | null = null;

  /**
   * Sets the wrapper, mode, and other configurations for the SplitUtils.
   * @param wrapper - HTMLDivElement that wraps the split panes.
   * @param mode - Split mode, either "horizontal" or "vertical".
   * @param enableSessionStorage - Flag to enable session storage for storing split sizes.
   */
  static setWrapper(
    wrapper: HTMLDivElement | null,
    mode: Orientation = "horizontal",
    callback: {
      [key: string]: (
        sectionNumber: number,
        paneId: string,
        reason: string | paneStatus,
        direction: "left" | "right" | "top" | "bottom" | null
      ) => void | null | undefined;
    },
    enableSessionStorage = false
  ): void {
    // Set the wrapper, mode, and other configurations
    this.wrapper = wrapper;
    this.mode = mode;
    this.modeWrapper = {
      ...this.modeWrapper,
      [mode]: wrapper,
    };
    this.userSession = new SplitSessionStorage();
    this.enableSessionStorage[mode] = enableSessionStorage;
    this.cachedMappedSplitPanePosition[mode] = null;
    LayoutHelper.mapElementPosition(null, this.modeWrapper, mode, this.cachedMappedSplitPanePosition);
    this.layoutCallback = {
      ...this.layoutCallback,
      ...callback,
    };
  }

  /**
   * Returns the combined class names for fixing purposes.
   * @returns {string} Combined class names.
   */
  static fixClass(): string {
    return this.FIX_CLASS + " " + this.FIX_HELPER_CLASS;
  }

  /**
   * Sets the split pane instance.
   * @param {Record<string, Instance>} instance - The instance to set.
   */
  static setSplitPaneInstance(instance: Record<string, Instance>): void {
    // If splitPaneInstance already exists, merge the new instance with the existing one
    if (this.splitPaneInstance) {
      this.splitPaneInstance = {
        ...this.splitPaneInstance,
        ...instance,
      };
    } else {
      // Otherwise, set the splitPaneInstance to the new instance
      this.splitPaneInstance = {
        ...instance,
      };
    }
  }

  /**
   * Gets the split pane instance.
   * @returns {Record<string, Instance>} The split pane instance.
   */
  public static getSplitPaneInstance() {
    return this.splitPaneInstance;
  }

  /**
   * Calculates the position of the handlebar based on the position of the section.
   * @param handlePosition The position of the section.
   * @returns The position of the handlebar.
   */
  static getHandlebarPosition(handlePosition: number): number {
    // Ensure handlePosition is valid
    if (handlePosition < 1) {
      console.error("Section index must be greater than or equal to 1.");
      return -1; // Return -1 indicating an error if handlePosition is less than 1
    }

    // Calculate handlebar index based on section index
    return handlePosition * 2 - 1; // Calculate the position of the handlebar using the section index
  }

  /**
   * Converts a percentage value to pixel value based on the reference width.
   * @param percentage The percentage value to convert.
   * @param referenceWidth The reference width against which the percentage is calculated.
   *                       Can be in viewport width (vw), viewport height (vh), percentage (%), or pixels (px).
   * @returns The corresponding pixel value.
   */
  static percentageToPixel(percentage: number, referenceWidth: string) {
    // Convert percentage to pixel value
    if (referenceWidth && referenceWidth.includes("vw")) {
      // Calculate pixel value based on viewport width
      return (percentage / 100) * window.innerWidth * (parseFloat(referenceWidth.replace("vw", "")) / 100);
    } else if (referenceWidth && referenceWidth.includes("vh")) {
      // Calculate pixel value based on viewport height
      return (percentage / 100) * window.innerHeight * (parseFloat(referenceWidth.replace("vh", "")) / 100);
    } else if (referenceWidth && referenceWidth.includes("%")) {
      // Calculate pixel value based on percentage of a parent element's width
      return (percentage / 100) * parseFloat(referenceWidth.replace("%", ""));
    } else {
      // Calculate pixel value based on explicit pixel value
      return (percentage / 100) * parseFloat(referenceWidth.replace("px", ""));
    }
  }

  /**
   * Converts a pixel value to percentage based on the reference width.
   * @param pixelValue The pixel value to convert.
   * @param referenceWidth The reference width against which the percentage is calculated.
   *                       Can be in viewport width (vw), viewport height (vh), percentage (%), or pixels (px).
   * @returns The corresponding percentage value.
   */
  static pixelToPercentage(pixelValue: number, referenceWidth: string) {
    // Convert pixel value to percentage
    if (referenceWidth.includes("vw")) {
      // Calculate percentage based on viewport width
      return (pixelValue / window.innerWidth) * 100;
    } else if (referenceWidth.includes("vh")) {
      // Calculate percentage based on viewport height
      return (pixelValue / window.innerHeight) * 100;
    } else if (referenceWidth.includes("px")) {
      // Calculate percentage based on explicit pixel value
      return (pixelValue / parseFloat(referenceWidth.replace("px", ""))) * 100;
    } else {
      // Calculate percentage based on percentage of a parent element's width
      return (pixelValue / parseFloat(referenceWidth.replace("%", ""))) * 100;
    }
  }

  /**
   * Checks if a specific split section is open.
   * @param sectionNumber - The section number to be checked.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @returns True if the section is open, false otherwise.
   */
  static isSectionOpen(instance: Instance, sectionNumber: number, splitMode: Orientation): boolean {
    // Implementation for checking if a specific split section is open
    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using isSectionOpen.");
      return false;
    }

    const sections = instance?.children || this.modeWrapper[splitMode]?.children;
    LayoutHelper.mapElementPosition(instance, this.modeWrapper, splitMode, this.cachedMappedSplitPanePosition, true);

    if (sections && sectionNumber > 0 && sections.length >= sectionNumber) {
      let sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, sectionNumber);

      if (sectionIndex == null || sectionIndex === undefined) {
        console.error(`Section number ${sectionIndex}. Provide correct section number.`);
        // @ts-ignore
        return;
      }

      if (sectionIndex !== null && sectionIndex !== undefined) {
        const currentTarget = sections[sectionIndex] as HTMLDivElement;
        return !currentTarget.classList.contains(this.SECTION_CLASS_HIDE);
      }
    }

    return false;
  }

  /**
   * Checks and adjusts the layout of split panes based on the specified split mode.
   * This function ensures that all sections are properly opened in the split panes.
   * @param splitMode The mode of splitting, either "horizontal" or "vertical".
   * @returns -1 if the wrapper is not set, otherwise no return value.
   */
  static reCheckPaneOpening(instance: Instance, splitMode: Orientation) {
    // Check if the wrapper is not set
    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using totalHandleCount.");
      return -1; // Return -1 indicating that the wrapper is not set
    }

    // Get the sections within the wrapper based on the split mode
    const sections = instance?.children || this.modeWrapper[splitMode]?.children;
    LayoutHelper.mapElementPosition(instance, this.modeWrapper, splitMode, this.cachedMappedSplitPanePosition, true);

    // Check if sections exist and the count is greater than 0
    if (sections && sections.length > 0) {
      // Get the total count of panes
      const totalPaneSize = this.totalPaneCount(instance, splitMode);

      // Initialize a counter for opened sections
      let openedSectionCount = 0;

      // Loop through each section to check if it is open
      for (let i = 1; i <= totalPaneSize; i++) {
        // Increment the opened section count if the section is open
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.isSectionOpen(instance, i, splitMode) ? ++openedSectionCount : openedSectionCount;
      }

      // Check if all sections are opened
      if (openedSectionCount === totalPaneSize) {
        // Loop through each section to remove flex-grow property if it's set to 1
        for (let i = 1; i <= totalPaneSize; i++) {
          // Get the index of the section based on the split pane position
          const sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, i);

          // Check if the section index is valid
          if (sectionIndex == null || sectionIndex === undefined) {
            console.error(`Section number ${sectionIndex}. Provide correct section number.`);
            return -1; // Exit the function if the section index is invalid
          }

          // Remove flex-grow property if it's set to 1
          if ((sections[sectionIndex] as HTMLElement).style.flexGrow === "1") {
            (sections[sectionIndex] as HTMLElement).style.removeProperty("flex-grow");
          }
        }
      }
    }
  }

  /**
   * Invokes the layout callback function for the specified pane or mode wrapper.
   * @param instance - The instance of the pane or null.
   * @param sectionNumber - The section number.
   * @param splitMode - The split mode (horizontal or vertical).
   * @param reason - The reason for invoking the layout callback.
   */
  static invokeLayoutCallback(
    instance: Instance = null,
    sectionNumber: number,
    splitMode: Orientation,
    reason: string | paneStatus = "unknown",
    direction: "left" | "right" | "top" | "bottom" | null = null
  ): void {
    if (!instance && !this.modeWrapper[splitMode]) {
      console.error("Missing instance.");
      return;
    }

    if (this.layoutCallback && !this.layoutCallback[instance!.getAttribute("id")!]) return;

    // If instance is provided, invoke layout callback for the specific pane.
    if (instance) {
      const paneId = instance.getAttribute("id");
      if (paneId) {
        this.layoutCallback?.[paneId](sectionNumber, paneId, reason, direction);
      }
    } else {
      // If instance is not provided, invoke layout callback for the mode wrapper.
      const paneId = this.modeWrapper[splitMode]?.getAttribute("id");
      if (paneId) {
        this.layoutCallback?.[paneId](sectionNumber, paneId, reason, direction);
      }
    }
  }

  /**
   * Closes a specific split section.
   * @param sectionNumber - The section number to be closed.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @param direction - The direction of the close operation, either "left", "right", "top", "bottom" or "null". Direction null is used only when not using arrow icon of handlebar to close the splitter.
   */
  static closeSplitter(
    instance: Instance = null,
    sectionNumber: number,
    splitMode: Orientation,
    reason: string | paneStatus = "close",
    direction: "left" | "right" | "top" | "bottom" | null = null
  ): void {
    // Implementation for closing a specific split section
    const mode = splitMode || this.mode;

    // if wrapper is not set throw error
    if (!this.modeWrapper[splitMode] && !instance) {
      console.error("Wrapper not set. Call setWrapper before using closeSplitter.");
      return;
    }

    // on the basis of mode getting sections element
    const sections = instance?.children || this.modeWrapper[splitMode]?.children;
    // updating cachedMappedSplitPanePosition
    LayoutHelper.mapElementPosition(instance, this.modeWrapper, splitMode, this.cachedMappedSplitPanePosition, true);

    if (sections && sectionNumber > 0 && sections.length >= sectionNumber) {
      // Retrieve the correct section position using the cached mapped split-pane position,
      // considering the specified split mode and section number. The 'LayoutHelper' object
      // contains the 'getSection' method responsible for this operation.
      const sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, sectionNumber);
      // throw error if sectionIndex is null or undefined
      if (sectionIndex == null || sectionIndex === undefined) {
        console.error(`Section number ${sectionIndex}. Provide correct section number.`);
        return;
      }
      // check valid sectionIndex
      if (sectionIndex != null && sectionIndex !== undefined) {
        const currentTarget = sections[sectionIndex] as HTMLDivElement; // current section
        const prevTarget = sections[sectionIndex - 2] as HTMLDivElement; // previous section
        // next section
        const nextTarget = sections[sectionIndex + 2] as HTMLDivElement;

        if (mode === this.HORIZONTAL && currentTarget) {
          // closing the current section
          currentTarget.style.flexGrow = "0";
          currentTarget.classList.add(this.SECTION_CLASS_HIDE);
          if (currentTarget.classList.contains(this.FIX_CLASS)) {
            currentTarget.classList.remove(this.FIX_CLASS);
          }

          /* 
            - Direction: Right
              - When the direction is specified as right, indicating the use of an arrow to close the section, the following actions need to be taken:
                - Grow the left section just behind the current section, identified as prevTarget.
                - Always ensure that prevTarget is available for this operation.

            - Direction: Left
              - Conversely, when the direction is given as left, signifying the use of an arrow to close the section, follow these steps:
                - Grow the right section just next to the current section, identified as nextTarget.
                - Always ensure that nextTarget is available for this operation.
          */
          if (direction === this.RIGHT) {
            prevTarget.style.flexGrow = "1";
          } else if (direction === this.LEFT) {
            nextTarget.style.flexGrow = "1";
          } else {
            if (nextTarget) {
              nextTarget.style.flexGrow = "1";
            } else {
              if (prevTarget) {
                prevTarget.style.flexGrow = "1";
              }
            }
          }

          // on closing section this function checks which arrow side(left/right) is need to be removed from drag handle bar.
          ManageHandleBar.removeHandleIconOnClose(instance, sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "horizontal");
          // on close storing user layout
          this.saveSizesToLocalStorage(this.HORIZONTAL);
        } else if (mode === this.VERTICAL && currentTarget) {
          /*
            - For vertical no closing direction is currently implemented.
            - Also no session storage is implemented for vertical closing. (Pending)
          */
          currentTarget.style.flexGrow = "0";
          currentTarget.classList.add(this.SECTION_CLASS_HIDE);
          if (currentTarget.classList.contains(this.FIX_CLASS)) {
            currentTarget.classList.remove(this.FIX_CLASS);
          }

          /* 
            - Direction: Bottom
            - Since direction is given bottom, that means arrow has been used to close the section.
            - In this scenario grow the top section which just behind the current section i.e., prevTarget
            - It is also keep in mind that always prevTarget will be available.

            - Direction: Top
            - Since direction is given top, that means arrow has been used to close the section.
            - In this scenario grow the bottom section which is just next to the current section i.e., nextTarget
            - It is also keep in mind that alaways nextTarget will be available.
          */
          if (direction === this.BOTTOM) {
            prevTarget.style.flexGrow = "1";
          } else if (direction === this.TOP) {
            nextTarget.style.flexGrow = "1";
          } else {
            if (nextTarget) {
              nextTarget.style.flexGrow = "1";
            } else {
              if (prevTarget) {
                prevTarget.style.flexGrow = "1";
              }
            }
          }

          // // on closing section this function checks which arrow side(left/right) is need to be removed from drag handle bar.
          ManageHandleBar.removeHandleIconOnClose(instance, sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "vertical");
          // on close storing user layout
          this.saveSizesToLocalStorage(this.VERTICAL);
        }

        this.invokeLayoutCallback(instance, sectionNumber, splitMode, reason, direction);
      }
    }
  }

  /**
   * Opens a specific split section with a new size.
   * @param sectionNumber - The section number to be opened.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @param direction - The direction of the open operation, either "left" or "right".
   */
  static openSplitter(
    instance: Instance = null,
    sectionNumber: number,
    splitMode: Orientation,
    reason: string | paneStatus = "open",
    direction: "left" | "right" | "top" | "bottom" | null = null
  ): void {
    // Implementation for opening a specific split section with a new size
    const mode = splitMode || this.mode;

    // if wrapper is not set throw error
    if (!this.modeWrapper[splitMode] && !instance) {
      console.error("Wrapper not set. Call setWrapper before using openSplitter.");
      return;
    }

    // on the basis of mode getting sections element
    const sections = instance?.children || this.modeWrapper[splitMode]?.children;
    // updating cachedMappedSplitPanePosition
    LayoutHelper.mapElementPosition(instance, this.modeWrapper, splitMode, this.cachedMappedSplitPanePosition, true);

    if (sections && sectionNumber > 0 && sections.length >= sectionNumber) {
      // Retrieve the correct section position using the cached mapped split-pane position,
      // considering the specified split mode and section number. The 'LayoutHelper' object
      // contains the 'getSection' method responsible for this operation.
      let sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, sectionNumber);
      // throw error if sectionIndex is null or undefined
      if (sectionIndex === null || sectionIndex === undefined) {
        console.error(`Section number ${sectionIndex}. Provide correct section number.`);
        return;
      }

      if (sectionIndex !== null && sectionIndex !== undefined) {
        const currentTarget = sections[sectionIndex] as HTMLDivElement; // current section
        const prevTarget = sections[sectionIndex - 2] as HTMLDivElement; // previous section
        // next section
        const nextTarget = sections[sectionIndex + 2] as HTMLDivElement;

        // check corner case if all splitter is close
        const totalPaneSize = (sections.length + 1) / 2; // give total section present excluding handle bar
        let openSectionCounter = 0;
        for (let pane = 0; pane < totalPaneSize; pane++) {
          if (this.isSectionOpen(instance, pane + 1, splitMode)) {
            openSectionCounter++;
          }
        }

        if (mode === this.HORIZONTAL && currentTarget) {
          // For opening the current section
          // Remove flex grow because its closed, means flex-grow is 0
          // also remove class a-split-hidden that having flex-basis 0!important
          currentTarget.style.removeProperty("flex-grow");
          currentTarget.classList.remove(this.SECTION_CLASS_HIDE);
          if (currentTarget.classList.contains(this.FIX_HELPER_CLASS) && !currentTarget.classList.contains(this.FIX_CLASS)) {
            currentTarget.classList.add(this.FIX_CLASS);
          }
          /* 
            - Direction: Right
              - When the direction is specified as right, indicating the use of an arrow to open the section, the following actions need to be taken:
                - Remove flex grow if more than one section is opened; otherwise, set flex grow to 1.
                  - For instance, if three sections exist, and two are closed while one is opened, and the user wishes to open another, one closed section should grow to occupy the available space. When only one section is open, retain flex grow to ensure it takes up the entire space of the closed section.
                - Always consider the availability of the nextTarget. In this case, when the direction is right, utilize the nextTarget for performing the growth operation on the subsequent section, maintaining the original size of the current section.

            - Direction: Left
              - Similar to the right direction, the following actions should be taken:
                - Adjust flex grow based on the number of opened sections, following the same principles outlined for the right direction.
                - Ensure nextTarget is available when making adjustments in the left direction, as it dictates the growth operation on the subsequent section while preserving the original size of the current section.
          */
          if (direction === this.RIGHT) {
            if (openSectionCounter !== 1) {
              nextTarget.style.removeProperty("flex-grow");
              if (prevTarget) {
                prevTarget.style.removeProperty("flex-grow");
              }
            } else {
              nextTarget.style.flexGrow = "1";
            }
          } else if (direction === this.LEFT) {
            if (openSectionCounter !== 1) {
              prevTarget.style.removeProperty("flex-grow");
              if (nextTarget) {
                nextTarget.style.removeProperty("flex-grow");
              }
            } else {
              prevTarget.style.flexGrow = "1";
            }
          } else {
            if (nextTarget) {
              if (openSectionCounter !== 1) {
                nextTarget.style.removeProperty("flex-grow");
                if (prevTarget) {
                  prevTarget.style.removeProperty("flex-grow");
                }
              } else {
                nextTarget.style.flexGrow = "1";
              }
            } else {
              if (prevTarget) {
                if (openSectionCounter !== 1) {
                  prevTarget.style.removeProperty("flex-grow");
                  if (nextTarget) {
                    (nextTarget as HTMLDivElement).style.removeProperty("flex-grow");
                  }
                } else {
                  prevTarget.style.flexGrow = "1";
                }
              }
            }
          }

          this.reCheckPaneOpening(instance, this.HORIZONTAL);
          // on opening a section show the arrow side(left/right)
          ManageHandleBar.showHandleIconOnOpen(instance, sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "horizontal");
          // after opening saving the layout
          this.saveSizesToLocalStorage(mode);
        } else if (mode === this.VERTICAL && currentTarget) {
          currentTarget.style.removeProperty("flex-grow");
          currentTarget.classList.remove(this.SECTION_CLASS_HIDE);
          /* 
            - Similar logic as left and right just direction changes.
          */
          if (direction === this.BOTTOM) {
            if (openSectionCounter !== 1) {
              nextTarget.style.removeProperty("flex-grow");
            } else {
              nextTarget.style.flexGrow = "1";
            }
          } else if (direction === this.TOP) {
            if (openSectionCounter !== 1) {
              prevTarget.style.removeProperty("flex-grow");
            } else {
              prevTarget.style.flexGrow = "1";
            }
          } else {
            if (nextTarget) {
              if (openSectionCounter !== 1) {
                nextTarget.style.removeProperty("flex-grow");
              } else {
                nextTarget.style.flexGrow = "1";
              }
            } else {
              if (prevTarget) {
                if (openSectionCounter !== 1) {
                  prevTarget.style.removeProperty("flex-grow");
                } else {
                  prevTarget.style.flexGrow = "1";
                }
              }
            }
          }

          this.reCheckPaneOpening(instance, this.VERTICAL);
          // on opening a section show the arrow side(left/right)
          ManageHandleBar.showHandleIconOnOpen(instance, sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "vertical");
          // after opening saving the layout
          this.saveSizesToLocalStorage(mode);
        }

        this.invokeLayoutCallback(instance, sectionNumber, splitMode, reason, direction);
      }
    }
  }

  /**
   * Sets the size of individual panes within a split layout.
   * @param instance - The instance of the pane or null.
   * @param sizes - An object containing pane section numbers as keys and their respective sizes as values.
   * @param splitMode - The split mode (horizontal or vertical).
   */
  static setPaneSize(instance: Instance = null, sizes: { [key: number]: number }, splitMode: Orientation): void {
    // Determine the mode to use
    const mode = splitMode || this.mode;

    // Throw an error if the wrapper is not set
    if (!this.modeWrapper[splitMode] && !instance) {
      console.error("Wrapper not set. Call setWrapper before using setPaneSize.");
      return;
    }

    // Retrieve the sections based on the instance or split mode
    const sections = instance?.children || this.modeWrapper[splitMode]?.children;

    // Update the cached mapped split-pane position
    LayoutHelper.mapElementPosition(instance, this.modeWrapper, splitMode, this.cachedMappedSplitPanePosition, true);

    // Proceed if sections, sizes, and keys are available
    if (sections && sizes && Object.keys(sizes).length > 0) {
      // Determine the reference width based on the mode and instance
      const referenceWidth = String(
        mode === "horizontal"
          ? instance?.getBoundingClientRect().width || this.modeWrapper["horizontal"]?.getBoundingClientRect().width
          : instance?.getBoundingClientRect().height || this.modeWrapper["vertical"]?.getBoundingClientRect().height
      );

      // Iterate through the sizes and update the corresponding pane sizes
      const panes = Object.keys(sizes);
      for (let paneSectionIdx = 0; paneSectionIdx < panes.length; paneSectionIdx++) {
        // Retrieve the section index using the cached mapped split-pane position
        let sectionIndex = LayoutHelper.getSection(this.cachedMappedSplitPanePosition, splitMode, parseInt(panes[paneSectionIdx]));

        // Throw an error if the section index is null or undefined
        if (sectionIndex === null || sectionIndex === undefined) {
          console.error(`Section number ${sectionIndex}. Provide correct section number.`);
          return;
        }

        // Update the size of the current section
        if (sectionIndex !== null && sectionIndex !== undefined) {
          const currentTarget = sections[sectionIndex] as HTMLDivElement; // Current section

          // Check if the flex basis includes pixels and convert percentage to pixels accordingly
          if (currentTarget.style.flexBasis.includes("px")) {
            currentTarget.style.flexBasis = `${SplitUtils.percentageToPixel(sizes[parseInt(panes[paneSectionIdx])], referenceWidth)}px`;
          } else {
            currentTarget.style.flexBasis = `${sizes[parseInt(panes[paneSectionIdx])]}%`;
          }
        }
      }
    }
  }

  /**
   * Calculates the total number of panes in the split panes based on the split mode.
   * @param splitMode The mode of splitting, either "horizontal" or "vertical".
   * @returns The total number of panes, or -1 if the wrapper is not set.
   */
  static totalPaneCount(instance: Instance, splitMode: Orientation) {
    // Check if the wrapper is not set
    if (!this.modeWrapper[splitMode] && !instance) {
      console.error("Wrapper not set. Call setWrapper before using totalPaneCount.");
      return -1; // Return -1 indicating that the wrapper is not set
    }

    // Get the sections within the wrapper based on the split mode
    const sections = instance?.children || this.modeWrapper[splitMode]?.children;

    // Check if sections exist
    if (sections) {
      // Calculate the total pane size excluding the handle bars
      const totalPaneSize = (sections.length + 1) / 2;
      return totalPaneSize; // Return the total pane size
    }

    return -1; // Return -1 if sections do not exist
  }

  /**
   * Calculates the total number of handle bars in the split panes based on the split mode.
   * @param splitMode The mode of splitting, either "horizontal" or "vertical".
   * @returns The total number of handle bars, or -1 if the wrapper is not set.
   */
  static totalHandleCount(instance: Instance, splitMode: Orientation) {
    // Check if the wrapper is not set
    if (!this.modeWrapper[splitMode] && !instance) {
      console.error("Wrapper not set. Call setWrapper before using totalHandleCount.");
      return -1; // Return -1 indicating that the wrapper is not set
    }

    // Get the sections within the wrapper based on the split mode
    const sections = instance?.children || this.modeWrapper[splitMode]?.children;

    // Check if sections exist
    if (sections) {
      // Calculate the total handle bar count
      const totalHandleCount = Math.abs((sections.length + 1) / 2 - sections.length);
      return totalHandleCount; // Return the total handle bar count
    }

    return -1; // Return -1 if sections do not exist
  }

  /**
   * Saves sizes of split panes to local storage or session storage based on the split mode.
   * @param splitMode The mode of splitting, either "horizontal" or "vertical". Defaults to "horizontal".
   * @param closeSection A boolean indicating whether to close the section or not. Defaults to false.
   * @returns True if the sizes are saved successfully, false otherwise.
   */
  private static saveSizesToLocalStorage(splitMode: Orientation = "horizontal", closeSection = false): boolean {
    const mode = splitMode || this.mode; // Set the mode to the specified split mode or the default mode

    // Check if the wrapper is not set
    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using saveSizesToLocalStorage.");
      return false; // Return false indicating that the wrapper is not set
    }

    // Get the sections within the wrapper based on the split mode
    const sections = this.modeWrapper[mode]?.children;

    // Check if sections exist and session storage is enabled for the split mode
    if (sections && this.enableSessionStorage[splitMode]) {
      const sizes = []; // Initialize an array to store sizes
      for (let i = 0; i < sections.length; i += 2) {
        let userLayoutData = {}; // Initialize an object to store user layout data
        const contentTarget = sections[i] as HTMLDivElement;

        // Check if the content target's flex grow is either 0 or 1
        if (contentTarget.style.flexGrow === "0" || contentTarget.style.flexGrow === "1") {
          userLayoutData = {
            ...userLayoutData,
            flexGrow: contentTarget.style.flexGrow,
            flexBasis: contentTarget.style.flexBasis,
          };
        } else {
          // If flex grow is neither 0 nor 1, set flex grow to -1
          userLayoutData = {
            ...userLayoutData,
            flexBasis: contentTarget.style.flexBasis,
            flexGrow: "-1",
          };
        }

        sizes.push(userLayoutData); // Push the user layout data into the sizes array
      }

      // Save the sizes to session storage
      this.userSession.SetSession(sizes, mode === "horizontal" ? "horizontal" : "vertical", closeSection);
      return true; // Return true indicating successful saving of sizes
    }

    return false; // Return false if sections do not exist or session storage is not enabled
  }

  /**
   * Saves sizes to local storage for horizontal layout mode.
   */
  static saveHorizontalSizesToLocalStorage() {
    // Call saveSizesToLocalStorage with "horizontal" mode
    this.saveSizesToLocalStorage("horizontal");
  }

  /**
   * Saves sizes to local storage for vertical layout mode.
   */
  static saveVerticalSizesToLocalStorage() {
    // Call saveSizesToLocalStorage with "vertical" mode
    this.saveSizesToLocalStorage("vertical");
  }

  /**
   * Static method to reset stored session data when adding or removing a pane in a split mode.
   * Clears relevant data from local storage.
   * @param splitMode The split mode ("horizontal" or "vertical") for which to reset stored session data.
   */
  static resetLocalStorageOnPaneAddOrRemove(splitMode: "horizontal" | "vertical") {
    // Remove stored session data related to the given split mode
    this.userSession.removeStoredSession(splitMode);
  }
}

export default SplitUtils;
