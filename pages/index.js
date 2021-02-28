import Joi from 'joi';
import React, { useState } from 'react';

// Use Joi to validate all fields, return an object of [field key]: error message
// Export this from ~/ui/components/form
function validateFormFields(schema, fieldObject) {
  const validationResult = schema.validate(fieldObject, { abortEarly: false });

  if (validationResult.error) {
    return validationResult.error.details.reduce((acc, error) => {
      return {
        ...acc,
        [error.context.key]: error.message,
      };
    }, {});
  }
}

// Get form field data from a native HTML form
export function getFormFieldData(e) {
  return Object.values(e.target.elements).reduce((acc, field) => {
    if (field.id) {
      if (field.type === 'radio') {
        if (!acc[field.name]) {
          if (field.checked) {
            acc[field.name] = field.id;
          } else {
            acc[field.name] = '';
          }
        }
      } else {
        acc[field.id] = field.hasOwnProperty('checked') ? field.checked : field.value;
      }
    }
    return acc;
  }, {});
}

// Each form would need a schema object like this for validation
const formSchema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().required(),
  accessToken: Joi.number().required(),
});

export default function Home() {
  const [errors, setErrors] = useState({});

  function onSubmit(e) {
    e.preventDefault();

    const { username, accessToken } = getFormFieldData(e);

    // Provide a schema, and the fields the user provided
    const validationErrors = validateFormFields(formSchema, { username, accessToken });

    // Set errors
    if (validationErrors) {
      return setErrors(validationErrors);
    }

    // Keep going
    console.log('NO ERRORS!');
  }

  return (
    <form onSubmit={onSubmit}>
      <input id="username" placeholder="username" />
      {/* Access form errors by name fo the field */}
      <p>Username error: {errors.username}</p>
      <input id="accessToken" placeholder="access token" />
      <p>accessToken error: {errors.accessToken}</p>
      <button type="submit">Submit</button>
    </form>
  );
}
