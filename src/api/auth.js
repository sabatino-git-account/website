const notConfigured = () => {
  throw new Error('Authentication is not configured yet.');
};

export const auth = {
  loginViaEmailPassword: notConfigured,
  loginWithProvider: notConfigured,
  register: notConfigured,
  verifyOtp: notConfigured,
  resendOtp: notConfigured,
  resetPasswordRequest: notConfigured,
  resetPassword: notConfigured,
  me: async () => null,
  logout: () => {},
  setToken: () => {},
  redirectToLogin: (returnUrl) => {
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl || '/')}`;
  },
};
