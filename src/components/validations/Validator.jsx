import { validationMessages } from "./../../constants/validationMessages";
import React, { createContext, useEffect, useState } from "react";
import Validator from "validatorjs";
import { HELPER } from "./../../services";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const _registerConfirmPasswordValidations = (password) => {
  Validator.register(
    "confirm_password",
    function (value) {
      return value === password;
    },
    "Password and confirm password should must match"
  );
};

const _registerFileuploadValidations = () => {
  Validator.register(
    "mimes",
    function (value, requirement, attribute) {
      const allowedExtensions = requirement.split(',');
      const fileExtension = value.name.split('.').pop();
      if (!allowedExtensions.includes(fileExtension)) {
        return false; // Invalid file type
      }
      return true;
    },
    "The :attribute must be a file of type :mime_types"
  );

Validator.register(
    "max_file_size",
    function (value, requirement, attribute) {
        if (value.size > Number(requirement)) {
            return false; // File size exceeds 1MB
        }

        return true
    },
    "Max file size is :max_size"
  );

  Validator.register(
    "min_file_size",
    function (value, requirement, attribute) {
        if (value.size < Number(requirement)) {
            return false; // File size exceeds 1MB
        }

        return true
    },
    "Min file size is :min_size"
  );
};

const imageValidationMessagesModification = (errors, rules) => {
  for (let [field, errorMsgs] of Object.entries(errors)) {
      errors[field] = errorMsgs.map(messages => {
          if (messages.includes(':mime_types')) {

              let attributeMimeTypes = rules[field].split('|').find(e => e.includes('mimes')).replace('mimes:', '')
              messages = messages.replace(':mime_types', attributeMimeTypes).replace(':attribute', field)
          }

          if (messages.includes(':max_size')) {
              let attributeValue = rules[field].split('|').find(e => e.includes('max_file_size')).replace('max_file_size:', '')
              messages = messages.replace(':max_size', formatBytes(attributeValue))
          }

          if (messages.includes(':min_size')) {
              let attributeValue = rules[field].split('|').find(e => e.includes('min_file_size')).replace('min_file_size:', '')
              messages = messages.replace(':min_size', formatBytes(attributeValue))
          }

          return messages;
      });
  }

  return errors;
}

const _registerValidations = (formState, rules) => {
  _registerConfirmPasswordValidations(formState?.password)
  _registerFileuploadValidations()
}

export default function Validators({
  registerValidations = null,
  setErrors: errorsData = null,
  customValidationMessages = {},
  formData = {},
  rules = {},
  children,
}) {
  const [submitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      let _isValidationFail = isValidationFail();
      if (false == _isValidationFail) {
        setErrors({});
      }
    }
  }, [formData]);

  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (errorsData) {
      setErrors(errorsData);
    }
  }, [errorsData]);

  const onSubmit = (callback) => {
    let isValidationFailed = isValidationFail();
    if (false == isValidationFailed) {
      setErrors({});
      callback(formData);
      setIsSubmitted(false);
    } else {
      HELPER.toaster.error("Please fill the required fields with valid format");
      setIsSubmitted(true);
    }
  };

  const isValidationFail = () => {
    Validator.setMessages("en", validationMessages);

    _registerValidations(formData, rules);

    let validation = new Validator(formData, rules, customValidationMessages);
    validation.setAttributeFormatter(function (attribute) {
      return ":attribute";
    });

    if (validation.fails()) {
      let validationErrors = imageValidationMessagesModification(validation.errors.errors, rules);
      setErrors(validationErrors);
      return true;
    }
    return false;
  };

  return <>{children({ onSubmit, errors })}</>;
}
