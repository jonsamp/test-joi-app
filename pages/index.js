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
        // default error message is `\"Access token\" ...`, so replacing the quotation marks.
        [error.context.key]: error.message.replace(/\"/g, ''),
      };
    }, {});
  }
}

// Get form field data from a native HTML form
export function getFormFieldData(e, formSchema) {
  const data = Object.values(e.target.elements).reduce((acc, field) => {
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
        acc[field.id] = field.hasOwnProperty('checked')
          ? field.checked
          : field.value;
      }
    }
    return acc;
  }, {});

  let errors = {};

  if (formSchema) {
    errors = validateFormFields(formSchema, data);
    return [data, errors];
  }

  return data;
}

// Each form would need a schema object like this for validation
const formSchema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().required().label('Username'),
  accessToken: Joi.number().required().label('Access token'),
});

export default function Home() {
  const [errors, setErrors] = useState({});

  function onSubmit(e) {
    e.preventDefault();

    setErrors({});

    const [{ username, accessToken }, errors] = getFormFieldData(e, formSchema);

    // Set errors
    if (errors) {
      return setErrors(errors);
    }

    // Keep going
    console.log('NO ERRORS!');
  }

  return (
    <form onSubmit={onSubmit}>
      <label id='username'>Username</label>
      <input
        id='username'
        placeholder='username'
        style={{ borderColor: errors.username ? 'red' : null }}
      />
      <p style={{ color: 'red' }}>{errors.username}</p>
      <label id='accessToken'>Access token</label>
      <input
        id='accessToken'
        placeholder='access token'
        style={{ borderColor: errors.accessToken ? 'red' : null }}
      />
      <p style={{ color: 'red' }}>{errors.accessToken}</p>
      <button type='submit'>Submit</button>
    </form>
  );
}
