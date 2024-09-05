import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  // Fetch latest articles when component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/articles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        setError('Failed to load articles.');
      }
    };

    fetchArticles();
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/articles/search',
        { keyword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticles(response.data);
    } catch (err) {
      setError('Failed to search articles.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Search Articles</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group controlId="searchKeyword" className="mb-3">
          <Form.Control
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for articles..."
          />
        </Form.Group>
        <Button variant="primary" type="submit" block>
          Search
        </Button>
      </Form>

      <h3 className="text-center mb-4">Latest Articles</h3>

      {articles.length > 0 ? (
        <Row>
          {articles.map((article, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={article.urlToImage || 'https://via.placeholder.com/150'}
                  alt="Article Image"
                />
                <Card.Body>
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>{article.description}</Card.Text>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Read More
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No articles available.</p>
      )}
    </Container>
  );
};

export default Home;
