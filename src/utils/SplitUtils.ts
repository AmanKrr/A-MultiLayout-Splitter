import LayoutHelper from "../helper/LayoutHelper";
import ManageHandleBar from "../helper/ManageHandleBar";
import SplitSessionStorage, { ISplitSessionStorage } from "./SplitSessionStorage";

// Define the SplitUtils class
class SplitUtils {
  // constant variables
  private static TOP = "top";
  private static BOTTOM = "bottom";
  private static LEFT = "left";
  private static RIGHT = "right";
  private static HORIZONTAL = "horizontal";
  private static VERTICAL = "vertical";
  private static SECTION_CLASS_HIDE = "a-split-hidden";

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

  static minThreshold: number[];

  /**
   * Sets the wrapper, mode, and other configurations for the SplitUtils.
   * @param wrapper - HTMLDivElement that wraps the split panes.
   * @param mode - Split mode, either "horizontal" or "vertical".
   * @param enableSessionStorage - Flag to enable session storage for storing split sizes.
   */
  static setWrapper(
    wrapper: HTMLDivElement | null,
    mode: "horizontal" | "vertical" = "horizontal",
    minSizes: number[] = [],
    enableSessionStorage = false
  ): void {
    // Set the wrapper, mode, and other configurations
    this.wrapper = wrapper;
    this.mode = mode;
    this.modeWrapper = {
      ...this.modeWrapper,
      [mode]: wrapper,
    };
    this.minThreshold = minSizes;
    this.userSession = new SplitSessionStorage();
    this.enableSessionStorage[mode] = enableSessionStorage;
    this.cachedMappedSplitPanePosition[mode] = null;
    LayoutHelper.mapElementPosition(this.modeWrapper, mode, this.cachedMappedSplitPanePosition);
  }

  static percentageToPixel(percentage: number, referenceWidth: string) {
    // Convert percentage to pixel value
    if (referenceWidth && referenceWidth.includes("vw")) {
      return (percentage / 100) * window.innerWidth * (parseFloat(referenceWidth.replace("vw", "")) / 100);
    } else if (referenceWidth && referenceWidth.includes("vh")) {
      return (percentage / 100) * window.innerHeight * (parseFloat(referenceWidth.replace("vh", "")) / 100);
    } else if (referenceWidth && referenceWidth.includes("%")) {
      return (percentage / 100) * parseFloat(referenceWidth.replace("%", ""));
    } else {
      return (percentage / 100) * parseFloat(referenceWidth.replace("px", ""));
    }
  }

  static pixelToPercentage(pixelValue: number, referenceWidth: string) {
    // Convert pixel value to percentage
    if (referenceWidth.includes("vw")) {
      return (pixelValue / window.innerWidth) * 100;
    } else if (referenceWidth.includes("vh")) {
      return (pixelValue / window.innerHeight) * 100;
    } else if (referenceWidth.includes("px")) {
      return (pixelValue / parseFloat(referenceWidth.replace("px", ""))) * 100;
    } else {
      return (pixelValue / parseFloat(referenceWidth.replace("%", ""))) * 100;
    }
  }

  /**
   * Checks if a specific split section is open.
   * @param sectionNumber - The section number to be checked.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @returns True if the section is open, false otherwise.
   */
  static isSectionOpen(sectionNumber: number, splitMode: "horizontal" | "vertical"): boolean {
    // Implementation for checking if a specific split section is open

    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using isSectionOpen.");
      return false;
    }

    const sections = this.modeWrapper[splitMode]?.children;

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
   * Closes a specific split section.
   * @param sectionNumber - The section number to be closed.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @param direction - The direction of the close operation, either "left", "right", "top", "bottom" or "null". Direction null is used only when not using arrow icon of handlebar to close the splitter.
   */
  static closeSplitter(
    sectionNumber: number,
    splitMode: "horizontal" | "vertical",
    direction: "left" | "right" | "top" | "bottom" | null = null
  ): void {
    // Implementation for closing a specific split section
    const mode = splitMode || this.mode;

    // if wrapper is not set throw error
    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using closeSplitter.");
      return;
    }

