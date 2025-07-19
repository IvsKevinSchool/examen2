import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss, 
  type = 'error' 
}) => {
  return (
    <div className={`error-message error-message-${type}`}>
      <div className="error-content">
        <AlertCircle size={20} />
        <span className="error-text">{message}</span>
      </div>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
