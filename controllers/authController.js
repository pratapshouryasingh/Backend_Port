export const login = (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'password123';

    if (username === adminUser && password === adminPass) {
      return res.json({
        success: true,
        message: 'Authentication successful',
        data: {
          username: adminUser,
          token: `auth-token-${Date.now()}`
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