    const sections = this.modeWrapper[splitMode]?.children; // on the basis of mode getting sections element
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
          ManageHandleBar.removeHandleIconOnClose(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "horizontal");
          // on close storing user layout
          this.saveSizesToLocalStorage(this.HORIZONTAL);
        } else if (mode === this.VERTICAL && currentTarget) {
          /*
            - For vertical no closing direction is currently implemented.
            - Also no session storage is implemented for vertical closing. (Pending)
          */
          currentTarget.style.flexGrow = "0";
          currentTarget.classList.add(this.SECTION_CLASS_HIDE);

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
          ManageHandleBar.removeHandleIconOnClose(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "vertical");
          // on close storing user layout
          this.saveSizesToLocalStorage(this.VERTICAL);
        }
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
    sectionNumber: number,
    splitMode: "horizontal" | "vertical",
    direction: "left" | "right" | "top" | "bottom" | null = null
  ): void {
    // Implementation for opening a specific split section with a new size
    const mode = splitMode || this.mode;

    // if wrapper is not set throw error
    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using openSplitter.");
      return;
    }

    const sections = this.modeWrapper[splitMode]?.children; // on the basis of mode getting sections element

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
          if (this.isSectionOpen(pane + 1, splitMode)) {
            openSectionCounter++;
          }
        }

        if (mode === this.HORIZONTAL && currentTarget) {
          // For opening the current section
          // Remove flex grow because its closed, means flex-grow is 0
          // also remove class a-split-hidden that having flex-basis 0!important
          currentTarget.style.removeProperty("flex-grow");
          currentTarget.classList.remove(this.SECTION_CLASS_HIDE);
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

          // on opening a section show the arrow side(left/right)
          ManageHandleBar.showHandleIconOnOpen(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "horizontal");
          // after opening saving the layout
          this.saveSizesToLocalStorage(mode);
        } else if (mode === this.VERTICAL && currentTarget) {
          currentTarget.style.removeProperty("flex-grow");
          currentTarget.classList.remove(this.SECTION_CLASS_HIDE);
          /* 
            - Similar logic as left and right just direction changes.
          */
          if (direction === this.BOTTOM) {
            console.log("bottom", nextTarget);
            console.log("bottom prev", prevTarget);
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

          // on opening a section show the arrow side(left/right)
          ManageHandleBar.showHandleIconOnOpen(sectionNumber, this.modeWrapper, this.cachedMappedSplitPanePosition, "vertical");
          // after opening saving the layout
          this.saveSizesToLocalStorage(mode);
        }
      }
    }
  }

  /**
   * Save sizes to local storage.
   */
  static saveSizesToLocalStorage(splitMode: "horizontal" | "vertical" = "horizontal", closeSection = false) {
    const mode = splitMode || this.mode;

    if (!this.modeWrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using saveSizesToLocalStorage.");
      return false;
    }

    const sections = this.modeWrapper[mode]?.children;
    if (sections && this.enableSessionStorage[splitMode]) {
      const sizes = [];
      for (let i = 0; i < sections.length; i += 2) {
        let userLayoutData = {};
        const contentTarget = sections[i] as HTMLDivElement;
        if (contentTarget.style.flexGrow === "0" || contentTarget.style.flexGrow === "1") {
          userLayoutData = {
            ...userLayoutData,
            flexGrow: contentTarget.style.flexGrow,
            flexBasis: contentTarget.style.flexBasis,
          };
        } else {
          userLayoutData = {
            ...userLayoutData,
            flexBasis: contentTarget.style.flexBasis,
            flexGrow: "-1",
          };
        }

        sizes.push(userLayoutData);
      }
      this.userSession.SetSession(sizes, mode === "horizontal" ? "horizontal" : "vertical", closeSection);
    }
  }
}

export default SplitUtils;
