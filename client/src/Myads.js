import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import CatNavbar from "./CatNavbar";
import axios from "axios";
import ReactLoading from "react-loading";
import NotListedAnything from "./resources/NotListedAnything";

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < ads.length;

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/myads_view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setAds(data);
      setIsLoading(false);
    };
    fetchAds();
  }, []);

  if (ads.length === 0 && isLoading === false) {
    return (
      <div>
        <CatNavbar />
        <NotListedAnything />
      </div>
    );
  }

  const handleDelete = async (id) => {
    setIsRemoving(true);
    setDeletingCardId(id); // Set the ID of the card being deleted
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`http://localhost:5000/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
      toast({
        title: "Ad Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsRemoving(false);
    setDeletingCardId(null); // Reset the deleting card ID
  };

  return (
    <div>
      {isLoading ? (
        <div className="back">
          <div className="lo-container">
            <ReactLoading
              type="spin"
              color="green"
              height={"10%"}
              width={"10%"}
            />
          </div>
        </div>
      ) : (
        <>
          <CatNavbar />
          <Box className="container" p={5}>
            <Heading size="lg" mb={4}>
              Your Products
            </Heading>
            {ads.slice(0, visibleproducts).map((ad) => (
              <Card key={ad._id} variant={"filled"} maxW="3xl" className="mb-4">
                <a href={`/preview_ad/${ad._id}`}>
                  <Stack className="mt-2" direction="row" spacing={4}>
                    <Image
                      src={ad.productpic1}
                      alt={ad.title}
                      w="100px"
                      h="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Stack spacing={2} flex={1}>
                      <Heading size="md">{ad.title}</Heading>
                      <Text fontSize="sm">{ad.description}</Text>
                      <Box textAlign="center">
                        <Text color="blue.600" fontSize="2xl">
                          &#x20b9;{ad.price}
                        </Text>
                      </Box>
                    </Stack>
                  </Stack>
                </a>
                <Divider mt={2} />
                <CardFooter>
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(ad._id)}
                    isLoading={isRemoving && deletingCardId === ad._id} // Show loading state only for the deleting card
                    loadingText="Removing"
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {hasMoreProductsToLoad && (
              <Button
                className="mb-2"
                bgGradient="linear(to-r, teal.400, cyan.600)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, teal.600, cyan.800)",
                }}
                _active={{
                  bgGradient: "linear(to-r, teal.800, cyan.900)",
                }}
                onClick={() => {
                  setVisibleProducts((prev) => prev + 10);
                }}
              >
                Load More
              </Button>
            )}
          </Box>
        </>
      )}
    </div>
  );
}
