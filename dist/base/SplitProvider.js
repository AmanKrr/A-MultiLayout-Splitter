import{jsx as _jsx}from"react/jsx-runtime";import React from"react";const SplitStateContext=React.createContext(void 0);class SplitStateProvider extends React.Component{constructor(){super(...arguments),this.state={children:{},disable:{},lineBar:{},visible:{},initialSize:{},collapsed:{},maxSize:{},minSize:{},modes:{},enableLocalStorage:{}},this.setStateWrapper=i=>{"function"==typeof i?this.setState(t=>{var e=i(t);return Object.assign({},this.structuralUpdate(t,e))}):this.setState(t=>Object.assign({},this.structuralUpdate(t,i)))}}structuralUpdate(t,e){return Object.assign(Object.assign(Object.assign({},t),e),{children:Object.assign(Object.assign({},t.children),e.children),collapsed:Object.assign(Object.assign({},t.collapsed),e.collapsed),disable:Object.assign(Object.assign({},t.disable),e.disable),initialSize:Object.assign(Object.assign({},t.initialSize),e.initialSize),lineBar:Object.assign(Object.assign({},t.lineBar),e.lineBar),maxSize:Object.assign(Object.assign({},t.maxSize),e.maxSize),minSize:Object.assign(Object.assign({},t.minSize),e.minSize),modes:Object.assign(Object.assign({},t.modes),e.modes),visible:Object.assign(Object.assign({},t.visible),e.visible)})}render(){return _jsx(SplitStateContext.Provider,Object.assign({value:{splitState:this.state,setSplitState:this.setStateWrapper}},{children:this.props.children}))}}const SplitStateConsumer=SplitStateContext.Consumer;function withSplitState(s){return React.forwardRef((e,i)=>_jsx(SplitStateConsumer,{children:t=>{if(void 0===t)throw new Error("withSplitState must be used within a SplitStateProvider");return _jsx(s,Object.assign({},e,{ref:i,splitStateContext:t}))}}))}export{SplitStateProvider,SplitStateConsumer,withSplitState};