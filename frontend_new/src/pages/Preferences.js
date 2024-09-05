import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Preferences = () => {
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;
        if (user.preference) {
          setSources(JSON.parse(user.preference.sources) || []);
          setCategories(JSON.parse(user.preference.categories) || []);
          setAuthors(JSON.parse(user.preference.authors) || []);
        }
      } catch (error) {
        console.error('Failed to load preferences');
      }
    };

    fetchPreferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:8000/api/preferences',
        {
          sources,
          categories,
          authors,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Preferences updated successfully.');
    } catch (err) {
      setMessage('Failed to update preferences.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Set Your Preferences</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formSources" className="mb-3">
          <Form.Label>News Sources</Form.Label>
          <Form.Control
            type="text"
            value={sources.join(', ')}
            onChange={(e) =>
              setSources(
                e.target.value
                  .split(',')
                  .map((source) => source.trim())
              )
            }
            placeholder="e.g., bbc-news, cnn"
          />
        </Form.Group>

        <Form.Group controlId="formCategories" className="mb-3">
          <Form.Label>Categories</Form.Label>
          <Form.Control
            type="text"
            value={categories.join(', ')}
            onChange={(e) =>
              setCategories(
                e.target.value
                  .split(',')
                  .map((category) => category.trim())
              )
            }
            placeholder="e.g., business, technology"
          />
        </Form.Group>

        <Form.Group controlId="formAuthors" className="mb-3">
          <Form.Label>Authors</Form.Label>
          <Form.Control
            type="text"
            value={authors.join(', ')}
            onChange={(e) =>
              setAuthors(e.target.value.split(',').map((author) => author.trim()))
            }
            placeholder="e.g., John Doe, Jane Smith"
          />
        </Form.Group>

        <Button variant="primary" type="submit" block>
          Save Preferences
        </Button>
      </Form>
    </Container>
  );
};

export default Preferences;
