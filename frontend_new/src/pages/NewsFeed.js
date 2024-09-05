import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewsFeed = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:8000/api/personalized-feed', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        setError('Failed to load personalized news feed.');
      }
    };

    fetchNewsFeed();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center">Your Personalized News Feed</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {articles.length > 0 ? (
        <Row>
          {articles.map((article, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={article.urlToImage || 'https://via.placeholder.com/150'}
                  alt="Article"
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
        <p>No articles found based on your preferences.</p>
      )}
    </Container>
  );
};

export default NewsFeed;
