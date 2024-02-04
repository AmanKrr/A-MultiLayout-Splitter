import SplitUtils from "../utils/SplitUtils";
import LayoutHelper from "./LayoutHelper";

class ManageHandleBar {
  /**
   * Shows handle bar icon on open of a split section.
   * @param sectionNumber - The section number being opened.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @param direction - The direction of the open operation, either "left" or "right".
   * Don't provide the direction if this function is not used inside the SplitUtils class itself.
   */
  public static showHandleIconOnOpen(
    sectionNumber: number,
    wrapper: Record<string, HTMLDivElement | HTMLElement | null>,
    cachedMappedSplitPanePosition: Record<
      string,
      Record<string, string | null> | null
    >,
    splitMode: "horizontal" | "vertical"
  ): void {
    // Implementation for handling handle bar icons on open
    const sections = wrapper[splitMode]?.children;

    if (sections && sections.length > 0) {
      const currentSectionIndex = LayoutHelper.getSection(
        cachedMappedSplitPanePosition,
        splitMode,
        sectionNumber
      );
      const previousSectionIndex = LayoutHelper.getSection(
        cachedMappedSplitPanePosition,
        splitMode,
        sectionNumber - 1
      );
      const nextSectionIndex = LayoutHelper.getSection(
        cachedMappedSplitPanePosition,
        splitMode,
        sectionNumber + 1
      );
      const currentTarget = sections[
        currentSectionIndex == null ? -1 : currentSectionIndex
      ] as HTMLDivElement | null | undefined;
      const prevTarget = sections[
        previousSectionIndex == null ? -1 : previousSectionIndex
      ] as HTMLDivElement | null | undefined;
      const nextTarget = sections[
        nextSectionIndex == null ? -1 : nextSectionIndex
      ] as HTMLDivElement | null | undefined;

      // remove left icon
      if (currentTarget && !prevTarget) {
        const currentHandleBar = currentTarget.nextElementSibling;
        (currentHandleBar?.firstChild as HTMLElement)?.classList.remove(
          "disable"
        );
        currentHandleBar?.children[1].classList.remove(
          splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix"
        );
      } else if (currentTarget && !nextTarget) {
        // remove right icon
        const currentHandleBar = currentTarget.previousElementSibling;
        (currentHandleBar?.lastChild as HTMLElement)?.classList.remove(
          "disable"
        );
        currentHandleBar?.children[1].classList.remove(
          splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix"
        );
      } else {
        // remove current left icon and right icon of previous
        // previous then current
        const previousHandleBar = currentTarget?.nextElementSibling;
        (previousHandleBar?.firstChild as HTMLElement)?.classList.remove(
          "disable"
        );
        previousHandleBar?.children[1].classList.remove(
          splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix"
        );
        // current
        const currentHandleBar = currentTarget?.previousElementSibling;
        (currentHandleBar?.lastChild as HTMLElement)?.classList.remove(
          "disable"
        );
        currentHandleBar?.children[1].classList.remove(
          splitMode === "horizontal" ? "right-margin-fix" : "bottom-margin-fix"
        );
      }
    }
  }

  /**
   * Hides handle bar icons when a split section is closed.
   * @param sectionNumber - The section number being closed.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   */
  public static removeHandleIconOnClose(
    sectionNumber: number,
    wrapper: Record<string, HTMLDivElement | HTMLElement | null>,
    cachedMappedSplitPanePosition: Record<
      string,
      Record<string, string | null> | null
    >,
    splitMode: "horizontal" | "vertical"
  ): void {
    // Implementation for hiding handle bar icons on close
    const sections = wrapper[splitMode]?.children;

    /* 
      - Closing to left (means left arrow button is clicked)
        - If left arrow button is clicked then remove the right of previous section and left icon of current section.
    */
    if (sections && sections.length > 0) {
      const currentSectionIndex = LayoutHelper.getSection(
        cachedMappedSplitPanePosition,
        splitMode,
        sectionNumber
      );
      const previousSectionIndex = LayoutHelper.getSection(
        cachedMappedSplitPanePosition,
        splitMode,
        sectionNumber - 1
      );
      const nextSectionIndex = LayoutHelper.getSection(
        cachedMappedSplitPanePosition,
        splitMode,
        sectionNumber + 1
      );
      const currentTarget = sections[
        currentSectionIndex == null ? -1 : currentSectionIndex
      ] as HTMLDivElement | null | undefined;
      const prevTarget = sections[
        previousSectionIndex == null ? -1 : previousSectionIndex
      ] as HTMLDivElement | null | undefined;
      const nextTarget = sections[
        nextSectionIndex == null ? -1 : nextSectionIndex
      ] as HTMLDivElement | null | undefined;
      if (!SplitUtils.isSectionOpen(sectionNumber, splitMode)) {
        // remove left icon
        if (currentTarget && !prevTarget) {
          const currentHandleBar = currentTarget.nextElementSibling;
          (currentHandleBar?.firstChild as HTMLElement)?.classList.add(
            "disable"
          );
          currentHandleBar?.children[1].classList.add(
            splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix"
          );
        } else if (currentTarget && !nextTarget) {
          // remove right icon
          const currentHandleBar = currentTarget.previousElementSibling;
          (currentHandleBar?.lastChild as HTMLElement)?.classList.add(
            "disable"
          );
          currentHandleBar?.children[1].classList.add(
            splitMode === "horizontal"
              ? "right-margin-fix"
              : "bottom-margin-fix"
          );
        } else {
          // remove current left icon and right icon of previous
          // previous then current
          const previousHandleBar = currentTarget?.nextElementSibling;
          (previousHandleBar?.firstChild as HTMLElement)?.classList.add(
            "disable"
          );
          previousHandleBar?.children[1].classList.add(
            splitMode === "horizontal" ? "left-margin-fix" : "top-margin-fix"
          );
          // current
          const currentHandleBar = currentTarget?.previousElementSibling;
          (currentHandleBar?.lastChild as HTMLElement)?.classList.add(
            "disable"
          );
          currentHandleBar?.children[1].classList.add(
            splitMode === "horizontal"
              ? "right-margin-fix"
              : "bottom-margin-fix"
          );
        }
      }
    }
  }
}

export default ManageHandleBar;
