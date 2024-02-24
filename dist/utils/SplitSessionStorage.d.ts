export interface ISplitSessionStorage {
    SetSession(size: any[], mode: "horizontal" | "vertical", closeSection?: boolean): void;
    GetSession(mode: "horizontal" | "vertical", closeSection?: boolean): any[];
}
declare class SplitSessionStorage implements ISplitSessionStorage {
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
    SetSession(size: any[], splitMode: "horizontal" | "vertical", closeSection?: boolean): void;
    GetSession(splitMode: "horizontal" | "vertical", closeSection?: boolean): any[];
}
export default SplitSessionStorage;
