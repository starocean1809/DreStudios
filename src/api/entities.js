const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const Query = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All Products') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await fetch(`${API_URL}/products?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  },
  
  get: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  },
  
  create: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to create product');
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
    return data;
  },
  
  register: async (email, phone, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Registration failed');
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      localStorage.removeItem('token');
      return null;
    }
    return await response.json();
  }
};

export const Orders = {
  create: async (productId, addressData = {}) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        product_id: productId,
        ...addressData
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to place order');
    return data;
  },
  
  list: async () => {
    const response = await fetch(`${API_URL}/orders?t=${Date.now()}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  },
  
  updateMilestone: async (orderId, milestoneId, updateData) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/milestone/${milestoneId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update milestone');
    return data;
  },

  updateStatus: async (orderId, status) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
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
    const response = await fetch(`${API_URL}/cart`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  },
  
  add: async (productId, quantity = 1) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return await response.json();
  },
  
  update: async (itemId, quantity) => {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return await response.json();
  },
  
  remove: async (itemId) => {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to remove item');
    return await response.json();
  },

  clear: async () => {
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return await response.json();
  }
};
