import React from "react";

/**
 * State for the Split component.
 */
export interface SplitState {
  modes: { [key: string]: "horizontal" | "vertical" } | null;
  children: { [key: string]: Array<React.ReactNode> } | null;
  lineBar: { [key: string]: boolean | number[] | null | undefined } | null;
  visible: { [key: string]: boolean | number[] | null | undefined } | null;
  disable: { [key: string]: boolean | number[] | null | undefined } | null;
  initialSize: { [key: string]: string[] } | null;
  collapsed: { [key: string]: boolean[] } | null;
  maxSize: { [key: string]: number[] | undefined } | null;
  minSize: { [key: string]: number[] | undefined } | null;
  enableLocalStorage: { [key: string]: boolean } | null;
}

export interface SplitStateContextType {
  splitState: SplitState;
  setSplitState: React.Dispatch<React.SetStateAction<SplitState>>;
}

interface ISplitStateProvider {
  children: React.ReactNode;
}

const SplitStateContext = React.createContext<SplitStateContextType | undefined>(undefined);

export class SplitStateProvider extends React.Component<ISplitStateProvider> {
  state: SplitState = {
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

  setStateWrapper = (newState: Partial<SplitState> | ((prevState: SplitState) => Partial<SplitState>)) => {
    if (typeof newState === "function") {
      // Handle function case
      this.setState((prevState: SplitState) => {
        const partialUpdate = newState(prevState as SplitState);
        return { ...this.structuralUpdate(prevState, partialUpdate) };
      });
    } else {
      // Handle direct state case
      this.setState((prevState: SplitState) => ({ ...this.structuralUpdate(prevState, newState) }));
    }
  };

  structuralUpdate(prevValues: SplitState, newValues: Partial<SplitState>) {
    return {
      ...prevValues,
      ...newValues,
      children: {
        ...prevValues["children"],
        ...newValues["children"],
      },
      collapsed: {
        ...prevValues["collapsed"],
        ...newValues["collapsed"],
      },
      disable: {
        ...prevValues["disable"],
        ...newValues["disable"],
      },
      initialSize: {
        ...prevValues["initialSize"],
        ...newValues["initialSize"],
      },
      lineBar: {
        ...prevValues["lineBar"],
        ...newValues["lineBar"],
      },
      maxSize: {
        ...prevValues["maxSize"],
        ...newValues["maxSize"],
      },
      minSize: {
        ...prevValues["minSize"],
        ...newValues["minSize"],
      },
      modes: {
        ...prevValues["modes"],
        ...newValues["modes"],
      },
      visible: {
        ...prevValues["visible"],
        ...newValues["visible"],
      },
    } as SplitState;
  }

  render() {
    return (
      <SplitStateContext.Provider value={{ splitState: this.state, setSplitState: this.setStateWrapper }}>
        {this.props.children}
      </SplitStateContext.Provider>
    );
  }
}

export const SplitStateConsumer = SplitStateContext.Consumer;

export interface WithSplitStateProps {
  splitStateContext: SplitStateContextType;
}

export function withSplitState(Component: any) {
  return React.forwardRef((props, ref) => (
    <SplitStateConsumer>
      {(context) => {
        if (context === undefined) {
          throw new Error("withSplitState must be used within a SplitStateProvider");
        }
        return <Component {...props} ref={ref} splitStateContext={context} />;
      }}
    </SplitStateConsumer>
  ));
}
