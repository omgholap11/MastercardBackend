import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, HandHeart } from 'lucide-react';

const RegisterOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Join Seva Sahayog</h1>
          <p className="text-secondary">Choose how you'd like to contribute to our community</p>
        </div>

        {/* Registration Options */}
        <div className="space-y-4">
          {/* Donor Registration */}
          <div 
            onClick={() => navigate('/auth/donor/signup')}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700">Register as Donor</h3>
                <p className="text-sm text-gray-600">Share your resources and help those in need</p>
              </div>
              <div className="text-green-600 group-hover:text-green-700">→</div>
            </div>
          </div>

          {/* Receiver Registration */}
          <div 
            onClick={() => navigate('/auth/receiver/signup')}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <HandHeart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">Register as Receiver</h3>
                <p className="text-sm text-gray-600">Request help and receive donations</p>
              </div>
              <div className="text-blue-600 group-hover:text-blue-700">→</div>
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/auth/donor/signin')}
              className="flex-1 px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-all duration-200 font-medium"
            >
              Donor Sign In
            </button>
            <button
              onClick={() => navigate('/auth/receiver/signin')}
              className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
            >
              Receiver Sign In
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-primary transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterOptions;
