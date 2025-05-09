import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import CatNavbar from "../CatNavbar";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCards/ProductCard";
import SearchNotFound from "../resources/SearchNotFound";
import NotFound from "../resources/NotFound";
import Loading from "../resources/Loading";

// Base API URL to avoid typos and make updates easier
const API_BASE_URL = "http://localhost:5000";

export default function SearchResults() {
  // Use React Router's useSearchParams instead of directly accessing window.location
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const hasMoreProductsToLoad = visibleproducts < results.length;

  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        // Fixed URL with single slash instead of double slash
        const response = await axios.get(
          `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
        );
        setResults(response.data);
      } catch (err) {
        console.error("Search error:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
      }
    };

    // Check immediately
    checkRazorpay();

    // Check again after a delay in case it loads asynchronously
    const timeoutId = setTimeout(checkRazorpay, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handlePayment = async (product) => {
    try {
      if (!isRazorpayLoaded) {
        throw new Error("Razorpay SDK not loaded");
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to make a purchase",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      setIsPaymentLoading(true);

      // Get Razorpay Key - Fixed URL with single slash
      const keyResponse = await axios.get(`${API_BASE_URL}/api/getkey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create Order - Fixed URL with single slash
      const amount = Math.round(product.price * 100); // Convert to paise
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/checkout`,
        {
          amount: amount,
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { order } = orderResponse.data;

      // Initialize Razorpay options
      const options = {
        key: keyResponse.data.key,
        amount: order.amount,
        currency: "INR",
        name: "College Exchange",
        description: `Payment for ${product.title}`,
        order_id: order.id,
        prefill: {
          name: localStorage.getItem("authname") || "",
          email: localStorage.getItem("authemail") || "",
          contact: localStorage.getItem("authphone") || "",
        },
        handler: async function (response) {
          try {
            // Fixed URL with single slash
            const verificationResponse = await axios.post(
              `${API_BASE_URL}/api/paymentverification`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verificationResponse.data.success) {
              toast({
                title: "Payment Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description:
                error.response?.data?.message || "Please contact support",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaymentLoading(false);
          },
        },
        theme: {
          color: "#3182CE",
        },
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <NotFound error={error} />;
  }

  if (!query || results.length === 0) {
    return <SearchNotFound query={query} />;
  }

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl" py={4}>
        <Box mb={4}>
          <strong>Search results for:</strong> {query}
        </Box>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
          gap={6}
        >
          {results.slice(0, visibleproducts).map((product) => (
            <GridItem key={product._id}>
              <Link to={`/preview_ad/${product._id}`}>
                <ProductCard
                  product={product}
                  onBuyClick={handlePayment}
                  isPaymentLoading={isPaymentLoading}
                />
              </Link>
            </GridItem>
          ))}
        </Grid>
        {hasMoreProductsToLoad && (
          <Box textAlign="center" mt={6} mb={4}>
            <Button
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
          </Box>
        )}
      </Container>
    </Box>
  );
}
