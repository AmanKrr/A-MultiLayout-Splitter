class LayoutHelper {
  private static PANE_CLASS = "a-split-pane";

  public static mapElementPosition(
    wrapper: Record<string, HTMLDivElement | HTMLElement | null>,
    splitMode: "horizontal" | "vertical",
    cachedMappedSplitPanePosition: Record<
      string,
      Record<string, string | null> | null
    >
  ): void {
    // Check if the wrapper is set
    if (!wrapper[splitMode]) {
      console.error(
        "Wrapper not set. Call setWrapper before using closeSplitter."
      );
      return;
    }

    let splitIndex = 1;
    const elements = wrapper[splitMode]?.children;

    // Check if elements exist and the split index is not already cached
    if (elements && !cachedMappedSplitPanePosition[splitMode]) {
      // Iterate through elements to find split panes
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Check if the element is a split pane (not a handle bar)
        if (splitMode === "horizontal") {
          if (element.classList.contains(this.PANE_CLASS)) {
            // Cache the position of the split pane
            cachedMappedSplitPanePosition[splitMode] = {
              ...cachedMappedSplitPanePosition[splitMode],
              [`${splitIndex}`]: `${i}`,
            };
            ++splitIndex;
          }
        } else {
          if (element.classList.contains(this.PANE_CLASS)) {
            // Cache the position of the split pane
            cachedMappedSplitPanePosition[splitMode] = {
              ...cachedMappedSplitPanePosition[splitMode],
              [`${splitIndex}`]: `${i}`,
            };
            ++splitIndex;
          }
        }
      }
    }
  }
  public static calculateRemainingSectionSize(
    wrapper: Record<string, HTMLDivElement | HTMLElement>,
    skipSections: number[],
    splitMode: "horizontal" | "vertical"
  ) {
    if (!wrapper[splitMode]) {
      console.error(
        "Wrapper not set. Call setWrapper before using getRestSectionSize."
      );
      return -1;
    }

    const sections = wrapper[splitMode]?.children;
    if (sections && sections.length > 0) {
      let totalSize = 0;
      for (let i = 0; i < sections.length; i += 2) {
        if (!skipSections.includes(i)) {
          const contentTarget = sections[i] as HTMLDivElement;
          totalSize += parseFloat(
            contentTarget.style.flexBasis.replace("%", "")
          );
        }
      }

      return totalSize;
    } else {
      console.error("No elements found.");
    }
  }
  public static getSection(
    cachedMappedSplitPanePosition: Record<
      string,
      Record<string, string | null> | null
    >,
    splitMode: "horizontal" | "vertical",
    sectionNumber: number
  ) {
    const position =
      cachedMappedSplitPanePosition?.[splitMode]?.[sectionNumber];
    return position == null ? null : parseInt(position);
  }
}

export default LayoutHelper;
