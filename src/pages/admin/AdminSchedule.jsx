import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const locations = ['Dundalk', 'Drogheda', 'Dublin', 'Belfast'];

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      days.push({
        date: date.toISOString(),
        dayName: date.toLocaleDateString('en-IE', { weekday: 'long' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-IE', { month: 'short' }),
        location: ''
      });
    }
    return days;
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const result = await api.getAvailableSchedules();

      // Merge fetched schedules with next 7 days template
      const next7Days = getNext7Days();

      if (result.success && result.schedules) {
        next7Days.forEach((day, index) => {
          const existingSchedule = result.schedules.find(s => {
            const scheduleDate = new Date(s.date);
            const dayDate = new Date(day.date);
            return scheduleDate.toDateString() === dayDate.toDateString();
          });

          if (existingSchedule) {
            next7Days[index].location = existingSchedule.location;
            next7Days[index]._id = existingSchedule._id;
          }
        });
      }

      setSchedules(next7Days);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setMessage({ type: 'error', text: 'Failed to load schedules' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (index, location) => {
    const updated = [...schedules];
    updated[index].location = location;
    setSchedules(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const schedulesToSave = schedules
        .filter(s => s.location)
        .map(s => ({
          date: s.date,
          location: s.location
        }));

      const result = await api.setWeekSchedules(schedulesToSave);

      if (result.success) {
        setMessage({ type: 'success', text: 'Schedules saved successfully!' });
        fetchSchedules();
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to save schedules' });
      }
    } catch (error) {
      console.error('Error saving schedules:', error);
      setMessage({ type: 'error', text: 'Failed to save schedules' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-white">Schedule Manager</h1>
          <p className="text-gray-400 mt-1">Set your location for each day of the week</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-3 rounded-sm font-heading transition-all ${
            isSaving
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-brand-red text-white hover:bg-red-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-sm mb-6 ${
          message.type === 'success'
            ? 'bg-green-500/20 border border-green-500/30 text-green-500'
            : 'bg-red-500/20 border border-red-500/30 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Schedule Grid */}
      {isLoading ? (
        <div className="bg-brand-surface border border-white/10 rounded-sm p-8 text-center">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading schedules...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.date}
              className="bg-brand-surface border border-white/10 rounded-sm p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-dark rounded-sm flex flex-col items-center justify-center">
                  <span className="text-brand-red font-heading text-xl">{schedule.dayNumber}</span>
                  <span className="text-gray-500 text-xs uppercase">{schedule.month}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{schedule.dayName}</p>
                  <p className="text-gray-500 text-sm">
                    {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={schedule.location}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  className="bg-brand-dark border border-white/10 rounded-sm px-4 py-3 text-white focus:border-brand-red focus:outline-none min-w-[180px]"
                >
                  <option value="">-- Select Location --</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                {schedule.location && (
                  <span className="text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-brand-surface border border-white/10 rounded-sm">
        <h3 className="text-white font-medium mb-2">Tips</h3>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Set a location to enable bookings for that day</li>
          <li>• Leave empty to disable bookings for that day</li>
          <li>• After-hours bookings are available for all locations</li>
          <li>• Don't forget to click "Save Changes" after making updates</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSchedule;
