import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiUserLine, RiBookOpenLine, RiMoneyDollarCircleLine, RiLogoutBoxLine, RiAddLine, RiEditLine, RiDeleteBinLine, RiUploadLine } from '@remixicon/react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    loadData();
    loadAllUsers();
    loadCourses();

    // Real-time polling for Purchased Courses tab
    let interval;
    if (activeTab === 'purchased-courses') {
      interval = setInterval(() => {
        loadData();
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const loadAllUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Load all users error:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Load courses error:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'users') {
        const response = await fetch('http://localhost:5000/api/admin/users', { headers });
        const data = await response.json();
        setUsers(data);
      } else if (activeTab === 'courses') {
        const response = await fetch('http://localhost:5000/api/admin/courses', { headers });
        const data = await response.json();
        setCourses(data);
      } else if (activeTab === 'pricing') {
        const response = await fetch('http://localhost:5000/api/admin/pricing', { headers });
        const data = await response.json();
        setPricing(data);
      } else if (activeTab === 'purchased-courses') {
        const response = await fetch('http://localhost:5000/api/admin/purchased-courses', { headers });
        const data = await response.json();
        setPurchasedCourses(data);
      } else if (activeTab === 'purchases') {
        const response = await fetch('http://localhost:5000/api/admin/purchases', { headers });
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const loadLatestPurchase = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/purchase/latest-purchase', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const latestPurchase = await response.json();
        return latestPurchase;
      }
    } catch (error) {
      console.error('Load latest purchase error:', error);
    }
    return null;
  };

  const openModal = async (type, item = null) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'purchases' && !item) {
      // For new purchases, populate with latest purchase data
      const latestPurchase = await loadLatestPurchase();
      if (latestPurchase) {
        setFormData({
          userId: latestPurchase.userId?._id || '',
          paidCourse: latestPurchase.paidCourse?.id || '',
          amount: latestPurchase.amount || '',
          phoneNumber: latestPurchase.phoneNumber || '',
          mpesaMessage: latestPurchase.mpesaMessage || '',
          status: 'paid'
        });
      } else {
        setFormData({});
      }
    } else {
      setFormData(item || {});
    }

    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Image uploaded successfully');
        return data.imageData; // Return base64 data
      } else {
        toast.error('Image upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageData = formData.img;

      // Upload image if selected
      if (imageFile) {
        imageData = await handleImageUpload(imageFile);
        if (!imageData) return; // Stop if upload failed
      }

      // Ensure paidCourse is sent as an ObjectId (string) if it's an object
      const normalizedForm = { ...formData };
      if (normalizedForm.paidCourse && typeof normalizedForm.paidCourse === 'object') {
        normalizedForm.paidCourse = normalizedForm.paidCourse._id || normalizedForm.paidCourse.id || normalizedForm.paidCourse;
      }
      const submitData = { ...normalizedForm, img: imageData };

      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      let url, method;
      if (editingItem) {
        url = `http://localhost:5000/api/admin/${modalType}/${editingItem._id}`;
        method = 'PUT';
      } else {
        url = `http://localhost:5000/api/admin/${modalType}`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast.success(`${modalType.slice(0, -1)} ${editingItem ? 'updated' : 'created'} successfully`);
        closeModal();
        loadData();
      } else {
        toast.error('Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success(`${type.slice(0, -1)} deleted successfully`);
        loadData();
      } else {
        toast.error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    }
  };

  const renderUsersTable = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Users Management</h3>
        <span className="text-gray-400">{users.length} users</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300">Name</th>
              <th className="pb-3 text-gray-300">Email</th>
              <th className="pb-3 text-gray-300">Verified</th>
              <th className="pb-3 text-gray-300">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-700">
                <td className="py-3 text-white">{user.name}</td>
                <td className="py-3 text-gray-300">{user.email}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${user.isVerified ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {user.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-3 text-gray-300">{new Date(user.lastLogin).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCoursesTable = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Courses Management</h3>
        <button
          onClick={() => openModal('courses')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <RiAddLine size={16} />
          Add Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300">ID</th>
              <th className="pb-3 text-gray-300">Title</th>
              <th className="pb-3 text-gray-300">Instructor</th>
              <th className="pb-3 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b border-gray-700">
                <td className="py-3 text-white">{course.id}</td>
                <td className="py-3 text-white">{course.title}</td>
                <td className="py-3 text-gray-300">{course.instructor}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('courses', course)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <RiEditLine size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete('courses', course._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPricingTable = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Pricing Management</h3>
        <button
          onClick={() => openModal('pricing')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <RiAddLine size={16} />
          Add Plan
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300">ID</th>
              <th className="pb-3 text-gray-300">Name</th>
              <th className="pb-3 text-gray-300">Price</th>
              <th className="pb-3 text-gray-300">Popular</th>
              <th className="pb-3 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pricing.map((plan) => (
              <tr key={plan._id} className="border-b border-gray-700">
                <td className="py-3 text-white">{plan.id}</td>
                <td className="py-3 text-white">{plan.name}</td>
                <td className="py-3 text-gray-300">${plan.price}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${plan.popular ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                    {plan.popular ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('pricing', plan)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <RiEditLine size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete('pricing', plan._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPurchasedCoursesTable = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Purchased Courses Management</h3>
        <button
          onClick={() => openModal('purchased-courses')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <RiAddLine size={16} />
          Add Purchased Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300">ID</th>
              <th className="pb-3 text-gray-300">Title</th>
              <th className="pb-3 text-gray-300">Instructor</th>
              <th className="pb-3 text-gray-300">User</th>
              <th className="pb-3 text-gray-300">Date</th>
              <th className="pb-3 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchasedCourses.map((purchase) => (
              <tr key={purchase._id} className="border-b border-gray-700">
                <td className="py-3 text-white">{purchase.id}</td>
                <td className="py-3 text-white">{purchase.title}</td>
                <td className="py-3 text-gray-300">{purchase.instructor}</td>
                <td className="py-3 text-gray-300">{purchase.userId?.name || purchase.userId?.email || 'N/A'}</td>
                <td className="py-3 text-gray-300">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('purchased-courses', purchase)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <RiEditLine size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete('purchased-courses', purchase._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPurchasesTable = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Purchases Management</h3>
        <button
          onClick={() => openModal('purchases')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <RiAddLine size={16} />
          Add Purchase
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300">User</th>
              <th className="pb-3 text-gray-300">Course</th>
              <th className="pb-3 text-gray-300">Amount</th>
              <th className="pb-3 text-gray-300">Phone</th>
              <th className="pb-3 text-gray-300">Status</th>
              <th className="pb-3 text-gray-300">Date</th>
              <th className="pb-3 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id} className="border-b border-gray-700">
                <td className="py-3 text-white">{purchase.userId?.name || purchase.userId?.email || 'N/A'}</td>
                <td className="py-3 text-white">{purchase.paidCourse?.title}</td>
                <td className="py-3 text-gray-300">${purchase.amount || 'N/A'}</td>
                <td className="py-3 text-gray-300">{purchase.phoneNumber}</td>
                <td className="py-3"> 
                  <span className={`px-2 py-1 rounded text-xs ${purchase.status === 'paid' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {purchase.status}
                  </span>
                </td>
                <td className="py-3 text-gray-300">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('purchases', purchase)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <RiEditLine size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete('purchases', purchase._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} {modalType.slice(0, -1)}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {modalType === 'courses' && (
              <>
                <input
                  type="number"
                  placeholder="ID"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({...formData, id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Instructor"
                  value={formData.instructor || ''}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <select
                  value={formData.userId || ''}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                >
                  <option value="">Select User</option>
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  value={formData.text || ''}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={3}
                  required
                />
                <div className="space-y-2">
                  <label className="block text-white">Course Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-orange-500 file:text-white"
                  />
                  {uploadingImage && <p className="text-orange-400">Uploading image...</p>}
                  {formData.img && !imageFile && (
                    <img src={formData.img} alt="Current" className="w-20 h-20 object-cover rounded" />
                  )}
                </div>
              </>
            )}
            {modalType === 'pricing' && (
              <>
                <input
                  type="number"
                  placeholder="ID"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({...formData, id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Period (optional)"
                  value={formData.period || ''}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={2}
                  required
                />
                <input
                  type="text"
                  placeholder="Button Text"
                  value={formData.buttonText || ''}
                  onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.popular || false}
                    onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                    className="rounded"
                  />
                  Popular Plan
                </label>
              </>
            )}
            {modalType === 'purchased-courses' && (
              <>
                <input
                  type="number"
                  placeholder="ID"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({...formData, id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Instructor"
                  value={formData.instructor || ''}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.text || ''}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={3}
                  required
                />
                <select
                  value={formData.userId || ''}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                >
                  <option value="">Select User</option>
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                <div className="space-y-2">
                  <label className="block text-white">Course Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-orange-500 file:text-white"
                  />
                  {uploadingImage && <p className="text-orange-400">Uploading image...</p>}
                  {formData.img && !imageFile && (
                    <img src={formData.img} alt="Current" className="w-20 h-20 object-cover rounded" />
                  )}
                </div>
                <textarea
                  placeholder="Message (To thank user for purchasing the course)"
                  value={formData.message || ''}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={2}
                />
                <input
                  type="url"
                  placeholder="Course Link"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </>
            )}
            {modalType === 'purchases' && (
              <>
                <select
                  value={formData.userId || ''}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                >
                  <option value="">Select User</option>
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                <select
                  value={formData.paidCourse?._id || formData.paidCourse || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    // Try to find course by _id or id field
                    const selectedCourse = courses.find(c => c._id === selectedId || String(c.id) === String(selectedId));
                    if (selectedCourse) {
                      // If amount not set, autofill from course price
                      const updated = { ...formData, paidCourse: selectedCourse };
                      if (!updated.amount && selectedCourse.price) {
                        updated.amount = selectedCourse.price;
                      }
                      setFormData(updated);
                    } else {
                      // Fallback: store raw id if course object not found
                      setFormData({...formData, paidCourse: selectedId});
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                >
                  <option value="">Select Paid Course</option>
                  {courses.map((course) => (
                    <option key={course._id || course.id} value={course._id || course.id}>{course.title} - ${course.price || 'N/A'}</option>
                  ))}
                </select>
                {/* Selected course summary */}
                {formData.paidCourse && typeof formData.paidCourse === 'object' && (
                  <div className="mt-2 p-2 bg-gray-700 rounded text-sm text-gray-200">
                    <div className="font-medium">{formData.paidCourse.title}</div>
                    <div className="text-gray-400">Price: ${formData.paidCourse.price}</div>
                    {formData.paidCourse.instructor && <div className="text-gray-400">Instructor: {formData.paidCourse.instructor}</div>}
                  </div>
                )}
                <input
                  type="number"
                  placeholder="Amount"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <textarea
                  placeholder="M-PESA Message"
                  value={formData.mpesaMessage || ''}
                  onChange={(e) => setFormData({...formData, mpesaMessage: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={4}
                  required
                />
                <select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploadingImage}
                className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {uploadingImage ? 'Uploading...' : (editingItem ? 'Update' : 'Create')}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <RiLogoutBoxLine size={16} />
          Logout
        </button>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 px-4 py-2">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'users' ? 'bg-orange-500' : 'hover:bg-gray-700'}`}
          >
            <RiUserLine size={16} />
            Users
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'courses' ? 'bg-orange-500' : 'hover:bg-gray-700'}`}
          >
            <RiBookOpenLine size={16} />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'pricing' ? 'bg-orange-500' : 'hover:bg-gray-700'}`}
          >
            <RiMoneyDollarCircleLine size={16} />
            Pricing
          </button>
          <button
            onClick={() => setActiveTab('purchased-courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'purchased-courses' ? 'bg-orange-500' : 'hover:bg-gray-700'}`}
          >
            <RiBookOpenLine size={16} />
            Purchased Courses
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'purchases' ? 'bg-orange-500' : 'hover:bg-gray-700'}`}
          >
            <RiMoneyDollarCircleLine size={16} />
            Purchases
          </button>

        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && renderUsersTable()}
            {activeTab === 'courses' && renderCoursesTable()}
            {activeTab === 'pricing' && renderPricingTable()}
            {activeTab === 'purchased-courses' && renderPurchasedCoursesTable()}
            {activeTab === 'purchases' && renderPurchasesTable()}
          </>
        )}
      </main>

      {renderModal()}
    </div>
  );
};

export default AdminDashboardPage;
