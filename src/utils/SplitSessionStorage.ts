// Define the interface for SplitSessionStorage
export interface ISplitSessionStorage {
  // Method to set session data
  SetSession(
    size: any[],
    mode: "horizontal" | "vertical",
    closeSection?: boolean
  ): void;

  // Method to get session data
  GetSession(mode: "horizontal" | "vertical", closeSection?: boolean): any[];
}

// Implement the interface in the SplitSessionStorage class
class SplitSessionStorage implements ISplitSessionStorage {
  private splitterLocalIdentifierPrefix = "alphaFact";
  private openPrefix = "open";
  private closePrefix = "close";
  private horizontalPrefix = "horizontal";
  private verticalPrefix = "vertical";
  // Private method to set an item in localStorage
  private setItem(name: string, data: any): void {
    return localStorage.setItem(name, JSON.stringify(data));
  }

  // Private method to get an item from localStorage
  private getItem(name: string): any {
    const data = localStorage.getItem(name);
    return JSON.parse(data);
  }

  // Private method to remove an item from localStorage
  private removeItem(name: string): void {
    return localStorage.removeItem(name);
  }

  private encodeBase64 = (data: string) => {
    return Buffer.from(data).toString("base64");
  };
  private decodeBase64 = (data: string) => {
    return Buffer.from(data, "base64").toString("ascii");
  };

  /**
   * Public method from the interface to set session data.
   * @param size - Array of numbers representing session data.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @param closeSection - Is section is closed or not. either "true" or "false".
   */
  public SetSession(
    size: any[],
    splitMode: "horizontal" | "vertical",
    closeSection = false
  ): void {
    function set(key: string, sectionSize: number[]) {
      // Check if session is not available for the current URL
      if (!this.getItem(btoa(this.splitterLocalIdentifierPrefix + key))) {
        // Encode URL and set session data
        this.setItem(
          btoa(this.splitterLocalIdentifierPrefix + key),
          sectionSize
        );
      } else {
        // If session data exists, update it
        this.setItem(
          btoa(this.splitterLocalIdentifierPrefix + key),
          sectionSize
        );
      }
    }

    const _set = set.bind(this);
    if (closeSection) {
      _set(window.location.href + splitMode + this.closePrefix, size);
    } else {
      _set(window.location.href + splitMode, size);
    }
  }

  /**
   * Public method from the interface to get session data.
   * @param splitMode - Split mode, either "horizontal" or "vertical".
   * @@param closeSection - Is section is closed or not. either "true" or "false".
   * @returns An array of numbers representing session data.
   */
  public GetSession(
    splitMode: "horizontal" | "vertical",
    closeSection = false
  ): any[] {
    function get(
      key: string,
      splitMode: "horizontal" | "vertical",
      prefix: string = ""
    ) {
      const finalKey =
        this.splitterLocalIdentifierPrefix + key + splitMode + prefix;
      const sessionData = this.getItem(btoa(finalKey));

      // Check if the stored URL matches the current URL and sessionData is available
      if (
        atob(btoa(finalKey)) ===
          this.splitterLocalIdentifierPrefix +
            window.location.href +
            splitMode +
            prefix &&
        sessionData
      ) {
        return sessionData as any[];
      }
      // Return an empty array if no valid session data is found
      return [];
    }

    const _get = get.bind(this);
    if (closeSection) {
      const layout = _get(window.location.href, splitMode, this.closePrefix);
      this.removeItem(
        btoa(
          this.splitterLocalIdentifierPrefix +
            window.location.href +
            splitMode +
            this.closePrefix
        )
      );
      return layout;
    } else {
      return _get(window.location.href, splitMode);
    }
  }
}

// Export the SplitSessionStorage class
export default SplitSessionStorage;
