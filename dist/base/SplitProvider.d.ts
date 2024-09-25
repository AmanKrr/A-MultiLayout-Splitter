import React from "react";
/**
 * State for the Split component.
 */
export interface SplitState {
    modes: {
        [key: string]: "horizontal" | "vertical";
    } | null;
    children: {
        [key: string]: Array<React.ReactNode>;
    } | null;
    lineBar: {
        [key: string]: boolean | number[] | null | undefined;
    } | null;
    visible: {
        [key: string]: boolean | number[] | null | undefined;
    } | null;
    disable: {
        [key: string]: boolean | number[] | null | undefined;
    } | null;
    initialSize: {
        [key: string]: string[];
    } | null;
    collapsed: {
        [key: string]: boolean[];
    } | null;
    maxSize: {
        [key: string]: number[] | undefined;
    } | null;
    minSize: {
        [key: string]: number[] | undefined;
    } | null;
    enableLocalStorage: {
        [key: string]: boolean;
    } | null;
}
export interface SplitStateContextType {
    splitState: SplitState;
    setSplitState: React.Dispatch<React.SetStateAction<SplitState>>;
}
interface ISplitStateProvider {
    children: React.ReactNode;
}
export declare class SplitStateProvider extends React.Component<ISplitStateProvider> {
    state: SplitState;
    setStateWrapper: (newState: Partial<SplitState> | ((prevState: SplitState) => Partial<SplitState>)) => void;
    structuralUpdate(prevValues: SplitState, newValues: Partial<SplitState>): SplitState;
    render(): JSX.Element;
}
export declare const SplitStateConsumer: React.Consumer<SplitStateContextType | undefined>;
export interface WithSplitStateProps {
    splitStateContext: SplitStateContextType;
}
export declare function withSplitState<T extends {}>(Component: React.ComponentType<T & WithSplitStateProps>): React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<unknown>>;
export {};
