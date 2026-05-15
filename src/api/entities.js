//const API_URL = 'https://hari-3d-business.onrender.com/api';
const API_URL = 'http://localhost:5000/api';

// Helper for handling fetch with token refresh
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  let response = await fetch(url, { ...options, headers });

  // If unauthorized, try refreshing the token
  if (response.status === 401 && localStorage.getItem('refresh_token')) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
        }
      });

      if (refreshResponse.ok) {
        const { access_token } = await refreshResponse.json();
        localStorage.setItem('token', access_token);
        
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${access_token}`;
        response = await fetch(url, { ...options, headers });
      } else {
        // Refresh failed - logout
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }

  return response;
};

export const Query = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All Products') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await apiFetch(`${API_URL}/products?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  },

  get: async (id) => {
    const response = await apiFetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  },

  create: async (productData) => {
    const response = await apiFetch(`${API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to create product');
    return data;
  },

  delete: async (id) => {
    const response = await apiFetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to delete product');
    return data;
  },

  update: async (id, productData) => {
    const response = await apiFetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update product');
    return data;
  },
  toggleStock: async (id) => {
    const response = await apiFetch(`${API_URL}/products/${id}/toggle-stock`, {
      method: 'POST'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to toggle stock');
    return data;
  }
};

export const Auth = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Login failed');
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  },

  sendOtp: async (email) => {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to send OTP');
    return data;
  },

  verifyOtp: async (email, otp) => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to verify OTP');
    return data;
  },

  requestPasswordReset: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to send reset link');
    return data;
  },

  resetPassword: async (token, password) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to reset password');
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Registration failed');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await apiFetch(`${API_URL}/auth/me`);
    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      return null;
    }
    return await response.json();
  },

  updateProfile: async (profileData) => {
    const response = await apiFetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update profile');
    return data;
  }
};

export const Orders = {
  create: async (payload) => {
    const response = await apiFetch(`${API_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to place order');
    return data;
  },

  list: async () => {
    const response = await apiFetch(`${API_URL}/orders?t=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  },

  updateMilestone: async (orderId, milestoneId, updateData) => {
    const response = await apiFetch(`${API_URL}/orders/${orderId}/milestone/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update milestone');
    return data;
  },

  updateStatus: async (orderId, status) => {
    const response = await apiFetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update status');
    return data;
  }
};

export const User = {
  me: Auth.getMe,
};

export const Cart = {
  list: async () => {
    const response = await apiFetch(`${API_URL}/cart`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  },

  add: async (productId, quantity = 1) => {
    const response = await apiFetch(`${API_URL}/cart`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return await response.json();
  },

  update: async (itemId, quantity) => {
    const response = await apiFetch(`${API_URL}/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return await response.json();
  },

  remove: async (itemId) => {
    const response = await apiFetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove item');
    return await response.json();
  },

  clear: async () => {
    const response = await apiFetch(`${API_URL}/cart/clear`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return await response.json();
  }
};

export const Reviews = {
  list: async (productId) => {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  },

  create: async (reviewData) => {
    const response = await apiFetch(`${API_URL}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to submit review');
    return data;
  }
};

export const AdminStats = {
  getOverview: async () => {
    const response = await apiFetch(`${API_URL}/stats/overview`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to fetch stats');
    return data;
  }
};

export const Settings = {
  get: async () => {
    const response = await apiFetch(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  },
  update: async (data) => {
    const response = await apiFetch(`${API_URL}/settings`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
  },
  init: async () => {
    const response = await apiFetch(`${API_URL}/settings/init`);
    return await response.json();
  }
};

export const Invoices = {
  getStats: async () => {
    const response = await apiFetch(`${API_URL}/stats/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoice stats');
    return await response.json();
  }
};

export const Payments = {
  createOrder: async (amount) => {
    const response = await apiFetch(`${API_URL}/payments/create-order`, {
      method: 'POST',
      body: JSON.stringify({ amount: Math.round(amount * 100) }) // Convert to paise
    });
    if (!response.ok) throw new Error('Failed to create Razorpay order');
    return await response.json();
  },
  verifyPayment: async (paymentData) => {
    const response = await apiFetch(`${API_URL}/payments/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error('Payment verification failed');
    return await response.json();
  }
};
