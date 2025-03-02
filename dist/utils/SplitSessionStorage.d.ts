export interface ISplitSessionStorage {
    SetSession(size: any[], mode: "horizontal" | "vertical", closeSection?: boolean): void;
    GetSession(mode: "horizontal" | "vertical", closeSection?: boolean): any[];
    removeStoredSession(mode: "horizontal" | "vertical"): void;
}
declare class SplitSessionStorage implements ISplitSessionStorage {
    private sessionKeyIdentifier;
    private splitterLocalIdentifierPrefix;
    private openPrefix;
    private closePrefix;
    private horizontalPrefix;
    private verticalPrefix;
    private setItem;
    private getItem;
    private removeItem;
    private encodeBase64;
    private decodeBase64;
    /**
     * Removes a stored session related to a specific split mode ("horizontal" or "vertical") from local storage.
     * @param splitMode The split mode for which to remove the stored session data.
     */
    removeStoredSession(splitMode: "horizontal" | "vertical"): void;
    /**
     * Public method from the interface to set session data.
     * @param size - Array of numbers representing session data.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param closeSection - Is section is closed or not. either "true" or "false".
     */
    SetSession(size: any[], splitMode: "horizontal" | "vertical", closeSection?: boolean): void;
    /**
     * Public method from the interface to get session data.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @@param closeSection - Is section is closed or not. either "true" or "false".
     * @returns An array of numbers representing session data.
     */
    GetSession(splitMode: "horizontal" | "vertical", closeSection?: boolean): any[];
}
export default SplitSessionStorage;
