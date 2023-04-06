import React, { useState } from 'react'
import  Form   from 'react-bootstrap/Form';
import  Button  from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AuthService from './AuthService';
import TitleHeader from './TitleHeader';
const Login = () => {

    const history = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');
    const [errorDivShow, setErrorDivShow] = useState(false);



    const handleChange = (data) => {
        const fieldName = data.target.name;
        const fieldValue = data.target.value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: fieldValue,
        }));
    }


    const handleSubmit = (data) => {
        data.preventDefault();

        const { email, password } = formData;

        let errors = {};
        if (!email) {
            errors.email = 'Email field is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Enter a valid email address.';
        }
        if (!password) {
            errors.password = 'Password field is required.';
        }

        setFormErrors(errors)

        if (Object.keys(errors).length <= 1) {
            console.log(email, password)
            Axios.post("http://localhost:5050/getByEmail", {
                email: email,
                password: password
            })
                .then((response) => {
                    console.log(response.data.sign);
                    if (response.data.sign && response.data.length !== 0) {
                        const UserID = response.data.result[0].name
                        const token = response.data.token
                        console.log(token)

                        if (token) {
                            console.log("in here", UserID);
                            AuthService.setToken(token)
                            history(`/watchlist/${UserID}`);
                            const tempEmail = email;

                        }
                        else {
                            setError('Login Error!!! Please try again.')
                            setErrorDivShow(true)
                        }
                    }
                    else if (!response.data) {
                        setError('Wrong Password/Email-ID!!! Please try again.')
                        setErrorDivShow(true)
                    }
                }).catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

    }

    return (
        <>
            <TitleHeader/>
            <div className='container mt-3'>
                <section>
                    <div className='left_side mt-3'>
                        <h3 className='text-center col-lg-4'>Sign In</h3>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group className='mb-3 col-lg-4' controlId='formBasicEmail'>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email'
                                    isInvalid={!!formErrors.email}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {formErrors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                                className='mb-3 col-lg-4'
                                controlId='formBasicPassword'
                            >
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='Enter your password'
                                    isInvalid={!!formErrors.password}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {formErrors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {errorDivShow &&
                                <Alert variant="danger" className='mb-3 col-lg-4' onClose={() => setErrorDivShow(false)} dismissible>
                                    {error}
                                </Alert>
                            }

                            <Button variant="primary" className='col-lg-4' onClick={handleSubmit} type="submit">
                                Sign In
                            </Button>
                        </Form>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Login