import React, { useState, useEffect } from 'react';
import { getProviderMandaps } from '../../services/mandapApi';
import MandapCard from '../../components/mandap/MandapCard';

const MandapsListPage = () => {
  const [mandaps, setMandaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchMandaps = async () => {
    try {
      setLoading(true);
      const mandapsData = await getProviderMandaps();
      setMandaps(mandapsData);
    } catch (error) {
      console.error("Error fetching mandaps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandaps();
  }, []);

  const handleDelete = (mandapId) => {
    setMandaps(prevMandaps => prevMandaps.filter(mandap => mandap._id !== mandapId));
  };

  const filteredMandaps = mandaps.filter(mandap => {
    const matchesSearch = (mandap.mandapName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (mandap.mandapDesc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (mandap.address?.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'high-capacity' && mandap.guestCapacity >= 400) return matchesSearch;
    if (filter === 'medium-capacity' && mandap.guestCapacity < 400 && mandap.guestCapacity >= 200) return matchesSearch;
    if (filter === 'low-capacity' && mandap.guestCapacity < 200) return matchesSearch;
    
    return false;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Wedding Venues</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Venues</option>
            <option value="high-capacity">High Capacity (400+)</option>
            <option value="medium-capacity">Medium Capacity (200-399)</option>
            <option value="low-capacity">Low Capacity (&lt;200)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMandaps.map(mandap => (
          <MandapCard key={mandap._id} mandap={mandap} onDelete={handleDelete} />
        ))}
      </div>

      {filteredMandaps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No venues found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MandapsListPage;