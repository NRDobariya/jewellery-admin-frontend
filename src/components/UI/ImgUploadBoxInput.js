import React from 'react'
import { HELPER } from '../../services';
import { Box, Icon, IconButton } from "@mui/material";
import Textinput from './TextInput';

export default function ImgUploadBoxInput({error, name, onChange,value,...rest}) {
  const randomStr = () => {
    return Math.random(10).toString().slice(2);
  }  
  let randomId = 'file_upload_' + randomStr()

  return (
    <>
        <Box sx={{ display: "flex", alignContent: "center", flexWrap: "unset" }}>
            <Textinput
                size="small"
                type="file"
                onChange={onChange}
                id={randomId}
                name={name}
                inputProps={{ accept: "image/*" }}
                sx={{ mt: 1, mb: 2, display: "none" }}
                {...rest}
            />
            <label htmlFor={randomId}>
                <IconButton
                    color="primary"
                    component="span"
                    className="button"
                    aria-label="Upload picture"
                    disableRipple={true}
                >
                    {value && value !== null ? (
                        <Box
                            id={`image_${randomStr()}`}
                            component="img"
                            sx={{
                                height: 50,
                                width: 50,
                                maxHeight: { xs: 25, md: 50 },
                                maxWidth: { xs: 25, md: 50 },
                                ...(Boolean(error) && {
                                    border: "2px solid #FF3D57",
                                }),
                            }}
                            src={typeof value == 'string' ? value : URL.createObjectURL(value)}
                            onError={(e) => {
                                e.target.src = "/assets/camera.svg";
                            }}
                        />
                    ) : (
                        <Icon>photo_camera</Icon>
                    )}
                </IconButton>
            </label>
            {Boolean(!HELPER.isEmpty(error)) && (
                <>
                    {error.map((itemError) => (
                        <p style={{ color: "#FF3D57", fontSize: "12px" }}>{itemError}</p>
                    ))}
                </>
            )}
        </Box>
    </>
  )
}
