import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    description: '',
    requestData: {
      clothes: {},
      stationary: {},
      foods: {},
      furniture: {},
      electronics: {}
    }
  });

  const [files, setFiles] = useState({
    clothesImages: [],
    stationaryImages: [],
    foodsImages: [],
    furnitureImages: [],
    electronicsImages: []
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Mock user token for testing (replace with actual auth token)
  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZhYjY5YzUwZjU5MzAwMTM4NGQ4YjgiLCJyb2xlIjoicmVjZWl2ZXIiLCJpYXQiOjE3MzUxNDQxNDh9.test";

  // Handle input changes for description
  const handleDescriptionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  // Add item to category
  const addItemToCategory = (category, itemName, count) => {
    if (!itemName || !count) return;
    
    setFormData(prev => ({
      ...prev,
      requestData: {
        ...prev.requestData,
        [category]: {
          ...prev.requestData[category],
          [itemName]: { count: parseInt(count) }
        }
      }
    }));
  };

  // Remove item from category
  const removeItemFromCategory = (category, itemName) => {
    setFormData(prev => {
      const newRequestData = { ...prev.requestData };
      delete newRequestData[category][itemName];
      return {
        ...prev,
        requestData: newRequestData
      };
    });
  };

  // Handle file uploads
  const handleFileChange = (category, files) => {
    setFiles(prev => ({
      ...prev,
      [`${category}Images`]: Array.from(files)
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      // Simple JSON payload (no FormData needed since no images)
      const payload = {
        description: formData.description,
        clothes: formData.requestData.clothes,
        stationary: formData.requestData.stationary,
        foods: formData.requestData.foods,
        furniture: formData.requestData.furniture,
        electronics: formData.requestData.electronics
      };

      // Log what we're sending
      console.log('Sending JSON payload:', payload);

      const response = await fetch('http://localhost:5001/request/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setResponse({
        status: response.status,
        data: result
      });

      if (response.ok) {
        console.log('Success:', result);
        // Reset form on success
        setFormData({
          description: '',
          requestData: {
            clothes: {},
            stationary: {},
            foods: {},
            furniture: {},
            electronics: {}
          }
        });
        setFiles({
          clothesImages: [],
          stationaryImages: [],
          foodsImages: [],
          furnitureImages: [],
          electronicsImages: []
        });
      } else {
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
      setResponse({
        status: 'error',
        data: { error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick add sample data
  const addSampleData = () => {
    setFormData({
      description: 'Need urgent help for family of 4 - lost everything in recent flood',
      requestData: {
        clothes: {
          'shirt': { count: 4 },
          'pant': { count: 4 },
          'sweater': { count: 2 },
          'jacket': { count: 2 }
        },
        stationary: {
          'notebooks': { count: 10 },
          'pens': { count: 20 },
          'pencils': { count: 15 }
        },
        foods: {
          'rice': { count: 5 },
          'wheat': { count: 3 },
          'dal': { count: 2 },
          'oil': { count: 1 }
        },
        furniture: {
          'bed': { count: 2 },
          'chair': { count: 4 },
          'table': { count: 1 }
        },
        electronics: {
          'mobile': { count: 1 },
          'charger': { count: 2 }
        }
      }
    });
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Request Create API (No Images - Just Items & Counts)</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '5px' }}>
        <strong>Note:</strong> This is for requesting items (no images needed). People will just specify what items they need and how many.
      </div>
      
      <button 
        onClick={addSampleData}
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Fill Sample Data
      </button>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description:
          </label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Describe your request..."
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #ccc',
              minHeight: '80px'
            }}
          />
        </div>

        {/* Categories */}
        {['clothes', 'stationary', 'foods', 'furniture', 'electronics'].map(category => (
          <CategorySection
            key={category}
            category={category}
            items={formData.requestData[category]}
            onAddItem={addItemToCategory}
            onRemoveItem={removeItemFromCategory}
          />
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Creating Request...' : 'Create Request'}
        </button>
      </form>

      {/* Response Display */}
      {response && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: response.status === 200 || response.status === 201 ? '#d4edda' : '#f8d7da',
          border: `1px solid ${response.status === 200 || response.status === 201 ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h3>Response (Status: {response.status}):</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Category Section Component (simplified - no file uploads)
function CategorySection({ category, items, onAddItem, onRemoveItem }) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCount, setNewItemCount] = useState('');

  const handleAddItem = () => {
    if (newItemName && newItemCount) {
      onAddItem(category, newItemName, newItemCount);
      setNewItemName('');
      setNewItemCount('');
    }
  };

  return (
    <div style={{ 
      marginBottom: '30px', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginTop: '0', textTransform: 'capitalize', color: '#333' }}>
        {category}
      </h3>

      {/* Add New Item */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder={`Item name (e.g., ${category === 'clothes' ? 'shirt, pant' : category === 'foods' ? 'rice, dal' : 'notebook, pen'})`}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          style={{ 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            flex: '1',
            minWidth: '200px'
          }}
        />
        <input
          type="number"
          placeholder="Count"
          value={newItemCount}
          onChange={(e) => setNewItemCount(e.target.value)}
          style={{ 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            width: '80px'
          }}
        />
        <button
          type="button"
          onClick={handleAddItem}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {/* Display Items */}
      {Object.keys(items).length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h4>Requested Items:</h4>
          {Object.entries(items).map(([itemName, itemData]) => (
            <div key={itemName} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontWeight: '500' }}>
                {itemName}: <span style={{ color: '#007bff' }}>{itemData.count} needed</span>
              </span>
              <button
                type="button"
                onClick={() => onRemoveItem(category, itemName)}
                style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {Object.keys(items).length === 0 && (
        <p style={{ color: '#666', fontStyle: 'italic', margin: '10px 0' }}>
          No items requested in this category yet.
        </p>
      )}
    </div>
  );
}

export default App;
