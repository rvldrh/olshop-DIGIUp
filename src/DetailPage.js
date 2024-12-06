import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { fetchProductDetails, addToCart } from  './ApiService';
import { USER_ID } from './constants';

function DetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductDetails(id); // Fetch product using the service
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    getProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(USER_ID, [{ productId: product.id, quantity }]);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh', marginTop: '20px' }}>
      <div style={{ width: '40%', textAlign: 'center' }}>
        <p style={{ marginTop: '320px' }}></p>
        <h2>{product.title}</h2>
        <img src={product.image} alt={product.title} style={{
            objectFit: 'cover',
            height: '320px',
            width: '80%',
          }} />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <Form>
  <Row className="align-items-center">
    <Col xs={6}>
      <Form.Group>
        <Form.Label>Quantity</Form.Label>
        <Form.Control 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          min="1" 
        />
      </Form.Group>
    </Col>
    <Col xs={4} className="d-flex justify-content-between">
      <Button style={{marginTop: '30px'}} variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
    </Col>
  </Row>
  <br />
</Form>

      </div>
    </div>
  );
  
  
};

export default DetailPage;
