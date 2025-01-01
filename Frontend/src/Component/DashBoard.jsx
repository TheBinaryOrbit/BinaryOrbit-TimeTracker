import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Button,
    Text,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useBreakpointValue,
    Image,
    HStack,
    Avatar,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import img from "../assets/logo.png";
import { doc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore"; 
import { db } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate()
    const toast = useToast();
    const [userName] = useState("John Doe");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [data, setData] = useState([]);
    const [pendingCheckOutId, setPendingCheckOutId] = useState(null);

    useEffect(()=>{
            const islogged = localStorage.getItem('isloggedin');
            if(!(islogged == 'true')) {
                navigate('/')
            }
    } ,[])

    const generateRandomString = (length = 16) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    const handleCheckIn = async () => {
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const checkInTime = `${hours}:${minutes}`;

        const data = {
            checkInTime: checkInTime,
            checkOutTime: 'Pending',
            name : localStorage.getItem('name')
        };

        try {
            const docRef = doc(db, "timetracker", generateRandomString());
            await setDoc(docRef, data);
            console.log("Check-in recorded successfully");
            fetchData();  // Refresh data after check-in
            toast({
                title: "CheckIn Successful!",
                description: ``,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            console.error("Error recording check-in: ", error);
        }
    };

    const handleCheckOut = async (id) => {
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const checkOutTime = `${hours}:${minutes}`;

        const docRef = doc(db, "timetracker", id);
        try {
            await updateDoc(docRef, { checkOutTime  : checkOutTime});
            console.log("Check-out recorded successfully");
            fetchData();  // Refresh data after check-out
            toast({
                title: "CheckOut Successful!",
                description: ``,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            console.error("Error recording check-out: ", error);
        }
    };

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "timetracker"));
        const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setData(fetchedData);

        // Check if there's any pending checkout
        const pending = fetchedData.find(item => item.checkOutTime === 'Pending');
        if (pending) {
            setPendingCheckOutId(pending.id);
        } else {
            setPendingCheckOutId(null);
        }
    };


    const timeCalculator = (checkInTime, checkOutTime) => {
        // Convert the check-in and check-out times to date objects for easier calculation
        const [checkInHours, checkInMinutes] = checkInTime.split(':').map(Number);
        const [checkOutHours, checkOutMinutes] = checkOutTime.split(':').map(Number);
    
        // Create Date objects for both check-in and check-out times
        const checkInDate = new Date();
        checkInDate.setHours(checkInHours);
        checkInDate.setMinutes(checkInMinutes);
        checkInDate.setSeconds(0);
    
        const checkOutDate = new Date();
        checkOutDate.setHours(checkOutHours);
        checkOutDate.setMinutes(checkOutMinutes);
        checkOutDate.setSeconds(0);
    
        // If checkout is earlier than check-in, add 24 hours to checkout to account for crossing midnight
        if (checkOutDate < checkInDate) {
            checkOutDate.setDate(checkOutDate.getDate() + 1);
        }
    
        // Calculate the difference in milliseconds
        const timeDifference = checkOutDate - checkInDate;
    
        // Convert the difference into hours and minutes
        const hoursWorked = Math.floor(timeDifference / 1000 / 60 / 60); // Convert milliseconds to hours
        const minutesWorked = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
    
        return `${hoursWorked} hours ${minutesWorked} mins`;
    };

    const hondleLogOut = ()=>{
        localStorage.removeItem('isloggedin');
        navigate('/')
        toast({
            title: "Logout Successful!",
            description: ``,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
    }
    

    useEffect(() => {
        fetchData();  // Fetch data when the component mounts
    }, []);

    return (
        <Flex height="100vh" flexDirection="row" bg="gray.100">
            {/* Sidebar */}
            {isMobile ? (
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bg="gray.800" color="white">
                        <DrawerHeader textAlign="center">
                            <Image src={img} maxWidth="100px" mx="auto" />
                        </DrawerHeader>
                        <DrawerBody>
                            <VStack spacing={4} align="stretch">
                                <Button colorScheme="red" onClick={hondleLogOut} >
                                    Logout
                                </Button>
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Box
                    width="250px"
                    bg="gray.800"
                    color="white"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    p={[0, 0, 4]}
                    boxShadow="2xl"
                >
                    {/* Sidebar content */}
                    <Box textAlign="center">
                        <Image src={img} />
                    </Box>
                    <Button colorScheme="red" mt={4} onClick={hondleLogOut}>
                        Logout
                    </Button>
                </Box>
            )}

            {/* Main Content */}
            <Flex
                flex={1}
                flexDirection="column"
                alignItems="center"
                overflow="auto"
                p={[0, 0, 0, 4]}
            >
                {/* Header */}
                {isMobile && (
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        bg="gray.800"
                        color="white"
                        px={4}
                        py={3}
                        width="full"
                    >
                        <IconButton
                            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                            aria-label="Toggle Sidebar"
                            onClick={isOpen ? onClose : onOpen}
                            colorScheme="teal"
                            size="sm"
                        />
                        <Text fontWeight="bold" fontSize="lg">
                            Dashboard
                        </Text>
                    </Flex>
                )}

                {/* User Section */}
                <HStack
                    spacing={6}
                    marginBottom={6}
                    py={6}
                    width="full"
                    justifyContent="space-between"
                    alignItems="center"
                    backgroundColor="gray.800"
                    px={4}
                    flexWrap="wrap"
                    borderRadius={[0, 0, 0, 12]}
                    borderBottomLeftRadius={[12]}
                    borderBottomRightRadius={[12]}
                >
                    <HStack flex={1} flexWrap="wrap" spacing={4}>
                        <Avatar src="https://bit.ly/broken-link" />
                        <Box>
                            <Text color="white" fontWeight="600" textTransform={'capitalize'}>
                                {
                                    localStorage.getItem('name')
                                }
                            </Text>
                            <Text color="white" fontWeight="600">
                                {localStorage.getItem('email')}
                            </Text>
                        </Box>
                    </HStack>

                    <HStack
                        spacing={4}
                        flexWrap="wrap"
                        justifyContent={{ base: "center", md: "flex-end" }}
                    >
                        {pendingCheckOutId ? (
                            <Button
                                color={'white'}
                                width={{ base: "full", md: "200px" }}
                                backgroundColor="red.600"
                                _hover={{backgroundColor : 'red.700'}}
                                onClick={() => handleCheckOut(pendingCheckOutId)}
                            >
                                Check Out
                            </Button>
                        ) : (
                            <Button
                                color={'white'}
                                width={{ base: "full", md: "200px" }}
                                backgroundColor="green.600"
                                _hover={{backgroundColor : 'green.700'}}
                                onClick={handleCheckIn}
                            >
                                Check In
                            </Button>
                        )}
                    </HStack>
                </HStack>

                {/* Table Section */}
                <Box overflowX="auto" width="100%" p={6} className="scroll">
                    <Table variant="striped" colorScheme="teal">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Date</Th>
                                <Th>Check-In Time</Th>
                                <Th>Check-Out Time</Th>
                                <Th>Work Time</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((item) => (
                                <Tr key={item.id}>
                                    <Td fontWeight={'600'} textTransform={'capitalize'}>{item.name}</Td>
                                    <Td>{new Date().toLocaleDateString()}</Td>
                                    <Td>{item.checkInTime}</Td>
                                    <Td>{item.checkOutTime}</Td>
                                    <Td>{item.checkOutTime === 'Pending' ? 'N/A' : timeCalculator(item.checkInTime ,  item.checkOutTime)}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Dashboard;
