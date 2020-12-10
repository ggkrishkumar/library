import React, { forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const RowSelector = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <div className="neo-grid__row-selector">
            <div className="neo-form-check">
                <input
                    type="checkbox"
                    className="neo-checkbox form-check-input"
                    ref={resolvedRef}
                    {...rest}
                />
            </div>
        </div>
    );
});

RowSelector.propTypes = {
    indeterminate: PropTypes.bool
};

export default RowSelector;
