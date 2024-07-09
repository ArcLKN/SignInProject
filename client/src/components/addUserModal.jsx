import { Text, Input, Flex, FormControl, FormLabel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Select } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

export default function AddUserModal({ isOpen, doOpen, createNewUser }) {

    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            userType: "User",
            email: "qwertzu@gmail.com",
        }
    })

    //console.log("Errors", errors)

    return(
        <Modal
        isOpen={isOpen}
        onClose={() => doOpen(false)}
        >
            <ModalOverlay/>
            <ModalContent maxH={"100vh"}>
                <ModalHeader>
                    Add New User
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody
                maxH="80%"
                overflowY="auto">
                    <form onSubmit={handleSubmit((data) => {
                        doOpen(false)
                        createNewUser(data)
                    })}>
                        <Flex direction="column">
                            <FormLabel>First Name</FormLabel>
                            <Input
                            {...register("firstName", {
                                required: 'First name is required.',
                                minLength: {value: 4, message: "Min length is 4."},
                                pattern: {value:/^[A-Za-z0-9]+$/i, message: "Should only contain alphanumerical characters."}
                                })
                            }
                            placeholder='First Name'/>
                            <Text color="red.300">{errors.firstName?.message}</Text>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                            {...register("lastName", {
                                required: 'Last name is required.',
                                pattern: {value:/^[A-Za-z0-9]+$/i, message: "Should only contain alphanumerical characters."}
                                })
                            }
                            placeholder='Last Name'/>
                            <Text color="red.300">{errors.lastName?.message}</Text>
                            <FormLabel>Email</FormLabel>
                            <Input
                            {...register("email", {
                                required: 'Email is required.',
                                pattern: {
                                    value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                    message: "This is not an email."
                                }
                                })
                            }
                            placeholder='example@email.com'/>
                            <Text color="red.300">{errors.email?.message}</Text>
                            <FormLabel>User Type</FormLabel>
                            <Select
                            {...register("userType", {required: "User type is required."})}>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Content Moderator">Content Moderator</option>
                                <option value="Discussions Moderator">Discussions Moderator</option>
                                <option value="User Moderator">User Moderator</option>
                                <option value="Guest">Guest</option>
                            </Select>
                            <Text color="red.300">{errors.userType?.message}</Text>
                            <Input mt="5" bgColor="teal.300" fontWeight={"bold"} type="submit" value="Add User"/>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}