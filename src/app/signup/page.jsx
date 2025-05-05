"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import Link from 'next/link';
import * as Yup from 'yup';
import clsx from 'clsx';
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

export default function Signup() {

    const [portfolios, setPortfolios] = useState([]);

    useEffect(() => {
        async function fetchPortfolios() {
            const response = await axios.post('/api');
            const data = await response.json();
            console.log(data)
            setPortfolios(data);
        }

        fetchPortfolios();
    }, []);

    const router = useRouter();
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSubmit = async (values) => {
        const { setSubmitting, setStatus } = values;
        try {
            const { email, password } = values;
            const response = await axios.post('/api/auth', { email, password });
            toast.success('Account created successfully!');
            router.replace('/login');
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'Failed to create account';
            setStatus(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = clsx('w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-none transition-colors')
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* left Panel */}
            <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6 animate-slide-up">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">Signup</h2>
                        <p className="text-gray-600 mb-8">BreadStock</p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, status }) => (
                            <Form className="space-y-4">
                                {status && (
                                    <div className=" bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                        {status}
                                    </div>
                                )}

                                <div>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className={inputStyle}
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                    )}
                                </div>

                                <div>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className={inputStyle}
                                        disabled={isSubmitting}
                                    />
                                    {errors.password && touched.password && (
                                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                    )}
                                </div>

                                <div>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        className={inputStyle}
                                        disabled={isSubmitting}
                                    />
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} className="text-white" />
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or signup with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                disabled={false}
                                className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaGoogle className="w-5 h-5 text-primary" />
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:w-1/2 bg-primary p-8 lg:p-12 flex flex-col justify-center text-white animate-fade-in">
                <div className="max-w-md mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Come join us!</h2>
                    <p className="text-lg text-light/90 mb-8">
                        We are so excited to have you here! If you haven't already, create an account to get
                        access to exclusive offers, rewards, and discounts.
                    </p>
                    <p className="text-accent">
                        Already have an account?{' '}
                        <Link href="/login" className="underline hover:text-light transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
}