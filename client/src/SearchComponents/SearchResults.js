import React, { useEffect, useState } from "react";
import axios from "axios";
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

export default function SearchResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const hasMoreProductsToLoad = visibleproducts < results.length;
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/search?q=${query}`
        );
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data.");
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
    checkRazorpay();
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

      // Get Razorpay Key
      const keyResponse = await axios.get("http://localhost:5000/api/getkey", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create Order
      const amount = Math.round(product.price * 100); // Convert to paise
      const orderResponse = await axios.post(
        "http://localhost:5000/api/checkout",
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
            const verificationResponse = await axios.post(
              "http://localhost:5000/api/paymentverification",
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

  if (results.length === 0) {
    return <SearchNotFound />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl">
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
      </Container>
    </Box>
  );
}
