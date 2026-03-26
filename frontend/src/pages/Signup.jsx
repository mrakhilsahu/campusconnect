import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    collegeCode: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  // ✅ AUTO LOGIN + ROLE REDIRECT
  useEffect(() => {
    if (user) {
      if (user.role === "STUDENT") navigate("/student");
      else if (user.role === "TEACHER") navigate("/teacher");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Signup</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input name="name" placeholder="Name" className="w-full mb-3 p-2 border rounded" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" onChange={handleChange} required />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <select name="role" className="w-full mb-3 p-2 border rounded" onChange={handleChange}>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>

        <input name="collegeCode" placeholder="College Code" className="w-full mb-4 p-2 border rounded" onChange={handleChange} required />

        <button disabled={loading} className="w-full bg-black text-white py-2 rounded">
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
