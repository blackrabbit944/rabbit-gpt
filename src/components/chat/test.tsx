import React from "react";

const ChildComponent = React.forwardRef((props, ref) => {
    const handleClick = () => {
        console.log("Child component");
    };

    return (
        <button ref={ref} onClick={handleClick}>
            Click me
        </button>
    );
});
ChildComponent.displayName = "ChildComponent";
export default ChildComponent;
