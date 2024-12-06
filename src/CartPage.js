import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchCart, fetchProductDetails } from './ApiService';
import { USER_ID } from './constants';

function ChartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getCart = async () => {
      try {
        const data = await fetchCart(USER_ID); // panggil fetchCart dengan userid 1

        // jika orders kosong (bukan array) defaultnya array kosong
        const orders = Array.isArray(data) ? data : [];
        // mendapatkan data orders paling akhir (karena dari api ordersnya lebih dari 1,kita ambil saja order paling akhir)
        /**
         * [
    {
        "id": 1,
        "userId": 1,
        "date": "2020-03-02T00:00:00.000Z",
        "products": [
            {
                "productId": 1,
                "quantity": 4
            },
            {
                "productId": 2,
                "quantity": 1
            },
            {
                "productId": 3,
                "quantity": 6
            }
        ],
        "__v": 0
    },
    {
        "id": 2,
        "userId": 1,
        "date": "2020-01-02T00:00:00.000Z",
        "products": [
            {
                "productId": 2,
                "quantity": 4
            },
            {
                "productId": 1,
                "quantity": 10
            },
            {
                "productId": 5,
                "quantity": 2
            }
        ],
        "__v": 0
    }
]
         */
        const latestOrder = orders[orders.length - 1]; //orders dengan index maksimal
        //dari json orders diatas tidak didapat informasi dari detail item, maka kita perlu get detail item
        //Promise.all: Menjalankan beberapa promise secara paralel dan menunggu hingga semuanya selesai.
        const productsWithDetails = await Promise.all(
          (latestOrder.products || []).map(async (item) => {
            try {
              const productDetails = await fetchProductDetails(item.productId);
              /*
              productsDetails spt ini jsonnya:
              {
    "id": 5,
    "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    "price": 695,
    "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    "rating": {
        "rate": 4.6,
        "count": 400
    }
}
              */
              //menggabungkan array productDetails (spread operator)
              //quantity : menambahkan informasi jumlah produk, karena kita akan membuat susunan json baru
              // { id: 1, title: "", price: 10, quantity: x },
              return { ...productDetails, quantity: item.quantity };
            } catch (error) {
              console.error(`Error fetching details for productId ${item.productId}:`, error);
              return null;
            }
          })
        );
  
        //set variabel cart, dengan spreadoperator : latestOrder,  diganti dengan productsWithDetails
        setCart({ ...latestOrder, products: productsWithDetails});
  
        // menghitung total dari price * quantity
        const total = productsWithDetails.reduce((acc, item) => acc + (item?.price || 0) * item.quantity, 0);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    getCart();
  }, []);
  

  const handleDelete = async () => {
    try {
      // panggil delete yang idcartnya 6 (ini tidak akan menghapus data secara real spt penjelasan di API)
      const response = await fetch('https://fakestoreapi.com/carts/6', {
        method: 'DELETE',
      });

      if (response.ok) {
        
        //setCart([]);
      } else {
        console.error('Failed to delete cart');
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Your Cart</h2>
      {cart.products && cart.products.length > 0 ? (
        <div>
          <h3>Order Details</h3>
          <p>Date: {new Date(cart.date).toLocaleDateString()}</p>
          <Row>
            <Col md={8}>
              <ListGroup>
                {cart.products.map((item) => (
                  <ListGroup.Item key={item.productId}>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h5>{item.title}</h5>
                        <p>
                          ${item.price} x {item.quantity}
                        </p>
                        <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button
                          variant="danger"
                          onClick={() => handleDelete()}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center">Summary</Card.Title>
                  <hr />
                  <h5>Grand Total: ${total.toFixed(2)}</h5>
                  <div className="d-flex justify-content-center">
                    <Link to="/checkout">
                      <Button variant="success">Proceed to Checkout</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </Container>
  );
}

export default ChartPage;