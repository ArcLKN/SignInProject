import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
	Box,
	Center,
	Button,
	Text,
	Flex,
	Input,
	InputGroup,
	FormLabel,
	InputRightElement,
	Image,
	IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables.jsx";

// prettier-ignore
const PATTERN = {
  email: /^[\w-\.+]+@([\w-]+.)+[\w-]{2,4}$/g,
  name: /^[\w -]{4,100}$/i,
  password: /^[\w \-\!\.\?]{4,100}$/,
};

function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	const [doShowPassword, setDoShowPassword] = useState("hide");
	const [doShowAccountExists, setDoShowAccountExists] = useState(false);

	function changePasswordState() {
		if (doShowPassword == "hide") {
			setDoShowPassword("show");
		} else {
			setDoShowPassword("hide");
		}
	}

	async function signUp(event) {
		console.log(event);
		try {
			const response = await window.fetch(
				"http://localhost:3001/api/sign-up",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(event),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const json = await response.json();
			if (json.msg && json.msg.token) {
				localStorage.setItem("token", json.msg.token);
				window.location.href = "/sign-in";
			} else {
				setDoShowAccountExists(true);
			}
		} catch (error) {
			console.error("Error signing up:", error);
		}
	}

	return (
		<>
			<Box pos='absolute' p='15px'>
				<ChakraLink as={ReactRouterLink} to='/'>
					<Button w='100%' bgColor={colors.bgColor}>
						<Flex align='center'>
							<Image
								src='../prelaunchLogo.png'
								width='30px'
							></Image>
							<Text ml='5px' fontWeight='bold' fontSize='20px'>
								Prelaunch.com
							</Text>
						</Flex>
					</Button>
				</ChakraLink>
			</Box>
			<Center h='100vh'>
				<Box p='5' w='440px' maxW='440px' textAlign='center'>
					<Text
						mt={2}
						fontSize='28px'
						fontWeight='bold'
						className='title'
						color={colors.dagrey}
					>
						Great to See You Here!
					</Text>
					<Text color={colors.mgrey} className='subTitle'>
						Create your account
					</Text>
					<form
						onSubmit={handleSubmit((data) => {
							signUp(data);
						})}
					>
						<Flex direction='column'>
							<FormLabel>First Name</FormLabel>
							<Input
								{...register("firstName", {
									required: "First name is required.",
									minLength: {
										value: 4,
										message: "Min length is 4.",
									},
									maxLength: {
										value: 100,
										message: "Max length is 100.",
									},
									pattern: {
										value: PATTERN.name,
										message:
											"Should only contain alphanumerical characters.",
									},
								})}
								placeholder='First Name'
							/>
							<Text color={colors.redError}>
								{errors.firstName?.message}
							</Text>
							<FormLabel>Last Name</FormLabel>
							<Input
								{...register("lastName", {
									required: "Last name is required.",
									minLength: {
										value: 4,
										message: "Min length is 4.",
									},
									maxLength: {
										value: 100,
										message: "Max length is 100.",
									},
									pattern: {
										value: PATTERN.name,
										message:
											"Should only contain alphanumerical characters.",
									},
								})}
								placeholder='Last Name'
							/>
							<Text color={colors.redError}>
								{errors.lastName?.message}
							</Text>
							<FormLabel>Email</FormLabel>
							<Input
								// prettier-ignore
								{...register("email", {
                  required: "Email is required.",
                  maxLength: { value: 100, message: "Max length is 100." },
                  pattern: {
                    value: PATTERN.email,
                    message: "This is not an email.",
                  },
                })}
								placeholder='example@email.com'
							/>
							<Text color={colors.redError}>
								{errors.email?.message}
							</Text>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={
										doShowPassword == "hide"
											? "password"
											: "text"
									}
									{...register("password", {
										required: "Password is required.",
										minLength: {
											value: 4,
											message: "Min length is 4.",
										},
										maxLength: {
											value: 100,
											message: "Max length is 100.",
										},
										pattern: {
											value: PATTERN.password,
											message:
												"Password can contain a-zA-Z0-9 ?!.-_",
										},
									})}
									placeholder='Password'
								/>
								<InputRightElement>
									<IconButton
										bgColor='white'
										color={colors.mgrey}
										onClick={changePasswordState}
										icon={
											doShowPassword == "hide" ? (
												<ViewOffIcon />
											) : (
												<ViewIcon />
											)
										}
									/>
								</InputRightElement>
							</InputGroup>
							<Text color={colors.redError}>
								{errors.password?.message}
							</Text>
							<Input
								mt='20px'
								type='submit'
								color={colors.contrastColor}
								w='100%'
								colorScheme={colors.mainColor}
								bgColor='teal.300'
								value='Sign-up'
							/>
							{doShowAccountExists && (
								<Text color={colors.redError}>
									Account already exists.
								</Text>
							)}
						</Flex>
					</form>
					<Flex mt='20px' justify='center' flexDirection='row'>
						<Text color={colors.dagrey}>
							Already have an account?
						</Text>
						<ChakraLink
							ml='5px'
							color={colors.link}
							as={ReactRouterLink}
							to='/sign-in'
						>
							Sign-in.
						</ChakraLink>
					</Flex>
				</Box>
			</Center>
		</>
	);
}

export default SignUp;
