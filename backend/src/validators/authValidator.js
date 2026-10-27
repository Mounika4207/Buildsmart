/**
 * Lightweight request validation helpers for authentication
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Full name is required.',
    });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.',
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  // Security Rule: Public users can never assign themselves the admin role
  if (role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Public registration for Administrator role is strictly prohibited.',
    });
  }

  if (role && !['customer', 'owner'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Role must be either 'customer' or 'owner'.",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
