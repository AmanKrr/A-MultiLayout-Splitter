class LayoutHelper {
  private static PANE_CLASS = "a-split-pane";

  /**
   * Maps the position of split panes within a wrapper element and stores them in a cached dictionary.
   * @param {Element | null} instance - The instance element containing split panes (if applicable).
   * @param {Record<string, HTMLDivElement | HTMLElement | null>} wrapper - The wrapper containing split panes.
   * @param {"horizontal" | "vertical"} splitMode - The split mode, either "horizontal" or "vertical".
   * @param {Record<string, Record<string, string | null> | null>} cachedMappedSplitPanePosition - The cached dictionary to store mapped positions.
   * @param {boolean} [force=false] - If true, forces remapping even if positions are already cached.
   */
  public static mapElementPosition(
    instance: Element | null,
    wrapper: Record<string, HTMLDivElement | HTMLElement | null>,
    splitMode: "horizontal" | "vertical",
    cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>,
    force = false
  ): void {
    // Check if the wrapper is set or instance is provided
    if (!wrapper[splitMode] && !instance) {
      console.error("Wrapper not set. Call setWrapper before using mapElementPosition.");
      return;
    }

    let splitIndex = 1;
    const elements = instance?.children || wrapper[splitMode]?.children;

    // Check if elements exist and remapping is forced or positions are not cached
    if (elements && (!cachedMappedSplitPanePosition[splitMode] || force)) {
      // Iterate through elements to find split panes
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Check if the element is a split pane (not a handle bar)
        if (splitMode === "horizontal" || splitMode === "vertical") {
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

  /**
   * Calculates the total size of remaining sections based on the provided parameters.
   * @param {Record<string, HTMLDivElement | HTMLElement>} wrapper - The wrapper containing sections.
   * @param {number[]} skipSections - The indices of sections to skip while calculating the size.
   * @param {"horizontal" | "vertical"} splitMode - The split mode, either "horizontal" or "vertical".
   * @returns {number | undefined} The total size of remaining sections, or undefined if an error occurs.
   */
  public static calculateRemainingSectionSize(
    wrapper: Record<string, HTMLDivElement | HTMLElement>,
    skipSections: number[],
    splitMode: "horizontal" | "vertical"
  ) {
    // Check if the wrapper is set
    if (!wrapper[splitMode]) {
      console.error("Wrapper not set. Call setWrapper before using calculateRemainingSectionSize.");
      return -1;
    }

    const sections = wrapper[splitMode]?.children;
    // Check if sections exist and there is at least one section
    if (sections && sections.length > 0) {
      let totalSize = 0;
      // Iterate over sections, skipping those specified in skipSections
      for (let i = 0; i < sections.length; i += 2) {
        if (!skipSections.includes(i)) {
          const contentTarget = sections[i] as HTMLDivElement;
          // Add the flex basis of the section to the total size
          totalSize += parseFloat(contentTarget.style.flexBasis.replace("%", ""));
        }
      }

      return totalSize;
    } else {
      console.error("No elements found.");
    }
  }

  /**
   * Gets the section index based on the provided parameters.
   * @param {Record<string, Record<string, string | null> | null>} cachedMappedSplitPanePosition - The cached mapped split pane position.
   * @param {"horizontal" | "vertical"} splitMode - The split mode, either "horizontal" or "vertical".
   * @param {number} sectionNumber - The section number to retrieve.
   * @returns {number | null} The section index, or null if not found.
   */
  public static getSection(
    cachedMappedSplitPanePosition: Record<string, Record<string, string | null> | null>,
    splitMode: "horizontal" | "vertical",
    sectionNumber: number
  ) {
    // Get the position from the cachedMappedSplitPanePosition using the splitMode and sectionNumber
    const position = cachedMappedSplitPanePosition?.[splitMode]?.[sectionNumber];

    // Return the parsed position as a number, or null if it's null or undefined
    return position == null ? null : parseInt(position);
  }
}

export default LayoutHelper;
