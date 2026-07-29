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
};

export default feedbackService;
