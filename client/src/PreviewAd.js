import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Carousel } from "react-bootstrap";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import { MDBCardImage, MDBCol, MDBRow } from "mdb-react-ui-kit";
import MapComponent from "./MapComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Modallogin from "./Modallogin";
import Loading from "./resources/Loading";
import NotFoundComponent from "./resources/NotFound";

const PreviewAd = ({auth}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [own, setOwn] = useState();
  const [loading, setLoading] = useState(true);
  const [NotFound, setNotFound] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();

    // for register and login
    const [staticModal, setStaticModal] = useState(false);
    const toggleShow = () => setStaticModal(!staticModal);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `https://random-backend-yjzj.onrender.com/previewad/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setOwn(response.data.own);
      setData(response.data.product);
      setLoading(false); // Set loading state to false when data is fetched successfully
    } catch (error) {
      // console.error(error);
      // when not loged in
      // make changes for not loged in user as authToken is not updated so data is not recieved .
      setOwn(false);
      try{
        const notlogedindata = await axios.post(`https://random-backend-yjzj.onrender.com/previewad/notloggedin/${id}`);
      setData(notlogedindata.data.product);
      setLoading(false); // Set loading state to false when data is fetched successfully
      }
      catch(e){
        setLoading(false);
        setNotFound(true); 
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (NotFound) {
      return <NotFoundComponent />;
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await axios.delete(`https://random-backend-yjzj.onrender.com/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setIsRemoving(false);
      toast({
        title: "Ad Removed",
        description: "The ad has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/myads");

      console.log("ok");
    } catch (error) {
      setIsRemoving(false);

      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while removing the ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleClick = async function(){
    if(auth){
     window.location.href = `/chat/${id}/${data.useremail}`
    }
    else{
    toggleShow();
    }
  }
  const address = data.address?.[0] || {};

  const ProductPics = Object.keys(data)
    .filter((key) => key.startsWith("productpic") && data[key])
    .map((key) => data[key]);

  const createdAt = new Date(data.createdAt);
  const now = new Date();
  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - createdAt.getTime();
  // Convert milliseconds to days
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return (
    <div style={{ backgroundColor: "rgba(235, 238, 239, 1)" }}>
      <div className="container">
        <MDBRow>
          <div style={{ backgroundColor: "white", marginTop: "20px" }}>
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
            >
              <BreadcrumbItem className="mt-2">
                <BreadcrumbLink as={Link} to="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem className="mt-2">
                <BreadcrumbLink as={Link} to={`/${data.catagory}`}>
                  {data.catagory}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem className="mt-2">
                <BreadcrumbLink as={Link} to={`/${data.subcatagory}`}>
                  {data.subcatagory}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem className="mt-2" isCurrentPage>
                <BreadcrumbLink>{data.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <MDBCol className="mt-4" md="8">
            <Card className="mt-2 mb-2" maxW="3xl">
              <CardBody>
                <Carousel>
                  {ProductPics.map((pic, id) => (
                    <Carousel.Item key={id}>
                      <Image borderRadius="lg" src={pic} alt={id} />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </CardBody>
              <Divider />
              <CardFooter>
                <Stack spacing="1">
                  <Heading size="md">Description:</Heading>
                  <Text color="blue.600" fontSize="s">
                    {data.description}
                  </Text>
                </Stack>
              </CardFooter>
            </Card>
          </MDBCol>
          <MDBCol className="mt-4" md="4">
            <MDBRow className="mb-3">
              <Card className="mt-2 mb-2" maxW="lg">
                <CardBody>
                  <Heading>
                    <CurrencyRupeeTwoToneIcon />
                    {data.price}
                  </Heading>
                  <Text color="blue.900" fontSize="s">
                    {data.title}
                  </Text>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Stack spacing="1">
                    <Flex justify="space-between">
                      <Text color="blue.600" fontSize="xs">
                        {`${address.area}, ${address.city}, ${address.state}, ${address.postcode}`}
                      </Text>
                      <Text color="blue.600" mx="4" fontSize="xs">
                        {`${daysAgo} days ago`}
                      </Text>
                    </Flex>
                  </Stack>
                </CardFooter>
              </Card>
            </MDBRow>
            <MDBRow className="mb-3">
              {own && (
                <Card className="mt-2 mb-2" maxW="lg">
                  <Link to="/profile" style={{ textDecoration: "none" }}>
                    <CardBody style={{ display: "flex", alignItems: "center" }}>
                      <MDBCardImage
                        className="img-fluid rounded-circle border border-dark border-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "10px",
                        }}
                        src={data.ownerpicture}
                        alt="Profile"
                        fluid
                      />
                      <div style={{ marginLeft: "1rem" }}>
                        <Heading size="md">{data.owner}</Heading>
                      </div>
                      <div style={{ flexGrow: 1 }}></div>
                      <ChevronRightIcon />
                    </CardBody>
                  </Link>
                  <Divider />
                  <Stack spacing="1">
                    <div className="d-grid gap-2 mb-4">
                      <Button
                        variant="outline-secondary"
                        borderRadius="10"
                        size="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor="gray.300"
                        onClick={handleRemove}
                        isLoading={isRemoving}
                        loadingText="Removing"
                      >
                        Remove
                      </Button>
                    </div>
                  </Stack>
                </Card>
              )}
              {own === false && (
                <Card className="mt-2 mb-2" maxW="lg">
                  <Link
                    to={`/profile/${data.useremail}`}
                    style={{ textDecoration: "none" }}
                  >
                    <CardBody style={{ display: "flex", alignItems: "center" }}>
                      <MDBCardImage
                        className="img-fluid rounded-circle border border-dark border-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "10px",
                        }}
                        src={data.ownerpicture}
                        alt="Profile"
                        fluid
                      />
                      <div style={{ marginLeft: "1rem" }}>
                        <Heading size="md">{data.owner}</Heading>
                      </div>
                      <div style={{ flexGrow: 1 }}></div>
                      <ChevronRightIcon />
                    </CardBody>
                  </Link>
                  <Divider />
                  <Stack spacing="1">
                    <div className="d-grid gap-2 mb-4">
                      <Button
                        variant="outline-secondary"
                        borderRadius="10"
                        size="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor="gray.300"
                        onClick={handleClick}
                      >
                        Chat With Seller
                      </Button>
                    </div>
                  </Stack>
                </Card>
              )}
            </MDBRow>
            <MDBRow className="mb-3">
              <Card className="mt-2 mb-2" maxW="lg">
                <CardHeader>
                  <Heading size="md">Posted in:</Heading>
                </CardHeader>
                <CardBody>
                  <MapComponent
                    area={address.area}
                    city={address.city}
                    state={address.state}
                  />
                </CardBody>
                <Divider />
                <CardFooter>
                  <Stack spacing="1">
                    <Text color="blue.600" fontSize="s">
                      {`${address.area}, ${address.city}, ${address.state}, ${address.postcode}`}
                    </Text>
                  </Stack>
                </CardFooter>
              </Card>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </div>

      <Modallogin
        setStaticModal={setStaticModal}
        toggleShow={toggleShow}
        staticModal={staticModal}
      />
    </div>
  );
};

export default PreviewAd;
