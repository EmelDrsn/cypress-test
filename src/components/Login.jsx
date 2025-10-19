import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

export const errorMessages = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 4 characters long',
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const history = useHistory();

  // ✅ validate fonksiyonu artık değer döndürüyor
  const validate = (form) => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = errorMessages.email;
    }

    if (form.password.length < 4) {
      newErrors.password = errorMessages.password;
    }

    if (!form.terms) {
      newErrors.terms = 'You must accept the terms before signing in';
    }

    return newErrors;
  };

  // form değiştikçe hataları ve geçerliliği güncelle
  useEffect(() => {
    const newErrors = validate(form);
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [form]);

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    value = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password === form.password && item.email === form.email
        );
        if (user) {
          setForm(initialForm);
          history.push('/main');
        } else {
          history.push('/error');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* EMAIL */}
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
          invalid={!!errors.email}
          data-cy="Email-input"
        />
        {errors.email && (
          <FormFeedback data-cy="error-message">{errors.email}</FormFeedback>
        )}
      </FormGroup>

      {/* PASSWORD */}
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password"
          type="password"
          onChange={handleChange}
          value={form.password}
          invalid={!!errors.password}
          data-cy="Password-input"
        />
        {errors.password && (
          <FormFeedback data-cy="error-message">{errors.password}</FormFeedback>
        )}
      </FormGroup>

      {/* TERMS */}
      <FormGroup check>
        <Input
          id="terms"
          name="terms"
          checked={form.terms}
          type="checkbox"
          onChange={handleChange}
          invalid={!!errors.terms}
        />
        <Label htmlFor="terms" check>
          I agree to terms of service and privacy policy
        </Label>
        {errors.terms && (
          <FormFeedback data-cy="error-message">{errors.terms}</FormFeedback>
        )}
      </FormGroup>

      {/* BUTTON */}
      <FormGroup className="text-center p-4">
        <Button
          color="primary"
          type="submit"
          disabled={!isValid}
          data-cy="submit-button"
        >
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
