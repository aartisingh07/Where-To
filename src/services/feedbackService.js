import api from './api';

export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },
  getFeedbacks: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/feedback/${id}/status`, { status });
    return response.data;
  },
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },
};

export default feedbackService;
