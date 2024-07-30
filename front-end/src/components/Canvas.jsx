// components/Canvas.js
import React, { useState } from 'react';
import '../styles/Canvas.css';

function Canvas({ elements, setFormData, description, onDescriptionChange }) {
  const [warning, setWarning] = useState('');

  const updateElement = (id, updates) => {
    setFormData(prevData => ({
      ...prevData,
      fields: prevData.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  };

  const addOption = (id) => {
    setFormData(prevData => ({
      ...prevData,
      fields: prevData.fields.map(field => 
        field.id === id ? { ...field, options: [...(field.options || []), `Option ${field.options.length + 1}`] } : field
      )
    }));
  };

  const removeOption = (id, index) => {
    setFormData(prevData => ({
      ...prevData,
      fields: prevData.fields.map(field => 
        field.id === id ? { ...field, options: field.options.filter((_, i) => i !== index) } : field
      )
    }));
  };

  const removeField = (id) => {
    setFormData(prevData => {
      if (prevData.fields.length > 1) {
        setWarning('');
        return {
          ...prevData,
          fields: prevData.fields.filter(field => field.id !== id)
        };
      } else {
        setWarning('At least one form field is required');
        return prevData;
      }
    });
  };

  const renderFieldOptions = (element) => {
    switch (element.type) {
      case 'Text':
      case 'Number':
      case 'Email':
      case 'Phone':
      case 'Date':
        return null;
      case 'Radio':
      case 'Checkbox':
      case 'Dropdown':
      case 'WordRating':
        return (
          <div>
            <h4>Options:</h4>
            {element.options.map((option, index) => (
              <div key={index} className="option-container">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...element.options];
                    newOptions[index] = e.target.value;
                    updateElement(element.id, { options: newOptions });
                  }}
                />
                <button 
                  className="remove-button"
                  onClick={() => removeOption(element.id, index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={() => addOption(element.id)}>Add Option</button>
          </div>
        );
      case 'StarRating':
        return (
          <div>
            <label>
              Number of stars:
              <input
                type="number"
                min="1"
                max="10"
                value={element.starCount || 5}
                onChange={(e) => updateElement(element.id, { starCount: parseInt(e.target.value) })}
              />
            </label>
          </div>
        );
      case 'Image':
      case 'Video':
      case 'GIF':
        return (
          <div>
            <input
              type="text"
              placeholder="Enter URL"
              value={element.url || ''}
              onChange={(e) => updateElement(element.id, { url: e.target.value })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="canvas">
      {warning && <div className="warning">{warning}</div>}
      <textarea
        className="form-description"
        placeholder="Enter form description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      {elements.map((element) => (
        <div key={element.id} className="form-element">
          <div className="element-header">
            <input
              type="text"
              placeholder="Enter label"
              value={element.label}
              onChange={(e) => updateElement(element.id, { label: e.target.value })}
            />
            <button 
              className="remove-button"
              onClick={() => removeField(element.id)}
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter error message"
            value={element.errorMessage}
            onChange={(e) => updateElement(element.id, { errorMessage: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={element.required}
              onChange={(e) => updateElement(element.id, { required: e.target.checked })}
            />
            Required
          </label>
          {renderFieldOptions(element)}
        </div>
      ))}
    </div>
  );
}

export default Canvas;