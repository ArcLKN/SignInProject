import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
	Box,
	FormLabel,
	Center,
	Button,
	Text,
	Flex,
	Input,
	InputGroup,
	InputRightElement,
	Image,
	IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables.jsx";
import { checkUser } from "../api/UserRoutes.jsx";

function Login() {
	const [doShowPassword, setDoShowPassword] = useState("hide");
	const [doShowWrongCredentials, setDoShowWrongCredentials] = useState([
		false,
		null,
	]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function changePasswordState() {
		if (doShowPassword == "hide") {
			setDoShowPassword("show");
		} else {
			setDoShowPassword("hide");
		}
	}

	async function handleLogin(data) {
		const e = await checkUser(data);
		console.log(e);
		setDoShowWrongCredentials(e);
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
						Sign in to your account
					</Text>
					<form onSubmit={handleSubmit((data) => handleLogin(data))}>
						<FormLabel>Email</FormLabel>
						<Input
							{...register("email", {
								required: "Email is required.",
								pattern: {
									value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
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
								})}
								placeholder='Password'
							/>
							<InputRightElement>
								<IconButton
									bgColor={colors.bgColor}
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
						<Box mb='20px' mt='5px' textAlign='right'>
							<ChakraLink color={colors.link}>
								Forgot password?
							</ChakraLink>
						</Box>
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
							value='Login'
						/>
						{doShowWrongCredentials[1] && (
							<Text
								color={
									doShowWrongCredentials[0]
										? colors.mainColor
										: colors.redError
								}
							>
								{doShowWrongCredentials[1]}
							</Text>
						)}
					</form>
					<Flex mt='20px' justify='center' flexDirection='row'>
						<Text color={colors.dagrey}>
							Don't have an account?
						</Text>
						<ChakraLink
							ml='5px'
							color={colors.link}
							as={ReactRouterLink}
							to='/sign-up'
						>
							Sign up.
						</ChakraLink>
					</Flex>
				</Box>
			</Center>
		</>
	);
}

export default Login;
