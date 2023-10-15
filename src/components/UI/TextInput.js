import React, { useState } from "react";
import { TextField } from "@mui/material";
import ValidationMessages from "../validations/ValidationMessages";
import { HELPER } from "../../services";

const Textinput = ({
  type,
  label,
  placeholder = "",
  className = "",
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  onChange,
  ...rest
}) => {
  return (
    <div className="mb-3">
        <TextField
            size="small"
            error={error ? true : false}
            sx={{ mb: 2, mt: 1, ml: 0.5, width: "49.5%" }}
            type={type}
            {...rest}
            label={label}
            placeholder={placeholder}
            readOnly={readonly}
            value={value ? value : ""}
            disabled={disabled}
            id={id}
            onChange={(event) => {
                if (type == 'file') {
                    onChange({
                        target: {
                            name,
                            value: event.target.files[0]
                        }
                    })
                } else {
                    onChange(event)
                }
            }}
            name={name}
            invalid={error ? true : false}
        />

        <ValidationMessages errors={error} label={label} />
      </div>
  );
};

export default Textinput;
