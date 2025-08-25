import React, { useState } from 'react';

function DonationTest() {
  const [formData, setFormData] = useState({
    requestId: '',
    description: '',
    donationData: {
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

  // Mock donor token for testing (replace with actual auth token)
  const mockDonorToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZhYjY5YzUwZjU5MzAwMTM4NGQ4YjgiLCJyb2xlIjoiZG9ub3IiLCJpYXQiOjE3MzUxNDQxNDh9.test";

  // Handle input changes for description and requestId
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add item to category for donation
  const addDonationItem = (category, itemName, count) => {
    if (!itemName || !count) return;
    
    setFormData(prev => ({
      ...prev,
      donationData: {
        ...prev.donationData,
        [category]: {
          ...prev.donationData[category],
          [itemName]: { count: parseInt(count) }
        }
      }
    }));
  };

  // Remove item from category
  const removeDonationItem = (category, itemName) => {
    setFormData(prev => {
      const newDonationData = { ...prev.donationData };
      delete newDonationData[category][itemName];
      return {
        ...prev,
        donationData: newDonationData
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

  // Submit donation form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('requestId', formData.requestId);
      formDataToSend.append('description', formData.description);
      
      // Add donation data as JSON string
      formDataToSend.append('donationData', JSON.stringify(formData.donationData));

      // Add files for each category
      Object.keys(files).forEach(categoryKey => {
        files[categoryKey].forEach(file => {
          formDataToSend.append(categoryKey, file);
        });
      });

      // Log what we're sending
      console.log('Sending donation data:');
      console.log('Request ID:', formData.requestId);
      console.log('Description:', formData.description);
      console.log('Donation Data:', formData.donationData);
      console.log('Files:', files);

      const response = await fetch('http://localhost:5001/donation/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockDonorToken}`,
          // Don't set Content-Type for FormData, let browser set it
        },
        body: formDataToSend,
      });

      const result = await response.json();
      setResponse({
        status: response.status,
        data: result
      });

      if (response.ok) {
        console.log('Donation Success:', result);
        // Reset form on success
        setFormData({
          requestId: '',
          description: '',
          donationData: {
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
        console.error('Donation Error:', result);
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

  // Quick add sample donation data
  const addSampleDonationData = () => {
    setFormData({
      requestId: '675d1234567890abcdef1234', // Sample request ID - update with real one
      description: 'Happy to help! I have these items in good condition.',
      donationData: {
        clothes: {
          'shirt': { count: 2 },
          'pant': { count: 1 }
        },
        stationary: {
          'notebooks': { count: 5 },
          'pens': { count: 10 }
        },
        foods: {
          'rice': { count: 2 },
          'dal': { count: 1 }
        },
        furniture: {
          'chair': { count: 2 }
        },
        electronics: {
          'mobile': { count: 1 }
        }
      }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Test Donation Create API</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '5px' }}>
        <strong>🎁 Donor Testing:</strong> This tests the donation creation where donors upload items with images to fulfill specific requests.
      </div>

      <button 
        onClick={addSampleDonationData}
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#4caf50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Fill Sample Donation Data
      </button>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        {/* Request ID */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Request ID (that you want to donate to):
          </label>
          <input
            type="text"
            value={formData.requestId}
            onChange={(e) => handleInputChange('requestId', e.target.value)}
            placeholder="Enter the request ID you want to help with..."
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #ccc'
            }}
            required
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            💡 Tip: Create a request first using the Request Test component, then copy the ID from the response
          </small>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Donation Message:
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Add a message about your donation..."
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
          <DonationCategorySection
            key={category}
            category={category}
            items={formData.donationData[category]}
            onAddItem={addDonationItem}
            onRemoveItem={removeDonationItem}
            onFileChange={handleFileChange}
            files={files[`${category}Images`]}
          />
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.requestId}
          style={{
            padding: '15px 30px',
            backgroundColor: loading || !formData.requestId ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading || !formData.requestId ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Creating Donation...' : 'Donate Items'}
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

// Donation Category Section Component
function DonationCategorySection({ category, items, onAddItem, onRemoveItem, onFileChange, files }) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCount, setNewItemCount] = useState('');

  const handleAddItem = () => {
    if (newItemName && newItemCount) {
      onAddItem(category, newItemName, newItemCount);
      setNewItemName('');
      setNewItemCount('');
    }
  };

  const getCategoryExamples = (cat) => {
    const examples = {
      clothes: 'shirt, pant, sweater',
      stationary: 'notebook, pen, pencil',
      foods: 'rice, dal, oil',
      furniture: 'chair, table, bed',
      electronics: 'mobile, charger, laptop'
    };
    return examples[cat] || 'item name';
  };

  return (
    <div style={{ 
      marginBottom: '30px', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f0f8f0'
    }}>
      <h3 style={{ marginTop: '0', textTransform: 'capitalize', color: '#2e7d32' }}>
        🎁 Donate {category}
      </h3>

      {/* Add New Donation Item */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder={`Item name (e.g., ${getCategoryExamples(category)})`}
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
          placeholder="Count to donate"
          value={newItemCount}
          onChange={(e) => setNewItemCount(e.target.value)}
          style={{ 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            width: '120px'
          }}
        />
        <button
          type="button"
          onClick={handleAddItem}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {/* Display Donation Items */}
      {Object.keys(items).length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h4>Items you're donating:</h4>
          {Object.entries(items).map(([itemName, itemData]) => (
            <div key={itemName} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #ddd'
            }}>
              <span style={{ fontWeight: '500' }}>
                {itemName}: <span style={{ color: '#4caf50' }}>{itemData.count} items</span>
              </span>
              <button
                type="button"
                onClick={() => onRemoveItem(category, itemName)}
                style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#f44336', 
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

      {/* File Upload for Images */}
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Upload Images of {category} items:
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onFileChange(category, e.target.files)}
          style={{ 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            width: '100%'
          }}
        />
        {files.length > 0 && (
          <div style={{ marginTop: '5px', fontSize: '14px', color: '#4caf50' }}>
            📷 {files.length} image(s) selected: {files.map(f => f.name).join(', ')}
          </div>
        )}
        <small style={{ color: '#666', fontSize: '12px' }}>
          💡 Upload clear photos showing the condition of items
        </small>
      </div>

      {Object.keys(items).length === 0 && (
        <p style={{ color: '#666', fontStyle: 'italic', margin: '10px 0' }}>
          No items added for donation in this category yet.
        </p>
      )}
    </div>
  );
}

export default DonationTest;
