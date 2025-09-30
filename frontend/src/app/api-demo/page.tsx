'use client';

import { useState, useEffect } from 'react';
import { api, handleApiError } from '@/lib/api';

interface ApiResponse {
  message?: string;
  timestamp: string;
  status: string;
  service?: string;
  version?: string;
  users?: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
  }>;
  total?: number;
}

export default function ApiDemo() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState<'hello' | 'health' | 'users'>('hello');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse;

      switch (endpoint) {
        case 'hello':
          response = await api.hello();
          break;
        case 'health':
          response = await api.health();
          break;
        case 'users':
          response = await api.users();
          break;
        default:
          throw new Error('Invalid endpoint');
      }

      setData(response);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Spring Boot + Next.js Integration Demo
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Selector</h2>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setEndpoint('hello')}
              className={`px-4 py-2 rounded ${
                endpoint === 'hello'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Hello
            </button>
            <button
              onClick={() => setEndpoint('health')}
              className={`px-4 py-2 rounded ${
                endpoint === 'health'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Health
            </button>
            <button
              onClick={() => setEndpoint('users')}
              className={`px-4 py-2 rounded ${
                endpoint === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Users
            </button>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">
                <strong>Error:</strong> {error}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Make sure your Spring Boot backend is running on port 8080
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-medium text-gray-900 mb-2">Raw Response:</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              {endpoint === 'users' && data.users && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Users Table:</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
