import{Fragment as _Fragment,jsx as _jsx,jsxs as _jsxs}from"react/jsx-runtime";import"../style/DragHandle.css";import SplitUtils from"../utils/SplitUtils";function DragHandle({mode:i,onMouseDown:t,onTouchStart:e,props:l,position:s}){function n(t,i,e,l){t=t.target.parentElement.parentElement;SplitUtils.isSectionOpen(t,e+1,i)&&SplitUtils.isSectionOpen(t,e,i)?SplitUtils.closeSplitter(t,e,i,l):!SplitUtils.isSectionOpen(t,e+1,i)&&SplitUtils.isSectionOpen(t,e,i)?SplitUtils.openSplitter(t,e+1,i,l):SplitUtils.openSplitter(t,e,i,l)}function a(t,i,e,l){t=t.target.parentElement.parentElement;SplitUtils.isSectionOpen(t,e+1,i)&&SplitUtils.isSectionOpen(t,e,i)?SplitUtils.closeSplitter(t,e+1,i,l):(SplitUtils.isSectionOpen(t,e+1,i)&&SplitUtils.isSectionOpen(t,e,i),SplitUtils.openSplitter(t,e,i,l))}function o(t){var i;null!=(i=t.target.parentElement.firstChild)&&i.classList.remove("a-icon-hide"),null!=(i=t.target.parentElement.lastChild)&&i.classList.remove("a-icon-hide")}function r(t){var i;null!=(i=t.target.parentElement.firstChild)&&i.classList.add("a-icon-hide"),null!=(i=t.target.parentElement.lastChild)&&i.classList.add("a-icon-hide")}return _jsx("div",Object.assign({},l,{onMouseDown:l.className.includes("a-split-handle-disable")?()=>{}:t,onTouchStart:l.className.includes("a-split-handle-disable")?()=>{}:e,onMouseOver:l.className.includes("a-split-handle-disable")?()=>{}:function(t){var i;null!=(i=t.target.firstChild)&&i.classList.remove("a-icon-hide"),null!=(i=t.target.lastChild)&&i.classList.remove("a-icon-hide")},onMouseOut:l.className.includes("a-split-handle-disable")?()=>{}:function(t){var i;null!=(i=t.target.firstChild)&&i.classList.add("a-icon-hide"),null!=(i=t.target.lastChild)&&i.classList.add("a-icon-hide")}},{children:l.className.includes("a-split-handle-disable")||l.className.includes("a-split-line-bar")?_jsx(_Fragment,{}):_jsxs(_Fragment,{children:[_jsx("button",{className:`a-splitter-collapse-icon splitter-${i}-${"horizontal"===i?"left":"top"}-icon a-icon-hide`,onClick:t=>{"horizontal"===i?n(t,"horizontal",s,"left"):n(t,"vertical",s,"top")},onMouseOver:o,onMouseOut:r}),_jsx("div",{className:"a-splitter-handlebar-icon",onMouseOver:o,onMouseOut:r}),_jsx("button",{className:`a-splitter-collapse-icon splitter-${i}-${"horizontal"===i?"right":"bottom"}-icon a-icon-hide`,onClick:t=>{"horizontal"===i?a(t,"horizontal",s,"right"):a(t,"vertical",s,"bottom")},onMouseOver:o,onMouseOut:r})]})}))}export default DragHandle;