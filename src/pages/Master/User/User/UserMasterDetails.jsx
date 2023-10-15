import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { API, HELPER } from "../../../../services";
import { apiEndPoint } from "../../../../constants/routesList";
import { useFormik } from "formik";
import { StyledTextarea } from "../../../../components";
import Select from "react-select";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";

// inital data
const initialValues = {
	id: "",
	firstName: "",
	lastName: "",
	email: "",
	profile: "",
};

const header = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};

const UserMasterDetails = ({ open, togglePopup, userData }) => {
	const url = apiEndPoint.user;

	//  -------------formState --------------
	const [formState, setFormState] = useState({
		...initialValues
	  });
	  //  -------------Validation --------------
	  const rules = {
		firstName: "required",
		lastName: "required",
		email: "required",
		profile: "required|mimes:png,jpg,jpeg|max_file_size:1048576",
	  };
	
	  //  --------------handle onSubmit   --------------
	  const handleSubmit = (data) => {
		const fd = new FormData();

		for (const field in data) {
			fd.append(field, data[field]);
		}
		if (data.id === "") {
			API.post(url, fd, header)
				.then(() => {
					HELPER.toaster.success("Record created");
					togglePopup();
				})
				.catch((e) => HELPER.toaster.error(e.errors.message));
		} else {
			API.put(`${url}/${data.id}`, fd, header)
				.then(() => {
					HELPER.toaster.success("Record saved");
					togglePopup();
				})
				.catch((e) => {
					HELPER.toaster.error(e.errors.message);
				});
		}
	  };
	
	  const onChange = ({ target: { value, name } }) => {
		setFormState((prev) => ({
		  ...prev,
		  [name]: value,
		}));
	  };

	useEffect(() => {
		if (open === true && userData !== null) {
			setFormState(userData)
		} else {
			setFormState({...initialValues})
		}
	}, [open]);
	
	return (
		<>
			<Validators formData={formState} rules={rules}>
				{({ onSubmit, errors }) => {
					return (
						<ThemeDialog
							title={`${formState?.id === "" ? "Add" : "Edit"} User`}
							isOpen={open}
							onClose={togglePopup}
							actionBtns={<>
								{/* <Box sx={{ display: "flex", alignContent: "center", flexWrap: "unset" }}>
									<TextField
										id="icon-button-file"
										fullWidth={true}
										size="small"
										type="file"
										name="profile"
										inputProps={{ accept: "image/*" }}
										sx={{ mt: 1, mb: 2, display: "none" }}
										onChange={(e) => {
											formikProps.setFieldValue("profile", e.currentTarget.files[0]);
										}}
										onBlur={formikProps.handleBlur}
										helperText={formikProps.touched.profile && formikProps.errors.profile}
										error={Boolean(formikProps.errors.profile && formikProps.touched.profile)}
									/>
									<label htmlFor="icon-button-file">
										<IconButton
											color="primary"
											id="profile"
											component="span"
											className="button"
											onBlur={formikProps.handleBlur}
											aria-label="Upload picture"
											disableRipple={true}
										>
											{formState.profile && formState.profile !== null ? (
												<Box
													id="image"
													component="img"
													sx={{
														height: 50,
														width: 50,
														maxHeight: { xs: 25, md: 50 },
														maxWidth: { xs: 25, md: 50 },
														...(Boolean(formikProps.errors.profile && formikProps.touched.profile) && {
															border: "2px solid #FF3D57",
														}),
													}}
													src={URL.createObjectURL(formState.profile)}
													onError={(e) => {
														e.target.src = "/assets/camera.svg";
													}}
												/>
											) : (
												<Icon>photo_camera</Icon>
											)}
										</IconButton>
									</label>
									{Boolean(formikProps.errors.profile && formikProps.touched.profile) && (
										<p style={{ color: "#FF3D57", fontSize: "12px" }}>{formikProps.touched.profile && formikProps.errors.profile}</p>
									)}
								</Box> */}
								<ImgUploadBoxInput 
									name="profile"
									onChange={onChange}
									value={formState?.profile}
									error={errors?.profile}
								/>
								<Box>
									<Button variant="outlined" color="secondary" onClick={togglePopup}>
										Cancel
									</Button>
									<Button type="submit" color="primary" onClick={() => handleSubmit(onSubmit)}>
										Save
									</Button>
								</Box>
							</>}
						>
							<>
								<Textinput
									size="small"
									type="text"
									name="firstName"
									label="First Name"
									value={formState.firstName}
									onChange={onChange}
									error={errors?.firstName}
									sx={{ mb: 2, mt: 1, width: "49%" }}
								/>
								<Textinput
									type="text"
									name="lastName"
									label="Last Name"
									value={formState.lastName}
									onChange={onChange}
									error={errors?.lastName}
									sx={{ mb: 2, mt: 1, ml: 0.5, width: "49.5%" }}
								/>
								<Textinput
									fullWidth={true}
									size="small"
									type="email"
									name="email"
									label="Email"
									value={formState.email}
									onChange={onChange}
									error={errors?.email}
									sx={{ mb: 2, mt: 1 }}
									InputProps={{
										startAdornment: <InputAdornment position="start">@</InputAdornment>,
									}}
								/>
							</>
						</ThemeDialog>
					);
				}}
			</Validators>
		</>
	);
};

export default UserMasterDetails;
