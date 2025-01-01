import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    useToast,
} from "@chakra-ui/react";
import { auth } from "../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();

    useEffect(()=>{
        const islogged = localStorage.getItem('isloggedin');
        if(islogged == 'true') {
            navigate('/dashboard')
        }
    } ,[])

    const handleLogin = async () => {
        // Add your login logic here
        if (email && password) {

            try {
                const res = await signInWithEmailAndPassword(auth, email, password);
                localStorage.setItem('email' , ((res.user.email)))
                localStorage.setItem('name' , ((res.user.email).split('@'))[0])
                localStorage.setItem('isloggedin' , true);
                toast({
                    title: "Login Successful!",
                    description: `Welcome back, ${res.user.email}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
                navigate('/dashboard')
            } catch (e) {
                console.log(e);
                toast({
                    title: "Error",
                    description: "Invalid-credential",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
            }
        } else {
            toast({
                title: "Error",
                description: "Please fill in both fields.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        }
    };

    return (
        <Flex
            height="100vh"
            alignItems="center"
            justifyContent="center"
            bg="gray.100"
        >
            <Box
                p={8}
                width={'400px'}
                borderWidth={1}
                borderRadius={8}
                boxShadow="lg"
                bg="white"
            >
                <Heading mb={6} textAlign="center">
                    Login
                </Heading>
                <FormControl mb={4}>
                    <FormLabel>Email ID</FormLabel>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <Button
                    colorScheme="blue"
                    width="full"
                    mt={4}
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </Box>
        </Flex>
    );
};

export default Login;
